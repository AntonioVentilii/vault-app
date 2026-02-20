<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		disabled?: boolean | undefined;
		children: Snippet;
		onclick: () => Promise<void>;
	}

	let { disabled = undefined, children, onclick }: Props = $props();
</script>

<button
	class="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
	{disabled}
	{onclick}
>
	{@render children()}
</button>
