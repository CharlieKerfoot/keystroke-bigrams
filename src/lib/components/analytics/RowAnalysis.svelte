<script lang="ts">
	import type { RowStats } from '$lib/types/analytics';

	interface Props {
		rows: RowStats[];
	}

	let { rows }: Props = $props();

	const rowLabels: Record<string, string> = {
		number: 'Number Row',
		top: 'Top Row',
		home: 'Home Row',
		bottom: 'Bottom Row'
	};

	const maxTime = $derived(Math.max(...rows.map((r) => r.avgTime), 1));
</script>

<div class="flex flex-col gap-3">
	{#each rows as row}
		{@const pct = (row.avgTime / maxTime) * 100}
		<div class="flex items-center gap-3">
			<span class="w-24 text-sm text-text-dim text-right">{rowLabels[row.row]}</span>
			<div class="flex-1 h-6 bg-bg rounded overflow-hidden">
				<div
					class="h-full rounded bg-accent/60 flex items-center px-2 text-xs"
					style="width: {pct}%"
				>
					{Math.round(row.avgTime)}ms
				</div>
			</div>
			<span class="w-12 text-xs {row.accuracy >= 95 ? 'text-correct' : 'text-error'}">{Math.round(row.accuracy)}%</span>
		</div>
	{/each}
</div>
