<script lang="ts">
	import type { HandStats } from '$lib/types/analytics';
	import MetricCard from '$lib/components/shared/MetricCard.svelte';

	interface Props {
		hands: HandStats[];
	}

	let { hands }: Props = $props();

	const left = $derived(hands.find((h) => h.hand === 'left'));
	const right = $derived(hands.find((h) => h.hand === 'right'));
</script>

<div class="grid grid-cols-2 gap-4">
	<div class="text-center">
		<h4 class="text-accent text-sm font-bold mb-2">Left Hand</h4>
		{#if left}
			<div class="flex flex-col gap-2 items-center">
				<MetricCard label="Avg Speed" value="{Math.round(left.avgTime)}ms" color="accent" />
				<MetricCard label="Accuracy" value="{Math.round(left.accuracy)}%" color={left.accuracy >= 95 ? 'correct' : 'warning'} />
				<MetricCard label="Keystrokes" value={left.totalKeystrokes} color="text" />
			</div>
		{/if}
	</div>
	<div class="text-center">
		<h4 class="text-warning text-sm font-bold mb-2">Right Hand</h4>
		{#if right}
			<div class="flex flex-col gap-2 items-center">
				<MetricCard label="Avg Speed" value="{Math.round(right.avgTime)}ms" color="warning" />
				<MetricCard label="Accuracy" value="{Math.round(right.accuracy)}%" color={right.accuracy >= 95 ? 'correct' : 'warning'} />
				<MetricCard label="Keystrokes" value={right.totalKeystrokes} color="text" />
			</div>
		{/if}
	</div>
</div>
