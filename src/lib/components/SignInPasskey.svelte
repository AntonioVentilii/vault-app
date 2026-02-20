<script lang="ts">
	import { signIn } from '@junobuild/core';
	import Button from '$lib/components/Button.svelte';

	const signInWithPassKey = async () => {
		await signIn({
			webauthn: {}
		});
	};
</script>

<Button onclick={signInWithPassKey}>
	<span>Sign in with Passkey</span>
</Button>
