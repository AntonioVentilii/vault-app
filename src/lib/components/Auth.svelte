<script lang="ts">
	import { onAuthStateChange } from '@junobuild/core';
	import { onDestroy, onMount, type Snippet } from 'svelte';
	import Logout from '$lib/components/Logout.svelte';
	import SignIn from '$lib/components/SignIn.svelte';
	import { userSignedIn } from '$lib/derived/user.derived';
	import { userStore } from '$lib/stores/user.store';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	let unsubscribe: (() => void) | undefined = undefined;

	onMount(() => (unsubscribe = onAuthStateChange((user) => userStore.set(user))));

	// eslint-disable-next-line no-console
	const automaticSignOut = () => console.log('Automatically signed out because session expired');

	onDestroy(() => unsubscribe?.());
</script>

<svelte:window onjunoSignOutAuthTimer={automaticSignOut} />

{#if $userSignedIn}
	<div class="space-y-4">
		<div class="flex justify-end p-4">
			<Logout />
		</div>
		{@render children()}
	</div>
{:else}
	<div class="flex min-h-[50dvh] items-center justify-center p-8">
		<SignIn />
	</div>
{/if}
