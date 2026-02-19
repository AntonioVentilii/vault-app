<script lang="ts">
	import { isNullish } from '@dfinity/utils';
	import { getIdentityOnce } from '@junobuild/core';
	import type { DirectoryDid } from '$declarations';
	import { deleteFile } from '$lib/api/directory.api';
	import { userSignedIn } from '$lib/derived/user.derived';
	import { downloadFile, refreshFiles } from '$lib/services/file.services';
	import { filesStore, loadingFiles } from '$lib/stores/files.store';

	const handleRefresh = async () => {
		const identity = await getIdentityOnce();

		if (isNullish(identity)) {
			return;
		}

		await refreshFiles(identity);
	};

	const handleDelete = async (fileId: DirectoryDid.FileMeta['file_id']) => {
		if ($userSignedIn && confirm('Are you sure you want to delete this file?')) {
			try {
				const identity = await getIdentityOnce();

				if (isNullish(identity)) {
					return;
				}

				await deleteFile({ identity, fileId });

				await refreshFiles(identity);
			} catch (_: unknown) {
				alert('Delete failed');
			}
		}
	};

	const handleDownload = async ({ file_id: fileId, name }: DirectoryDid.FileMeta) => {
		const identity = await getIdentityOnce();

		if (isNullish(identity)) {
			return;
		}

		try {
			const blob = await downloadFile({ identity, fileId });

			const url = URL.createObjectURL(blob);

			const a = document.createElement('a');

			a.href = url;

			a.download = name;

			a.click();

			URL.revokeObjectURL(url);
		} catch (error: unknown) {
			console.error('Action failed', error);
			alert('Download failed');
		}
	};

	const formatSize = (bytes: bigint) => {
		const units = ['B', 'KB', 'MB', 'GB'];
		let size = Number(bytes);
		let unitIndex = 0;
		while (size >= 1024 && unitIndex < units.length - 1) {
			size /= 1024;
			unitIndex++;
		}
		return `${size.toFixed(2)} ${units[unitIndex]}`;
	};
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Your Files</h2>
		<button
			class="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
			onclick={handleRefresh}
		>
			{#if $loadingFiles}
				<div
					class="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"
				></div>
			{/if}
			Refresh
		</button>
	</div>

	{#if $filesStore.length === 0}
		<div
			class="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center dark:border-gray-800"
		>
			<svg
				class="mx-auto h-12 w-12 text-gray-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
				/>
			</svg>
			<h3 class="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No files</h3>
			<p class="mt-1 text-sm text-gray-500">Get started by uploading your first file.</p>
		</div>
	{:else}
		<div
			class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900"
		>
			<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
				<thead class="bg-gray-50 dark:bg-gray-800/50">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
							>Name</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
							>Size</th
						>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
							>Type</th
						>
						<th class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
					{#each $filesStore as file (file.file_id.id.toString())}
						<tr class="hover:bg-gray-50 dark:hover:bg-gray-800/40">
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900 dark:text-white">{file.name}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-500">{formatSize(file.size_bytes)}</div>
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
								{file.mime}
							</td>
							<td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
								<div class="flex justify-end gap-3">
									<button
										class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
										onclick={() => handleDownload(file)}
									>
										Download
									</button>
									<button
										class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
										onclick={() => handleDelete(file.file_id)}
									>
										Delete
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
