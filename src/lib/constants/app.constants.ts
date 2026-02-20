import { isDev } from '$lib/env/app.env';

export const REPLICA_HOST = isDev() ? 'http://localhost:5987/' : 'https://icp-api.io';

// eslint-disable-next-line no-restricted-syntax -- This is the definition
export const ZERO = 0n;

export const CHUNK_SIZE = 1_048_576; // 1MB
