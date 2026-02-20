import type { DirectoryDid } from '$declarations';
import { getChunk, putChunk } from '$lib/api/bucket.api';
import {
	commitUpload,
	getDownloadPlan,
	getUploadTokens,
	listFiles,
	startUpload
} from '$lib/api/directory.api';
import { CHUNK_SIZE, ZERO } from '$lib/constants/app.constants';
import { DIRECTORY_CANISTER_ID } from '$lib/constants/directory.constants';
import { LEDGER_CANISTER_IDS } from '$lib/constants/ledger.constants';
import { approveIcrc2, getPrice, type LedgerType } from '$lib/services/payments.services';
import { filesStore, loadingFiles } from '$lib/stores/files.store';
import type { Identity } from '@icp-sdk/core/agent';
import type { Principal } from '@icp-sdk/core/principal';

const runWithConcurrencyLimit = async <T>({
	tasks,
	limit
}: {
	tasks: Array<() => Promise<T>>;
	limit: number;
}): Promise<T[]> => {
	if (limit < 1) {
		throw new Error('Concurrency limit must be at least 1');
	}

	const results: T[] = new Array(tasks.length);

	let nextIndex = 0;

	const worker = async (): Promise<void> => {
		while (true) {
			const i = nextIndex;

			nextIndex += 1;

			if (i >= tasks.length) {
				return;
			}

			results[i] = await tasks[i]();
		}
	};

	const workerCount = Math.min(limit, tasks.length);

	await Promise.all(Array.from({ length: workerCount }, () => worker()));

	return results;
};

/**
 * Uploads a file to Vault Core following the 3-phase protocol.
 */
export const uploadFile = async ({
	identity,
	file,
	ledgerType,
	onProgress
}: {
	identity: Identity;
	file: File;
	ledgerType: LedgerType;
	onProgress?: ({ progress, detail }: { progress: number; detail?: string }) => void;
}): Promise<DirectoryDid.FileMeta> => {
	const ledgerId = LEDGER_CANISTER_IDS[ledgerType];
	const paymentType: DirectoryDid.PaymentType = { CallerPaysIcrc2Tokens: { ledger: ledgerId } };

	onProgress?.({ progress: 0, detail: 'Approving tokens for session...' });
	await approveIcrc2({
		identity,
		ledgerType,
		spender: DIRECTORY_CANISTER_ID,
		amount: getPrice({ action: 'START_UPLOAD', ledgerType })
	});

	onProgress?.({ progress: 0.05, detail: 'Starting upload session...' });

	const session = await startUpload({
		identity,
		fileName: file.name,
		mimeType: file.type,
		size: BigInt(file.size),
		paymentType
	});

	const chunkCount = session.expected_chunk_count;

	// 2. Phase 2: Batch tokens and approvals
	const allChunkIndexes = Array.from({ length: chunkCount }, (_, i) => i);
	onProgress?.({ progress: 0.1, detail: 'Fetching upload tokens...' });
	const tokens = await getUploadTokens({
		identity,
		uploadId: session.upload_id,
		chunkIndexes: allChunkIndexes
	});

	// Group tokens by bucket to perform a single approval per bucket
	const bucketMap = new Map<string, { bucketId: Principal; amount: bigint }>();
	const pricePerChunk = getPrice({ action: 'PUT_CHUNK', ledgerType });

	for (const token of tokens) {
		const bid = token.bucket_id.toText();
		const current = bucketMap.get(bid) ?? { bucketId: token.bucket_id, amount: ZERO };
		bucketMap.set(bid, {
			...current,
			amount: current.amount + pricePerChunk
		});
	}

	// Single approval per bucket
	let bucketIndex = 0;
	for (const { bucketId, amount } of bucketMap.values()) {
		bucketIndex++;
		onProgress?.({
			progress: 0.1 + (bucketIndex / bucketMap.size) * 0.1,
			detail: `Approving bucket ${bucketIndex}/${bucketMap.size}...`
		});
		await approveIcrc2({
			identity,
			ledgerType,
			spender: bucketId,
			amount
		});
	}

	// 3. Phase 2: Concurrent Chunking
	const CONCURRENCY = 6;
	const chunkTasks = tokens.map((token, i) => async () => {
		if (onProgress) {
			onProgress({
				progress: 0.2 + (i / chunkCount) * 0.75,
				detail: `Preparing chunk ${i + 1}/${chunkCount}...`
			});
		}

		const start = i * CHUNK_SIZE;
		const end = Math.min(start + CHUNK_SIZE, file.size);
		const blob = file.slice(start, end);
		const arrayBuffer = await blob.arrayBuffer();
		const data = new Uint8Array(arrayBuffer);

		await putChunk({
			identity,
			token,
			chunkIndex: i,
			content: Array.from(data),
			paymentType
		});

		if (onProgress) {
			const decoder = new TextDecoder();
			const snippet = decoder.decode(data.slice(0, 100)).replace(/[\n\r\t]/g, ' ');

			onProgress({
				progress: 0.2 + ((i + 1) / chunkCount) * 0.75,
				detail: snippet.length > 0 ? snippet : `Chunk ${i + 1}/${chunkCount}`
			});
		}
	});

	await runWithConcurrencyLimit({ tasks: chunkTasks, limit: CONCURRENCY });

	// 4. Phase 3: Completion
	onProgress?.({ progress: 0.98, detail: 'Committing upload...' });
	const commit = await commitUpload({ identity, uploadId: session.upload_id });
	onProgress?.({ progress: 1, detail: 'Upload complete!' });

	return commit;
};

/**
 * Downloads a file from Vault Core.
 */
export const downloadFile = async ({
	identity,
	fileId
}: {
	identity: Identity;
	fileId: DirectoryDid.FileId;
}) => {
	const plan = await getDownloadPlan({ identity, fileId });

	const sortedChunks: Uint8Array[] = new Array(plan.chunk_count);

	// Fetch chunks concurrently
	await Promise.all(
		plan.locations.map(async (loc: { bucket: Principal; chunk_index: number }) => {
			const auth = plan.auth.find(
				(a: DirectoryDid.BucketAuth) => a.bucket_id.toText() === loc.bucket.toText()
			);
			if (!auth) {
				throw new Error(`No auth for bucket ${loc.bucket.toText()}`);
			}

			const chunkContent = await getChunk({
				identity,
				bucketId: loc.bucket,
				token: auth.token,
				chunkIndex: loc.chunk_index
			});

			sortedChunks[loc.chunk_index] = chunkContent;
		})
	);

	// Reassemble
	const blob = new Blob(sortedChunks as BlobPart[]);
	return blob;
};

export const refreshFiles = async (identity: Identity) => {
	loadingFiles.set(true);
	try {
		const files = await listFiles({ identity });
		filesStore.set(files);
	} catch (error: unknown) {
		console.error('Fetch files failed', error);
	} finally {
		loadingFiles.set(false);
	}
};
