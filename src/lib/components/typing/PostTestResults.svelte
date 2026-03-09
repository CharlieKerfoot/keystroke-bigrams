<script lang="ts">
	import type { AnalyticsData } from '$lib/types/analytics';
	import MetricCard from '$lib/components/shared/MetricCard.svelte';

	interface Props {
		analytics: AnalyticsData;
		onRestart: () => void;
		onViewAnalytics: () => void;
	}

	let { analytics, onRestart, onViewAnalytics }: Props = $props();

	const worstBigrams = $derived(analytics.bigrams.slice(0, 5));
</script>

<div class="flex flex-col items-center gap-6">
	<h2 class="text-accent text-xl font-bold">Test Complete</h2>

	<div class="flex gap-3 flex-wrap justify-center">
		<MetricCard label="WPM" value={analytics.wpm} color="accent" />
		<MetricCard label="Raw WPM" value={analytics.rawWpm} color="text" />
		<MetricCard
			label="Accuracy"
			value="{analytics.accuracy}%"
			color={analytics.accuracy >= 95 ? 'correct' : analytics.accuracy >= 85 ? 'warning' : 'error'}
		/>
	</div>

	{#if worstBigrams.length > 0}
		<div class="bg-surface rounded-lg p-4 w-full max-w-md">
			<h3 class="text-text-dim text-xs uppercase tracking-wider mb-2">Slowest Bigrams</h3>
			<div class="flex flex-wrap gap-2">
				{#each worstBigrams as b}
					<span class="bg-bg px-3 py-1 rounded text-sm">
						<span class="font-bold text-warning">{b.bigram}</span>
						<span class="text-text-dim ml-1">{Math.round(b.median)}ms</span>
					</span>
				{/each}
			</div>
		</div>
	{/if}

	<div class="flex gap-3">
		<button
			class="px-6 py-2 bg-accent text-bg rounded-lg font-bold hover:opacity-85 transition-opacity"
			onclick={onRestart}
		>Try Again</button>
		<button
			class="px-6 py-2 border border-accent text-accent rounded-lg hover:bg-accent/10 transition-colors"
			onclick={onViewAnalytics}
		>View Analytics</button>
	</div>
</div>
