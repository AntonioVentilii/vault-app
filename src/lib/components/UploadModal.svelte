<script lang="ts">
	import { isNullish } from '@dfinity/utils';
	import { getIdentityOnce } from '@junobuild/core';
	import Button from '$lib/components/Button.svelte';
	import { userNotSignedIn } from '$lib/derived/user.derived';
	import { isDev } from '$lib/env/app.env';
	import { refreshFiles, uploadFile } from '$lib/services/file.services';

	let { open = $bindable(false) } = $props();

	let file: File | null = $state(null);
	let uploading = $state(false);
	let progress = $state(0);
	let ledgerType: 'ICP' | 'ckUSDC' = $state('ICP');
	let error: string | null = $state(null);
	let detail = $state('');

	const handleUpload = async () => {
		if (isNullish(file) || $userNotSignedIn) {
			return;
		}

		uploading = true;
		error = null;
		progress = 0;

		try {
			const identity = await getIdentityOnce();

			if (isNullish(identity)) {
				return;
			}

			await uploadFile({
				identity,
				file,
				ledgerType,
				onProgress: ({ progress: p, detail: d }) => {
					progress = p;
					if (d) {
						detail = d;
					}
				}
			});

			refreshFiles(identity);

			open = false;

			file = null;
		} catch (err: unknown) {
			console.error('Upload failed', err);
			error = (err as Error).message ?? 'Upload failed. Please check your balance.';
		} finally {
			uploading = false;
		}
	};

	const handleFileChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			[file] = target.files;
		}
	};

	// eslint-disable-next-line require-await
	const closeModal = async () => {
		open = false;
		file = null;
		uploading = false;
		progress = 0;
		error = null;
	};
</script>

{#if open}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
		<div
			class="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900"
		>
			<div class="mb-6 flex items-center justify-between">
				<h3 class="text-xl font-bold text-gray-900 dark:text-white">Upload New File</h3>
				<Button onclick={closeModal}>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							d="M6 18L18 6M6 6l12 12"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
						/>
					</svg>
				</Button>
			</div>

			<div class="space-y-4">
				<div
					class="relative rounded-xl border-2 border-dashed border-gray-200 p-8 text-center transition-colors hover:border-blue-400 dark:border-gray-800"
				>
					<input
						class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
						disabled={uploading}
						onchange={handleFileChange}
						type="file"
					/>
					<div class="space-y-1">
						<svg
							class="mx-auto h-12 w-12 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
							/>
						</svg>
						<p class="text-sm text-gray-600 dark:text-gray-400">
							{#if file}
								{file.name}
							{:else}
								Click or drag file to upload
							{/if}
						</p>
					</div>
				</div>

				<div class="flex gap-4">
					<label class="flex cursor-pointer items-center gap-2">
						<input
							name="ledger"
							disabled={uploading}
							type="radio"
							value="ICP"
							bind:group={ledgerType}
						/>
						<span class="text-sm dark:text-gray-300">ICP</span>
					</label>

					<label class="flex cursor-pointer items-center gap-2">
						<input
							name="ledger"
							disabled={uploading || isDev()}
							type="radio"
							value="ckUSDC"
							bind:group={ledgerType}
						/>
						<span class="text-sm dark:text-gray-300">ckUSDC</span>
					</label>
				</div>

				{#if uploading}
					<div class="space-y-2">
						<div class="flex justify-between text-xs text-gray-500">
							<span class="flex-1 truncate pr-4 text-left italic">
								{detail || 'Preparing...'}
							</span>
							<span class="whitespace-nowrap">{Math.round(progress * 100)}%</span>
						</div>
						<div class="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
							<div
								style="width: {progress * 100}%"
								class="h-full bg-blue-600 transition-all duration-300"
							></div>
						</div>
					</div>
				{/if}

				{#if error}
					<div
						class="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20"
					>
						{error}
					</div>
				{/if}

				<Button busy={uploading} disabled={!file || uploading} onclick={handleUpload}>
					{#if uploading}
						Uploading...
					{:else}
						Start Secure Upload
					{/if}
				</Button>
			</div>
		</div>
	</div>
{/if}
