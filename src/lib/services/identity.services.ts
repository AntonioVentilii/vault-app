import { AuthClientProvider } from '$lib/providers/auth-client.providers';
import { loadDevIdentity } from '$lib/services/dev-identity.services';
import { isNullish, nonNullish } from '@dfinity/utils';
import type { Identity } from '@icp-sdk/core/agent';

/**
 * The signed-in identity, or `undefined` when signed out.
 *
 * Replaces `getIdentityOnce` from `@junobuild/core`; callers that need to talk
 * to the vault canisters pass the result straight through as before.
 */
export const getIdentityOnce = async (): Promise<Identity | undefined> => {
	const devIdentity = loadDevIdentity();

	if (nonNullish(devIdentity)) {
		return devIdentity;
	}

	return await AuthClientProvider.getInstance().loadIdentity();
};

// Throws if not signed in — call from authenticated paths only.
export const safeGetIdentityOnce = async (): Promise<Identity> => {
	const identity = await getIdentityOnce();

	if (isNullish(identity)) {
		throw new Error('Not authenticated');
	}

	return identity;
};
