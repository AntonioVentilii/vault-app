import type { DirectoryDid } from '$declarations';
import { getChunk, putChunk } from '$lib/api/bucket.api';
import {
	commitUpload,
	getDownloadPlan,
	getUploadTokens,
	listFiles,
	startUpload
} from '$lib/api/directory.api';
import { CHUNK_SIZE } from '$lib/constants/app.constants';
import { DIRECTORY_CANISTER_ID } from '$lib/constants/directory.constants';
import { LEDGER_CANISTER_IDS } from '$lib/constants/ledger.constants';
import { approveIcrc2, getPrice, type LedgerType } from '$lib/services/payments.services';
import { filesStore, loadingFiles } from '$lib/stores/files.store';
import type { Identity } from '@icp-sdk/core/agent';
import type { Principal } from '@icp-sdk/core/principal';

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
	onProgress?: (progress: number) => void;
}): Promise<DirectoryDid.FileMeta> => {
	const ledgerId = LEDGER_CANISTER_IDS[ledgerType];

	const paymentType: DirectoryDid.PaymentType = { CallerPaysIcrc2Tokens: { ledger: ledgerId } };

	await approveIcrc2({
		identity,
		ledgerType,
		spender: DIRECTORY_CANISTER_ID,
		amount: getPrice({ action: 'START_UPLOAD', ledgerType })
	});

	const session = await startUpload({
		identity,
		fileName: file.name,
		mimeType: file.type,
		size: BigInt(file.size),
		paymentType
	});

	const chunkCount = session.expected_chunk_count;

	// Normally we want to do this in batches. For simplicity, we loop.
	// In a real app, use Promise.all with concurrency limit.
	for (let i = 0; i < chunkCount; i++) {
		const start = i * CHUNK_SIZE;
		const end = Math.min(start + CHUNK_SIZE, file.size);
		const blob = file.slice(start, end);
		const arrayBuffer = await blob.arrayBuffer();
		const data = new Uint8Array(arrayBuffer);

		// Get upload token for this chunk
		const tokenResult = await getUploadTokens({
			identity,
			uploadId: session.upload_id,
			chunkIndexes: [i]
		});
		const [token] = tokenResult;

		// Approve and put chunk to bucket
		await approveIcrc2({
			identity,
			ledgerType,
			spender: token.bucket_id,
			amount: getPrice({ action: 'PUT_CHUNK', ledgerType })
		});

		await putChunk({
			identity,
			token,
			chunkIndex: i,
			content: Array.from(data),
			paymentType
		});

		if (onProgress) {
			onProgress((i + 1) / chunkCount);
		}
	}

	const commit = await commitUpload({ identity, uploadId: session.upload_id });

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
