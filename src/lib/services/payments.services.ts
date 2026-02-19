import { approve } from '$lib/api/icrc-ledger.api';
import { LEDGER_CANISTER_IDS } from '$lib/constants/ledger.constants';
import { PRICING } from '$lib/constants/pricing.constants';
import type { Identity } from '@icp-sdk/core/agent';
import { Principal } from '@icp-sdk/core/principal';

export type LedgerType = 'ICP' | 'ckUSDC';

/**
 * Approves a spender to transfer tokens on behalf of the user.
 */
export const approveIcrc2 = async ({
	identity,
	ledgerType,
	spender,
	amount
}: {
	identity: Identity;
	ledgerType: LedgerType;
	spender: Principal | string;
	amount: bigint;
}) => {
	const ledgerCanisterId = LEDGER_CANISTER_IDS[ledgerType].toText();
	const spenderPrincipal = typeof spender === 'string' ? Principal.fromText(spender) : spender;

	const result = await approve({
		identity,
		ledgerCanisterId,
		amount,
		spender: { owner: spenderPrincipal },
		expiresAt: BigInt(Date.now() + 60 * 60 * 1000) // Expires in 1 hour
	});

	return result;
};

/**
 * Returns the price for a specific action in atomic units.
 */
export const getPrice = ({
	action,
	ledgerType
}: {
	action: keyof typeof PRICING;
	ledgerType: LedgerType;
}): bigint => PRICING[action][ledgerType];
