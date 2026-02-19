import type { DirectoryDid } from '$declarations';
import { getAgent } from '$lib/actors/agents.ic';
import { DirectoryCanister } from '$lib/canisters/directory.canister';
import { DIRECTORY_CANISTER_ID } from '$lib/constants/directory.constants';
import type { QueryParams } from '@dfinity/utils';
import type { Identity } from '@icp-sdk/core/agent';
import { Principal } from '@icp-sdk/core/principal';

export const listFiles = async ({
	certified,
	identity
}: {
	identity: Identity;
} & QueryParams): Promise<DirectoryDid.FileMeta[]> => {
	const { listFiles } = await directoryCanister({ identity });
	return await listFiles({ certified });
};

export const getFileMeta = async ({
	certified,
	identity,
	fileId
}: {
	identity: Identity;
	fileId: DirectoryDid.FileId;
} & QueryParams): Promise<DirectoryDid.FileMeta> => {
	const { getFileMeta } = await directoryCanister({ identity });
	return await getFileMeta({ certified, fileId });
};

export const startUpload = async ({
	certified,
	identity,
	...rest
}: {
	identity: Identity;
	fileName: string;
	mimeType: string;
	size: bigint;
	paymentType?: DirectoryDid.PaymentType;
} & QueryParams): Promise<DirectoryDid.UploadSession> => {
	const { startUpload } = await directoryCanister({ identity });
	return await startUpload({ certified, ...rest });
};

export const commitUpload = async ({
	certified,
	identity,
	uploadId
}: {
	identity: Identity;
	uploadId: Uint8Array | number[];
} & QueryParams): Promise<DirectoryDid.FileMeta> => {
	const { commitUpload } = await directoryCanister({ identity });
	return await commitUpload({ certified, uploadId });
};

export const abortUpload = async ({
	certified,
	identity,
	uploadId
}: {
	identity: Identity;
	uploadId: Uint8Array | number[];
} & QueryParams): Promise<void> => {
	const { abortUpload } = await directoryCanister({ identity });
	return await abortUpload({ certified, uploadId });
};

export const getUploadTokens = async ({
	certified,
	identity,
	uploadId,
	chunkIndexes
}: {
	identity: Identity;
	uploadId: Uint8Array | number[];
	chunkIndexes: number[];
} & QueryParams): Promise<DirectoryDid.UploadToken[]> => {
	const { getUploadTokens } = await directoryCanister({ identity });
	return await getUploadTokens({ certified, uploadId, chunkIndexes });
};

export const getDownloadPlan = async ({
	certified,
	identity,
	fileId
}: {
	identity: Identity;
	fileId: DirectoryDid.FileId;
} & QueryParams): Promise<DirectoryDid.DownloadPlan> => {
	const { getDownloadPlan } = await directoryCanister({ identity });
	return await getDownloadPlan({ certified, fileId });
};

export const deleteFile = async ({
	certified,
	identity,
	fileId
}: {
	identity: Identity;
	fileId: DirectoryDid.FileId;
} & QueryParams): Promise<void> => {
	const { deleteFile } = await directoryCanister({ identity });
	return await deleteFile({ certified, fileId });
};

export const createShareLink = async ({
	certified,
	identity,
	fileId,
	ttl
}: {
	identity: Identity;
	fileId: DirectoryDid.FileId;
	ttl: bigint;
} & QueryParams): Promise<Uint8Array> => {
	const { createShareLink } = await directoryCanister({ identity });
	return await createShareLink({ certified, fileId, ttl });
};

export const resolveShareLink = async ({
	certified,
	identity,
	token
}: {
	identity: Identity;
	token: Uint8Array | number[];
} & QueryParams): Promise<DirectoryDid.DownloadPlan> => {
	const { resolveShareLink } = await directoryCanister({ identity });
	return await resolveShareLink({ certified, token });
};

export const revokeShareLink = async ({
	certified,
	identity,
	token
}: {
	identity: Identity;
	token: Uint8Array | number[];
} & QueryParams): Promise<void> => {
	const { revokeShareLink } = await directoryCanister({ identity });
	return await revokeShareLink({ certified, token });
};

export const addFileAccess = async ({
	certified,
	identity,
	fileId,
	principal,
	role
}: {
	identity: Identity;
	fileId: DirectoryDid.FileId;
	principal: Principal;
	role: DirectoryDid.FileRole;
} & QueryParams): Promise<void> => {
	const { addFileAccess } = await directoryCanister({ identity });
	return await addFileAccess({ certified, fileId, principal, role });
};

