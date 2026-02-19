<script lang="ts">
	import Auth from '$lib/components/Auth.svelte';
	import Dashboard from '$lib/components/Dashboard.svelte';
	import UploadModal from '$lib/components/UploadModal.svelte';

	let openUpload = $state(false);
</script>

<Auth>
	<div class="mx-auto max-w-7xl">
		<header
			class="mb-10 flex items-end justify-between border-b border-gray-200 pt-16 pb-10 dark:border-gray-800"
		>
			<div>
				<h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Vault Core</h1>
				<p class="mt-2 text-lg text-gray-500">Your decentralized, secure file vault.</p>
			</div>
			<div>
				<button
					class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:scale-95"
					onclick={() => (openUpload = true)}
				>
					<svg class="mr-2 -ml-0.5 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							clip-rule="evenodd"
							d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
							fill-rule="evenodd"
						/>
					</svg>
					Upload File
				</button>
			</div>
		</header>

		<Dashboard />
	</div>

	<UploadModal bind:open={openUpload} />
</Auth>
