<script lang="ts">
	import SignInDev from '$lib/components/SignInDev.svelte';
	import SignInGoogle from '$lib/components/SignInGoogle.svelte';
	import SignInII from '$lib/components/SignInII.svelte';
	import SignInPasskey from '$lib/components/SignInPasskey.svelte';
	import { isDev, isNotSkylab, isProd } from '$lib/env/app.env';
</script>

<div class="flex w-fit flex-col gap-2">
	{#if isDev()}
		<SignInDev />
	{/if}

	{#if isProd() && isNotSkylab()}
		<SignInGoogle />

		<SignInII />

		<SignInPasskey />
	{/if}
</div>
