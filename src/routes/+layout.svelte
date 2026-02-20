<script lang="ts">
	import { initSatellite } from '@junobuild/core';
	import type { Snippet } from 'svelte';
	// eslint-disable-next-line import/no-relative-parent-imports
	import '../app.css';

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();

	const init = async () => {
		await initSatellite({
			workers: {
				auth: true
			}
		});
	};

	$effect(() => {
		init();
	});
</script>

<div class="relative isolate min-h-[100dvh] bg-gray-50 dark:bg-gray-950">
	<main class="mx-auto max-w-(--breakpoint-2xl) px-4 py-8 md:px-8">
		{@render children()}
	</main>
</div>
