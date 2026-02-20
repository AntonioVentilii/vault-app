<script lang="ts">
	import { isNullish, nonNullish } from '@dfinity/utils';
	import { getIdentityOnce } from '@junobuild/core';
	import { onMount } from 'svelte';
	import { balance } from '$lib/api/icrc-ledger.api';
	import Button from '$lib/components/Button.svelte';
	import { LEDGER_CANISTER_IDS } from '$lib/constants/ledger.constants';
	import { userStore } from '$lib/stores/user.store';

	let { open = $bindable(false) } = $props();

	let icpBalance: bigint | null = $state(null);
	let ckUsdcBalance: bigint | null = $state(null);
	let loading = $state(false);
	let error: string | null = $state(null);

	let principal: string | null = $state(null);

	onMount(async () => {
		const identity = await getIdentityOnce();

		if (nonNullish(identity)) {
			principal = identity.getPrincipal().toText();
		}
	});

	const fetchBalances = async () => {
		if (isNullish($userStore)) {
			return;
		}

		loading = true;
		error = null;

		try {
			const identity = await getIdentityOnce();

			if (isNullish(identity)) {
				return;
			}

			const account = { owner: identity.getPrincipal() };

			const [icp, ckusdc] = await Promise.all([
				balance({
					identity,
					ledgerCanisterId: LEDGER_CANISTER_IDS.ICP.toText(),
					account
				}),
				balance({
					identity,
					ledgerCanisterId: LEDGER_CANISTER_IDS.ckUSDC.toText(),
					account
				})
			]);

			icpBalance = icp;
			ckUsdcBalance = ckusdc;
		} catch (err: unknown) {
			console.error('Failed to fetch balances', err);
			error = 'Failed to fetch balances. Please try again.';
		} finally {
			loading = false;
		}
	};

	const formatBalance = ({
		amount,
		decimals
	}: {
		amount: bigint | null;
		decimals: number;
	}): string => {
		if (isNullish(amount)) {
			return '0.00';
		}
		const divisor = BigInt(10 ** decimals);
		const integerPart = amount / divisor;
		const fractionalPart = amount % divisor;
		return `${integerPart}.${fractionalPart.toString().padStart(decimals, '0').slice(0, 4)}`;
	};

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			alert('Copied to clipboard!');
		} catch (err) {
			console.error('Failed to copy', err);
		}
	};

	$effect(() => {
		if (open) {
			fetchBalances();
		}
	});

	// eslint-disable-next-line require-await
	const openModal = async () => {
		open = true;
	};
</script>

{#if open}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
		<div
			class="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900"
		>
			<div class="mb-6 flex items-center justify-between">
				<h3 class="text-xl font-bold text-gray-900 dark:text-white">Your Wallet</h3>
				<Button onclick={openModal}>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							d="M6 18L18 6M6 6l12 12"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
						/>
					</svg>
				</Button>
			</div>

			<div class="space-y-6">
				<!-- Principal Address -->
				<div class="space-y-2">
					<span class="text-xs font-medium text-gray-500 uppercase">Your Principal ID</span>
					<div
						class="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50"
					>
						<code class="text-sm break-all text-gray-700 dark:text-gray-300">
							{principal ?? 'Not signed in'}
						</code>
						<button
							class="ml-2 text-gray-400 hover:text-blue-500"
							onclick={async () => {
								if (nonNullish(principal)) {
									await copyToClipboard(principal);
								}
							}}
							title="Copy Address"
						>
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
								/>
							</svg>
						</button>
					</div>
				</div>

				<!-- Balances -->
				<div class="grid grid-cols-2 gap-4">
					<div
						class="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/30"
					>
						<div class="flex items-center gap-2 text-sm text-gray-500">
							<span class="font-bold text-gray-900 dark:text-white">ICP</span>
						</div>
						<div class="mt-1 text-lg font-bold text-gray-900 dark:text-white">
							{formatBalance({ amount: icpBalance, decimals: 8 })}
						</div>
					</div>
					<div
						class="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/30"
					>
						<div class="flex items-center gap-2 text-sm text-gray-500">
							<span class="font-bold text-blue-600">ckUSDC</span>
						</div>
						<div class="mt-1 text-lg font-bold text-gray-900 dark:text-white">
							{formatBalance({ amount: ckUsdcBalance, decimals: 6 })}
						</div>
					</div>
				</div>

				{#if error}
					<div
						class="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20"
					>
						{error}
					</div>
				{/if}

				<div class="flex gap-3">
					<Button disabled={loading} onclick={fetchBalances}>
						{#if loading}
							<div
								class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
							></div>
						{/if}
						Refresh Balances
					</Button>
				</div>
			</div>
		</div>
	</div>
{/if}
