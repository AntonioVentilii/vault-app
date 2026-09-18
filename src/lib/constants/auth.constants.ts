// Matches the session length the Juno SDK applied, so dropping it does not
// silently extend how long a delegation stays valid.
export const II_MAX_TIME_TO_LIVE_NS = 4n * 60n * 60n * 1_000_000_000n;

// Popup dimensions Internet Identity 2.0 expects.
export const II_WINDOW_FEATURES = 'width=424,height=576';

// Key under which the local-development identity is persisted, so a dev
// session survives a page reload the way the Juno emulator's `dev` sign-in did.
export const DEV_IDENTITY_STORAGE_KEY = 'vault-app:dev-identity';
