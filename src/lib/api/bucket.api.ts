import type { BucketDid } from '$declarations';
import { getAgent } from '$lib/actors/agents.ic';
import { BucketCanister } from '$lib/canisters/bucket.canister';
import { BUCKET_CANISTER_ID } from '$lib/constants/bucket.constants';
import type { CanisterIdText } from '$lib/types/canister';
import type { QueryParams } from '@dfinity/utils';
import type { Identity } from '@icp-sdk/core/agent';
import { Principal } from '@icp-sdk/core/principal';

export const getChunk = async ({
	certified,
	identity,
	bucketId,
	token,
	chunkIndex
}: {
	identity: Identity;
	bucketId?: Principal | string;
	token: BucketDid.DownloadToken;
	chunkIndex: number;
} & QueryParams): Promise<Uint8Array> => {
	const { getChunk } = await bucketCanister({ identity, canisterId: bucketId });
	return await getChunk({ certified, token, chunkIndex });
};

export const putChunk = async ({
	certified,
	identity,
	bucketId,
	...rest
}: {
	identity: Identity;
	bucketId?: CanisterIdText;
	token: BucketDid.UploadToken;
	chunkIndex: number;
	content: Uint8Array | number[];
	paymentType?: BucketDid.PaymentType;
} & QueryParams): Promise<number> => {
	const { putChunk } = await bucketCanister({ identity, canisterId: bucketId });
	return await putChunk({ certified, ...rest });
};

export const deleteFileFromBucket = async ({
	certified,
	identity,
	bucketId,
	fileId
}: {
	identity: Identity;
	bucketId?: CanisterIdText;
	fileId: BucketDid.FileId;
} & QueryParams): Promise<void> => {
	const { deleteFile } = await bucketCanister({ identity, canisterId: bucketId });
	return await deleteFile({ certified, fileId });
};

export const getBucketStatus = async ({
	certified,
	identity,
	bucketId
}: {
	identity: Identity;
	bucketId?: CanisterIdText;
} & QueryParams): Promise<BucketDid.CanisterStatus> => {
	const { getStatus } = await bucketCanister({ identity, canisterId: bucketId });
	return await getStatus({ certified });
};

export const getBucketStat = async ({
	certified,
	identity,
	bucketId
}: {
	identity: Identity;
	bucketId?: CanisterIdText;
} & QueryParams): Promise<string> => {
	const { stat } = await bucketCanister({ identity, canisterId: bucketId });
	return await stat({ certified });
};

export const adminSetReadOnly = async ({
	certified,
	identity,
	bucketId,
	readOnly
}: {
	identity: Identity;
	bucketId?: CanisterIdText;
	readOnly: boolean;
} & QueryParams): Promise<void> => {
	const { adminSetReadOnly } = await bucketCanister({ identity, canisterId: bucketId });
	return await adminSetReadOnly({ certified, readOnly });
};

export const adminWithdrawFromBucket = async ({
	certified,
	identity,
	bucketId,
	to,
	amount,
	ledger
}: {
	identity: Identity;
	bucketId?: CanisterIdText;
	to: Principal;
	amount: bigint;
	ledger: Principal;
} & QueryParams): Promise<void> => {
	const { adminWithdraw } = await bucketCanister({ identity, canisterId: bucketId });
	return await adminWithdraw({ certified, to, amount, ledger });
};

const bucketCanister = async ({
	identity,
	canisterId = BUCKET_CANISTER_ID
}: {
	identity: Identity;
	canisterId?: Principal | string;
}): Promise<BucketCanister> => {
	const agent = await getAgent({ identity });

	return BucketCanister.create({
		agent,
		canisterId: typeof canisterId === 'string' ? Principal.fromText(canisterId) : canisterId
	});
};