export const removeFileAccess = async ({
	certified,
	identity,
	fileId,
	principal
}: {
	identity: Identity;
	fileId: DirectoryDid.FileId;
	principal: Principal;
} & QueryParams): Promise<void> => {
	const { removeFileAccess } = await directoryCanister({ identity });
	return await removeFileAccess({ certified, fileId, principal });
};

export const getUsage = async ({
	certified,
	identity,
	principal
}: {
	identity: Identity;
	principal?: Principal;
} & QueryParams): Promise<DirectoryDid.UserState> => {
	const { getUsage } = await directoryCanister({ identity });
	return await getUsage({ certified, principal });
};

export const getStatus = async ({
	certified,
	identity
}: {
	identity: Identity;
} & QueryParams): Promise<DirectoryDid.CanisterStatus> => {
	const { getStatus } = await directoryCanister({ identity });
	return await getStatus({ certified });
};

export const getPricing = async ({
	certified,
	identity
}: {
	identity: Identity;
} & QueryParams): Promise<DirectoryDid.PricingConfig> => {
	const { getPricing } = await directoryCanister({ identity });
	return await getPricing({ certified });
};

export const estimateUploadCost = async ({
	certified,
	identity,
	size,
	paymentType
}: {
	identity: Identity;
	size: bigint;
	paymentType: DirectoryDid.PaymentType;
} & QueryParams): Promise<bigint> => {
	const { estimateUploadCost } = await directoryCanister({ identity });
	return await estimateUploadCost({ certified, size, paymentType });
};

export const topUpBalance = async ({
	certified,
	identity,
	amount,
	paymentType
}: {
	identity: Identity;
	amount: bigint;
	paymentType: DirectoryDid.PaymentType;
} & QueryParams): Promise<bigint> => {
	const { topUpBalance } = await directoryCanister({ identity });
	return await topUpBalance({ certified, amount, paymentType });
};

export const adminSetPricing = async ({
	certified,
	identity,
	rate
}: {
	identity: Identity;
	rate: bigint;
} & QueryParams): Promise<void> => {
	const { adminSetPricing } = await directoryCanister({ identity });
	return await adminSetPricing({ certified, rate });
};

export const adminSetQuota = async ({
	certified,
	identity,
	principal,
	quota
}: {
	identity: Identity;
	principal: Principal;
	quota: bigint;
} & QueryParams): Promise<void> => {
	const { adminSetQuota } = await directoryCanister({ identity });
	return await adminSetQuota({ certified, principal, quota });
};

export const adminWithdraw = async ({
	certified,
	identity,
	to,
	amount,
	ledger
}: {
	identity: Identity;
	to: Principal;
	amount: bigint;
	ledger: Principal;
} & QueryParams): Promise<void> => {
	const { adminWithdraw } = await directoryCanister({ identity });
	return await adminWithdraw({ certified, to, amount, ledger });
};

export const garbageCollect = async ({
	certified,
	identity
}: {
	identity: Identity;
} & QueryParams): Promise<void> => {
	const { garbageCollect } = await directoryCanister({ identity });
	return await garbageCollect({ certified });
};

export const provisionBucket = async ({
	certified,
	identity,
	principal
}: {
	identity: Identity;
	principal: Principal;
} & QueryParams): Promise<void> => {
	const { provisionBucket } = await directoryCanister({ identity });
	return await provisionBucket({ certified, principal });
};

export const reapExpiredUploads = async ({
	certified,
	identity
}: {
	identity: Identity;
} & QueryParams): Promise<void> => {
	const { reapExpiredUploads } = await directoryCanister({ identity });
	return await reapExpiredUploads({ certified });
};

export const reportChunkUploaded = async ({
	certified,
	identity,
	uploadId,
	chunkIndex
}: {
	identity: Identity;
	uploadId: Uint8Array | number[];
	chunkIndex: number;
} & QueryParams): Promise<void> => {
	const { reportChunkUploaded } = await directoryCanister({ identity });
	return await reportChunkUploaded({ certified, uploadId, chunkIndex });
};

const directoryCanister = async ({
	identity,
	canisterId = DIRECTORY_CANISTER_ID
}: {
	identity: Identity;
	canisterId?: Principal | string;
}): Promise<DirectoryCanister> => {
	const agent = await getAgent({ identity });

	return DirectoryCanister.create({
		agent,
		canisterId: typeof canisterId === 'string' ? Principal.fromText(canisterId) : canisterId
	});
};
