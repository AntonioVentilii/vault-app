<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import IconGoogle from '$lib/components/icons/IconGoogle.svelte';
	import { signIn } from '$lib/services/auth.services';

	// One-Click sign-in through Internet Identity 2.0. II runs the OIDC flow
	// against Google and returns an ordinary delegation, so this needs no
	// client ID of our own — which is what kept the previous Juno-based button
	// permanently hidden behind an unset `GOOGLE_CLIENT_ID`.
	const signInWithGoogle = async () => {
		await signIn({ openIdProvider: 'google' });
	};
</script>

<Button onclick={signInWithGoogle}>
	<IconGoogle size="20px" />
	<span>Sign in with Google</span>
</Button>
