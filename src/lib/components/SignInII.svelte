<script lang="ts">
	import { signIn } from '@junobuild/core';
	import Button from '$lib/components/Button.svelte';
	import IconIc from '$lib/components/icons/IconIC.svelte';

	const signInWithII = async () => {
		await signIn({
			internet_identity: {}
		});
	};
</script>

<Button onclick={signInWithII}>
	<IconIc size="20px" />
	<span>Sign in with Internet Identity</span>
</Button>
