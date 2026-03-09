<script lang="ts">
	import { onMount } from 'svelte';
	import { getSessions, refreshHistory } from '$lib/stores/history.svelte';
	import { exportData, importData, clearAllData } from '$lib/services/persistence';
	import TrendChart from '$lib/components/analytics/TrendChart.svelte';
	import MetricCard from '$lib/components/shared/MetricCard.svelte';

	onMount(() => {
		refreshHistory();
	});

	const sessions = $derived(getSessions());

	const avgWpm = $derived(
		sessions.length > 0
			? Math.round(sessions.reduce((a, s) => a + s.wpm, 0) / sessions.length)
			: 0
	);
	const avgAccuracy = $derived(
		sessions.length > 0
			? Math.round(sessions.reduce((a, s) => a + s.accuracy, 0) / sessions.length * 10) / 10
			: 0
	);

	function handleExport() {
		const json = exportData();
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `typeslow-export-${new Date().toISOString().slice(0, 10)}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function handleImport() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.json';
		input.onchange = async () => {
			const file = input.files?.[0];
			if (!file) return;
			const text = await file.text();
			if (importData(text)) {
				refreshHistory();
			}
		};
		input.click();
	}

	function handleClear() {
		if (confirm('Delete all typing data? This cannot be undone.')) {
			clearAllData();
			refreshHistory();
		}
	}
</script>

<svelte:head>
	<title>TypeSlow — History</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<div class="flex items-center justify-between">
		<h1 class="text-accent text-2xl font-bold">History</h1>
		<div class="flex gap-2">
			<button class="px-3 py-1.5 text-xs border border-accent text-accent rounded hover:bg-accent/10" onclick={handleExport}>Export</button>
			<button class="px-3 py-1.5 text-xs border border-accent text-accent rounded hover:bg-accent/10" onclick={handleImport}>Import</button>
			<button class="px-3 py-1.5 text-xs border border-error text-error rounded hover:bg-error/10" onclick={handleClear}>Clear All</button>
		</div>
	</div>

	{#if sessions.length === 0}
		<div class="bg-surface rounded-lg p-8 text-center">
			<p class="text-text-dim">No sessions recorded yet.</p>
			<a href="/" class="text-accent hover:underline text-sm mt-2 inline-block">Start typing</a>
		</div>
	{:else}
		<!-- Overview -->
		<div class="flex gap-3 flex-wrap">
			<MetricCard label="Total Sessions" value={sessions.length} color="text" />
			<MetricCard label="Avg WPM" value={avgWpm} color="accent" />
			<MetricCard label="Avg Accuracy" value="{avgAccuracy}%" color={avgAccuracy >= 95 ? 'correct' : 'warning'} />
		</div>

		<!-- Trend Chart -->
		<section class="bg-surface rounded-lg p-4">
			<h2 class="text-accent text-sm font-bold mb-3">Trends</h2>
			<TrendChart {sessions} />
		</section>

		<!-- Session List -->
		<section class="bg-surface rounded-lg p-4">
			<h2 class="text-accent text-sm font-bold mb-3">Sessions</h2>
			<div class="overflow-auto max-h-96">
				<table class="w-full text-sm border-collapse">
					<thead>
						<tr>
							<th class="text-left text-text-dim text-[0.65rem] uppercase tracking-wider px-3 py-2 border-b border-white/5">Date</th>
							<th class="text-left text-text-dim text-[0.65rem] uppercase tracking-wider px-3 py-2 border-b border-white/5">Mode</th>
							<th class="text-left text-text-dim text-[0.65rem] uppercase tracking-wider px-3 py-2 border-b border-white/5">WPM</th>
							<th class="text-left text-text-dim text-[0.65rem] uppercase tracking-wider px-3 py-2 border-b border-white/5">Accuracy</th>
							<th class="text-left text-text-dim text-[0.65rem] uppercase tracking-wider px-3 py-2 border-b border-white/5">Chars</th>
						</tr>
					</thead>
					<tbody>
						{#each [...sessions].reverse() as s}
							<tr class="hover:bg-white/5">
								<td class="px-3 py-1.5 border-b border-white/5 text-text-dim">{new Date(s.date).toLocaleString()}</td>
								<td class="px-3 py-1.5 border-b border-white/5">{s.config.mode} {s.config.duration ? `${s.config.duration}s` : ''}{s.config.wordCount ? `${s.config.wordCount}w` : ''}</td>
								<td class="px-3 py-1.5 border-b border-white/5 text-accent font-bold">{s.wpm}</td>
								<td class="px-3 py-1.5 border-b border-white/5 {s.accuracy >= 95 ? 'text-correct' : s.accuracy >= 85 ? 'text-warning' : 'text-error'}">{s.accuracy}%</td>
								<td class="px-3 py-1.5 border-b border-white/5 text-text-dim">{s.charCount}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>
	{/if}
</div>
