<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import IconIc from '$lib/components/icons/IconIC.svelte';
	import { signIn } from '$lib/services/auth.services';

	const signInWithII = async () => {
		await signIn();
	};
</script>

<Button onclick={signInWithII}>
	<IconIc size="20px" />
	<span>Sign in with Internet Identity</span>
</Button>
