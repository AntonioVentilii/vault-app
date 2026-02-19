import {
	idlFactoryCertifiedDirectory,
	idlFactoryDirectory,
	type DirectoryDid,
	type DirectoryService
} from '$declarations';
import type { CreateCanisterOptions } from '$lib/types/canister';
import { Canister, createServices, toNullable, type QueryParams } from '@dfinity/utils';
import type { Principal } from '@icp-sdk/core/principal';

export class DirectoryCanister extends Canister<DirectoryService> {
	static create(options: CreateCanisterOptions<DirectoryService>) {
		const { service, certifiedService, canisterId } = createServices<DirectoryService>({
			options,
			idlFactory: idlFactoryDirectory,
			certifiedIdlFactory: idlFactoryCertifiedDirectory
		});

		return new DirectoryCanister(canisterId, service, certifiedService);
	}

	listFiles = async (params: QueryParams): Promise<DirectoryDid.FileMeta[]> => {
		const { list_files } = this.caller(params);
		return await list_files();
	};

	getFileMeta = async ({
		fileId,
		...params
	}: {
		fileId: DirectoryDid.FileId;
	} & QueryParams): Promise<DirectoryDid.FileMeta> => {
		const { get_file_meta } = this.caller(params);
		const result = await get_file_meta(fileId);

		if ('Ok' in result) {
			return result.Ok;
		}

		throw new Error(`Failed to get file meta: ${JSON.stringify(result.Err)}`);
	};

	startUpload = async ({
		fileName,
		mimeType,
		size,
		paymentType,
		...params
	}: {
		fileName: string;
		mimeType: string;
		size: bigint;
		paymentType?: DirectoryDid.PaymentType;
	} & QueryParams): Promise<DirectoryDid.UploadSession> => {
		const { start_upload } = this.caller(params);
		const result = await start_upload(fileName, mimeType, size, toNullable(paymentType));

		if ('Ok' in result) {
			return result.Ok;
		}

		throw new Error(`Failed to start upload: ${JSON.stringify(result.Err)}`);
	};

	commitUpload = async ({
		uploadId,
		...params
	}: {
		uploadId: Uint8Array | number[];
	} & QueryParams): Promise<DirectoryDid.FileMeta> => {
		const { commit_upload } = this.caller(params);
		const result = await commit_upload(new Uint8Array(uploadId));

		if ('Ok' in result) {
			return result.Ok;
		}

		throw new Error(`Failed to commit upload: ${JSON.stringify(result.Err)}`);
	};

	abortUpload = async ({
		uploadId,
		...params
	}: {
		uploadId: Uint8Array | number[];
	} & QueryParams): Promise<void> => {
		const { abort_upload } = this.caller(params);
		const result = await abort_upload(new Uint8Array(uploadId));

		if ('Ok' in result) {
			return;
		}

		throw new Error(`Failed to abort upload: ${JSON.stringify(result.Err)}`);
	};

	getUploadTokens = async ({
		uploadId,
		chunkIndexes,
		...params
	}: {
		uploadId: Uint8Array | number[];
		chunkIndexes: number[] | Uint32Array;
	} & QueryParams): Promise<DirectoryDid.UploadToken[]> => {
		const { get_upload_tokens } = this.caller(params);
		const result = await get_upload_tokens(new Uint8Array(uploadId), new Uint32Array(chunkIndexes));

		if ('Ok' in result) {
			return result.Ok;
		}

		throw new Error(`Failed to get upload tokens: ${JSON.stringify(result.Err)}`);
	};

	getDownloadPlan = async ({
		fileId,
		...params
	}: {
		fileId: DirectoryDid.FileId;
	} & QueryParams): Promise<DirectoryDid.DownloadPlan> => {
		const { get_download_plan } = this.caller(params);
		const result = await get_download_plan(fileId);

		if ('Ok' in result) {
			return result.Ok;
		}

		throw new Error(`Failed to get download plan: ${JSON.stringify(result.Err)}`);
	};

	deleteFile = async ({
		fileId,
		...params
	}: {
		fileId: DirectoryDid.FileId;
	} & QueryParams): Promise<void> => {
		const { delete_file } = this.caller(params);
		const result = await delete_file(fileId);

		if ('Ok' in result) {
			return;
		}

		throw new Error(`Failed to delete file: ${JSON.stringify(result.Err)}`);
	};

	createShareLink = async ({
		fileId,
		ttl,
		...params
	}: {
		fileId: DirectoryDid.FileId;
		ttl: bigint;
	} & QueryParams): Promise<Uint8Array> => {
		const { create_share_link } = this.caller(params);
		const result = await create_share_link(fileId, ttl);

		if ('Ok' in result) {
			return result.Ok;
		}

		throw new Error(`Failed to create share link: ${JSON.stringify(result.Err)}`);
	};

	resolveShareLink = async ({
		token,
		...params
	}: {
		token: Uint8Array | number[];
	} & QueryParams): Promise<DirectoryDid.DownloadPlan> => {
		const { resolve_share_link } = this.caller(params);
		const result = await resolve_share_link(new Uint8Array(token));

		if ('Ok' in result) {
			return result.Ok;
		}

		throw new Error(`Failed to resolve share link: ${JSON.stringify(result.Err)}`);
	};

