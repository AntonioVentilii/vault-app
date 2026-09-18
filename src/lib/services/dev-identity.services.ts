import { DEV_IDENTITY_STORAGE_KEY } from '$lib/constants/auth.constants';
import { isDev } from '$lib/env/app.env';
import { nonNullish } from '@dfinity/utils';
import type { Identity } from '@icp-sdk/core/agent';
import { Ed25519KeyIdentity } from '@icp-sdk/core/identity';

/**
 * A throwaway identity for local development and E2E.
 *
 * Replaces `signIn({ dev: {} })` from `@junobuild/core`, which minted a local
 * identity against the emulator. The key is generated in the browser and kept
 * in `localStorage` so a dev session survives a reload, exactly as before.
 *
 * Every function here is a no-op outside dev, so none of this can be reached
 * from a production build even if it were somehow rendered.
 */

const read = (): string | null => {
	try {
		return localStorage.getItem(DEV_IDENTITY_STORAGE_KEY);
	} catch {
		// Private mode / blocked storage: fall back to a fresh key each load.
		return null;
	}
};

const write = (value: string) => {
	try {
		localStorage.setItem(DEV_IDENTITY_STORAGE_KEY, value);
	} catch {
		// Not being able to persist is not a reason to fail the sign-in.
	}
};

export const loadDevIdentity = (): Identity | undefined => {
	if (!isDev()) {
		return undefined;
	}

	const stored = read();

	if (stored === null) {
		return undefined;
	}

	try {
		return Ed25519KeyIdentity.fromJSON(stored);
	} catch {
		return undefined;
	}
};

/**
 * Returns `undefined` outside dev.
 *
 * The guard belongs here rather than only on the button: `signInDev` ships in
 * the production bundle even though nothing renders its button, so without
 * this a call from a production build would mint and persist a development key
 * and mark the user signed in.
 */
export const createDevIdentity = (): Identity | undefined => {
	if (!isDev()) {
		return undefined;
	}

	const existing = loadDevIdentity();

	if (nonNullish(existing)) {
		return existing;
	}

	const identity = Ed25519KeyIdentity.generate();
	write(JSON.stringify(identity.toJSON()));

	return identity;
};

export const clearDevIdentity = () => {
	try {
		localStorage.removeItem(DEV_IDENTITY_STORAGE_KEY);
	} catch {
		// Nothing to clean up if storage is unavailable.
	}
};
