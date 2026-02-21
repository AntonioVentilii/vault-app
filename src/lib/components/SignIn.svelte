<script lang="ts">
	import GitHubButton from '$lib/components/GitHubButton.svelte';
	import SignInActions from '$lib/components/SignInActions.svelte';
	import VaultLogo from '$lib/components/VaultLogo.svelte';
</script>

<div class="flex flex-col items-center justify-center gap-16 pb-5 text-center">
	<div class="flex flex-col items-center justify-center gap-2">
		<VaultLogo />

		<h1 class="max-w-96 p-0">Yours. Safe. Pay-as-you-go.</h1>
	</div>

	<SignInActions />

	<GitHubButton />
</div>
