<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import IconRobot from '$lib/components/icons/IconRobot.svelte';
	import { signInDev } from '$lib/services/auth.services';

	// Sign in for local development and E2E only
	const signInWithDev = async () => {
		await signInDev();
	};
</script>

<Button onclick={signInWithDev}>
	<IconRobot size="20px" />
	Sign in for Dev
</Button>
