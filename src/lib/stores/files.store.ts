import type { DirectoryDid } from '$declarations';
import { writable } from 'svelte/store';

export const filesStore = writable<DirectoryDid.FileMeta[]>([]);

export const loadingFiles = writable<boolean>(false);
