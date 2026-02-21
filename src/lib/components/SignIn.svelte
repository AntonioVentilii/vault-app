<script lang="ts">
	import GitHubButton from '$lib/components/GitHubButton.svelte';
	import SignInActions from '$lib/components/SignInActions.svelte';
</script>

<div class="flex flex-col items-center justify-center gap-16 pb-5 text-center">
	<h1 class="max-w-96 p-0">Yours. Safe. Pay-as-you-go.</h1>

	<SignInActions />

	<GitHubButton />
</div>
