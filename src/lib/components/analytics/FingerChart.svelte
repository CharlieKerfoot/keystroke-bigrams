<script lang="ts">
	import type { FingerStats } from '$lib/types/analytics';

	interface Props {
		fingers: FingerStats[];
	}

	let { fingers }: Props = $props();

	const maxTime = $derived(Math.max(...fingers.map((f) => f.avgTime), 1));

	const fingerOrder = [
		'left-pinky', 'left-ring', 'left-middle', 'left-index',
		'right-index', 'right-middle', 'right-ring', 'right-pinky'
	];

	const fingerLabels: Record<string, string> = {
		'left-pinky': 'L Pinky',
		'left-ring': 'L Ring',
		'left-middle': 'L Mid',
		'left-index': 'L Index',
		'right-index': 'R Index',
		'right-middle': 'R Mid',
		'right-ring': 'R Ring',
		'right-pinky': 'R Pinky'
	};

	const sorted = $derived(
		fingerOrder
			.map((f) => fingers.find((s) => s.finger === f))
			.filter((f): f is FingerStats => !!f)
	);
</script>

<div class="flex items-end gap-2 h-48">
	{#each sorted as f}
		{@const pct = (f.avgTime / maxTime) * 100}
		{@const isLeft = f.finger.startsWith('left')}
		<div class="flex-1 flex flex-col items-center gap-1">
			<span class="text-[0.6rem] text-text-dim">{Math.round(f.avgTime)}ms</span>
			<div
				class="w-full rounded-t transition-all {isLeft ? 'bg-accent/60' : 'bg-warning/60'}"
				style="height: {pct}%"
			></div>
			<span class="text-[0.6rem] text-text-dim text-center leading-tight">{fingerLabels[f.finger]}</span>
			<span class="text-[0.55rem] {f.accuracy >= 95 ? 'text-correct' : 'text-error'}">{Math.round(f.accuracy)}%</span>
		</div>
	{/each}
</div>
