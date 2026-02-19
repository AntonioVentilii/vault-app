export const MODE = 'local';
export const LOCAL = MODE === 'local';

export const REPLICA_HOST = LOCAL ? 'http://localhost:5987/' : 'https://icp-api.io';

// eslint-disable-next-line no-restricted-syntax -- This is the definition
export const ZERO = 0n;

export const CHUNK_SIZE = 1_048_576; // 1MB
