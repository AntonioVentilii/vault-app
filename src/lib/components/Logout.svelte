<script lang="ts">
	import { signOut } from '@junobuild/core';
	import Button from '$lib/components/Button.svelte';

	const doSignOut = (): Promise<void> => signOut();
</script>

<Button onclick={doSignOut}>
	<svg
		fill="currentColor"
		height="16"
		viewBox="0 -960 960 960"
		width="16"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M120-120v-720h360v80H200v560h280v80H120Zm520-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"
		/>
	</svg>
	<span>
		<small>Logout</small>
	</span>
</Button>
