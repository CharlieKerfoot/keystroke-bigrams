<script lang="ts">
	import { onMount } from 'svelte';
	import { getAnalytics, computeFromAllSessions } from '$lib/stores/analytics.svelte';
	import { getSessions, refreshHistory } from '$lib/stores/history.svelte';
	import KeyboardHeatmap from '$lib/components/analytics/KeyboardHeatmap.svelte';
	import BigramTable from '$lib/components/analytics/BigramTable.svelte';
	import TrigramTable from '$lib/components/analytics/TrigramTable.svelte';
	import FingerChart from '$lib/components/analytics/FingerChart.svelte';
	import HandComparison from '$lib/components/analytics/HandComparison.svelte';
	import RowAnalysis from '$lib/components/analytics/RowAnalysis.svelte';
	import ErrorPatterns from '$lib/components/analytics/ErrorPatterns.svelte';
	import TrendChart from '$lib/components/analytics/TrendChart.svelte';
	import MetricCard from '$lib/components/shared/MetricCard.svelte';

	onMount(() => {
		refreshHistory();
		computeFromAllSessions();
	});

	const analytics = $derived(getAnalytics());
	const sessions = $derived(getSessions());
</script>

<svelte:head>
	<title>TypeSlow — Analytics</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<h1 class="text-accent text-2xl font-bold">Analytics Dashboard</h1>

	{#if !analytics}
		<div class="bg-surface rounded-lg p-8 text-center">
			<p class="text-text-dim">No data yet. Complete a typing test to see analytics.</p>
			<a href="/" class="text-accent hover:underline text-sm mt-2 inline-block">Go to typing test</a>
		</div>
	{:else}
		<!-- Overview -->
		<div class="flex gap-3 flex-wrap">
			<MetricCard label="WPM" value={analytics.wpm} color="accent" />
			<MetricCard label="Raw WPM" value={analytics.rawWpm} color="text" />
			<MetricCard label="Accuracy" value="{analytics.accuracy}%" color={analytics.accuracy >= 95 ? 'correct' : 'warning'} />
			<MetricCard label="Sessions" value={sessions.length} color="text" />
		</div>

		<!-- Trends -->
		<section class="bg-surface rounded-lg p-4">
			<h2 class="text-accent text-sm font-bold mb-3">Performance Trends</h2>
			<TrendChart {sessions} />
		</section>

		<!-- Keyboard Heatmap -->
		<section class="bg-surface rounded-lg p-4">
			<h2 class="text-accent text-sm font-bold mb-3">Keyboard Heatmap (by speed)</h2>
			<KeyboardHeatmap charStats={analytics.perChar} />
		</section>

		<!-- Finger & Hand -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
			<section class="bg-surface rounded-lg p-4">
				<h2 class="text-accent text-sm font-bold mb-3">Finger Speed & Accuracy</h2>
				<FingerChart fingers={analytics.fingers} />
			</section>
			<section class="bg-surface rounded-lg p-4">
				<h2 class="text-accent text-sm font-bold mb-3">Hand Comparison</h2>
				<HandComparison hands={analytics.hands} />
			</section>
		</div>

		<!-- Row Analysis -->
		<section class="bg-surface rounded-lg p-4">
			<h2 class="text-accent text-sm font-bold mb-3">Row Analysis</h2>
			<RowAnalysis rows={analytics.rows} />
		</section>

		<!-- Bigrams & Trigrams -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
			<section class="bg-surface rounded-lg p-4">
				<h2 class="text-accent text-sm font-bold mb-3">Slowest Bigrams</h2>
				<BigramTable bigrams={analytics.bigrams} />
			</section>
			<section class="bg-surface rounded-lg p-4">
				<h2 class="text-accent text-sm font-bold mb-3">Slowest Trigrams</h2>
				<TrigramTable trigrams={analytics.trigrams} />
			</section>
		</div>

		<!-- Error Patterns -->
		<section class="bg-surface rounded-lg p-4">
			<h2 class="text-accent text-sm font-bold mb-3">Error Patterns</h2>
			<ErrorPatterns errors={analytics.errors} />
		</section>
	{/if}
</div>
