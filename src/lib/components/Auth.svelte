<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import GitHubButton from '$lib/components/GitHubButton.svelte';
	import Logout from '$lib/components/Logout.svelte';
	import SignIn from '$lib/components/SignIn.svelte';
	import WalletModal from '$lib/components/WalletModal.svelte';
	import { userSignedIn } from '$lib/derived/user.derived';
	import { initAuth } from '$lib/services/auth.services';

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();

	let openWallet = $state(false);

	onMount(() => {
		initAuth();
	});

	// eslint-disable-next-line require-await
	const openWalletModal = async () => {
		openWallet = true;
	};
</script>

{#if $userSignedIn}
	<div class="space-y-4">
		<div class="flex justify-end gap-3 p-4">
			<GitHubButton />

			<Button onclick={openWalletModal}>
				<svg
					class="h-5 w-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
					/>
				</svg>
			</Button>

			<Logout />
		</div>
		{@render children()}
	</div>

	<WalletModal bind:open={openWallet} />
{:else}
	<div class="flex min-h-[50dvh] items-center justify-center p-8">
		<SignIn />
	</div>
{/if}
