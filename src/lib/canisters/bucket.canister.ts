import {
	idlFactoryBucket,
	idlFactoryCertifiedBucket,
	type BucketDid,
	type BucketService
} from '$declarations';
import type { CreateCanisterOptions } from '$lib/types/canister';
import { Canister, createServices, toNullable, type QueryParams } from '@dfinity/utils';
import type { Principal } from '@icp-sdk/core/principal';

export class BucketCanister extends Canister<BucketService> {
	static create(options: CreateCanisterOptions<BucketService>) {
		const { service, certifiedService, canisterId } = createServices<BucketService>({
			options,
			idlFactory: idlFactoryBucket,
			certifiedIdlFactory: idlFactoryCertifiedBucket
		});

		return new BucketCanister(canisterId, service, certifiedService);
	}

	getChunk = async ({
		token,
		chunkIndex,
		...params
	}: {
		token: BucketDid.DownloadToken;
		chunkIndex: number;
	} & QueryParams): Promise<Uint8Array> => {
		const { get_chunk } = this.caller(params);
		const result = await get_chunk(token, chunkIndex);

		if ('Ok' in result) {
			return result.Ok;
		}

		throw new Error(`Failed to get chunk: ${JSON.stringify(result.Err)}`);
	};

	putChunk = async ({
		token,
		chunkIndex,
		content,
		paymentType,
		...params
	}: {
		token: BucketDid.UploadToken;
		chunkIndex: number;
		content: Uint8Array | number[];
		paymentType?: BucketDid.PaymentType;
	} & QueryParams): Promise<number> => {
		const { put_chunk } = this.caller(params);
		const result = await put_chunk(
			token,
			chunkIndex,
			new Uint8Array(content),
			toNullable(paymentType)
		);

		if ('Ok' in result) {
			return result.Ok;
		}

		throw new Error(`Failed to put chunk: ${JSON.stringify(result.Err)}`);
	};

	deleteFile = async ({
		fileId,
		...params
	}: {
		fileId: BucketDid.FileId;
	} & QueryParams): Promise<void> => {
		const { delete_file } = this.caller(params);
		const result = await delete_file(fileId);

		if ('Ok' in result) {
			return;
		}

		throw new Error(`Failed to delete file from bucket: ${JSON.stringify(result.Err)}`);
	};

	getStatus = async (params: QueryParams): Promise<BucketDid.CanisterStatus> => {
		const { get_status } = this.caller(params);
		return await get_status();
	};

	stat = async (params: QueryParams): Promise<string> => {
		const { stat } = this.caller(params);
		return await stat();
	};

	adminSetReadOnly = async ({
		readOnly,
		...params
	}: {
		readOnly: boolean;
	} & QueryParams): Promise<void> => {
		const { admin_set_read_only } = this.caller(params);
		const result = await admin_set_read_only(readOnly);

		if ('Ok' in result) {
			return;
		}

		throw new Error(`Failed to set read only: ${JSON.stringify(result.Err)}`);
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
}