	revokeShareLink = async ({
		token,
		...params
	}: {
		token: Uint8Array | number[];
	} & QueryParams): Promise<void> => {
		const { revoke_share_link } = this.caller(params);
		const result = await revoke_share_link(new Uint8Array(token));

		if ('Ok' in result) {
			return;
		}

		throw new Error(`Failed to revoke share link: ${JSON.stringify(result.Err)}`);
	};

	addFileAccess = async ({
		fileId,
		principal,
		role,
		...params
	}: {
		fileId: DirectoryDid.FileId;
		principal: Principal;
		role: DirectoryDid.FileRole;
	} & QueryParams): Promise<void> => {
		const { add_file_access } = this.caller(params);
		const result = await add_file_access(fileId, principal, role);

		if ('Ok' in result) {
			return;
		}

		throw new Error(`Failed to add file access: ${JSON.stringify(result.Err)}`);
	};

	removeFileAccess = async ({
		fileId,
		principal,
		...params
	}: {
		fileId: DirectoryDid.FileId;
		principal: Principal;
	} & QueryParams): Promise<void> => {
		const { remove_file_access } = this.caller(params);
		const result = await remove_file_access(fileId, principal);

		if ('Ok' in result) {
			return;
		}

		throw new Error(`Failed to remove file access: ${JSON.stringify(result.Err)}`);
	};

	getUsage = async ({
		principal,
		...params
	}: {
		principal?: Principal;
	} & QueryParams): Promise<DirectoryDid.UserState> => {
		const { get_usage } = this.caller(params);
		return await get_usage(toNullable(principal));
	};

	getStatus = async (params: QueryParams): Promise<DirectoryDid.CanisterStatus> => {
		const { get_status } = this.caller(params);
		return await get_status();
	};

	getPricing = async (params: QueryParams): Promise<DirectoryDid.PricingConfig> => {
		const { get_pricing } = this.caller(params);
		return await get_pricing();
	};

	estimateUploadCost = async ({
		size,
		paymentType,
		...params
	}: {
		size: bigint;
		paymentType: DirectoryDid.PaymentType;
	} & QueryParams): Promise<bigint> => {
		const { estimate_upload_cost } = this.caller(params);
		return await estimate_upload_cost(size, paymentType);
	};

	topUpBalance = async ({
		amount,
		paymentType,
		...params
	}: {
		amount: bigint;
		paymentType: DirectoryDid.PaymentType;
	} & QueryParams): Promise<bigint> => {
		const { top_up_balance } = this.caller(params);
		const result = await top_up_balance(amount, paymentType);

		if ('Ok' in result) {
			return result.Ok;
		}

		throw new Error(`Failed to top up balance: ${JSON.stringify(result.Err)}`);
	};

	adminSetPricing = async ({
		rate,
		...params
	}: {
		rate: bigint;
	} & QueryParams): Promise<void> => {
		const { admin_set_pricing } = this.caller(params);
		const result = await admin_set_pricing(rate);

		if ('Ok' in result) {
			return;
		}

		throw new Error(`Failed to set pricing: ${JSON.stringify(result.Err)}`);
	};

	adminSetQuota = async ({
		principal,
		quota,
		...params
	}: {
		principal: Principal;
		quota: bigint;
	} & QueryParams): Promise<void> => {
		const { admin_set_quota } = this.caller(params);
		const result = await admin_set_quota(principal, quota);

		if ('Ok' in result) {
			return;
		}

		throw new Error(`Failed to set quota: ${JSON.stringify(result.Err)}`);
	};

	adminWithdraw = async ({
		to,
		amount,
		ledger,
		...params
	}: {
		to: Principal;
		amount: bigint;
		ledger: Principal;
	} & QueryParams): Promise<void> => {
		const { admin_withdraw } = this.caller(params);
		const result = await admin_withdraw(to, amount, ledger);

		if ('Ok' in result) {
			return;
		}

		throw new Error(`Failed to withdraw: ${JSON.stringify(result.Err)}`);
	};

	garbageCollect = async (params: QueryParams): Promise<void> => {
		const { garbage_collect } = this.caller(params);
		await garbage_collect();
	};

	provisionBucket = async ({
		principal,
		...params
	}: {
		principal: Principal;
	} & QueryParams): Promise<void> => {
		const { provision_bucket } = this.caller(params);
		const result = await provision_bucket(principal);

		if ('Ok' in result) {
			return;
		}

		throw new Error(`Failed to provision bucket: ${JSON.stringify(result.Err)}`);
	};

	reapExpiredUploads = async (params: QueryParams): Promise<void> => {
		const { reap_expired_uploads } = this.caller(params);
		await reap_expired_uploads();
	};

	reportChunkUploaded = async ({
		uploadId,
		chunkIndex,
		...params
	}: {
		uploadId: Uint8Array | number[];
		chunkIndex: number;
	} & QueryParams): Promise<void> => {
		const { report_chunk_uploaded } = this.caller(params);
		const result = await report_chunk_uploaded(new Uint8Array(uploadId), chunkIndex);

		if ('Ok' in result) {
			return;
		}

		throw new Error(`Failed to report chunk uploaded: ${JSON.stringify(result.Err)}`);
	};
}
