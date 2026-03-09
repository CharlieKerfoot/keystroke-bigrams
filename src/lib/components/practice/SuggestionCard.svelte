<script lang="ts">
	import type { FingerStats, HandStats } from '$lib/types/analytics';

	interface Props {
		fingerStats: FingerStats[];
		handStats: HandStats[];
		accuracy: number;
	}

	let { fingerStats, handStats, accuracy }: Props = $props();

	const tips = $derived.by(() => {
		const items: string[] = [];

		if (accuracy < 90) {
			items.push('Focus on accuracy over speed. Slow down until you consistently hit 95%+ accuracy, then gradually increase speed.');
		}

		const slowFingers = fingerStats
			.filter(f => f.totalKeystrokes > 5)
			.sort((a, b) => b.avgTime - a.avgTime);
		if (slowFingers.length > 0) {
			const worst = slowFingers[0];
			items.push(`Your ${worst.finger.replace('-', ' ')} is your slowest finger at ${Math.round(worst.avgTime)}ms avg. Practice words heavy on those keys.`);
		}

		const left = handStats.find(h => h.hand === 'left');
		const right = handStats.find(h => h.hand === 'right');
		if (left && right && Math.abs(left.avgTime - right.avgTime) > 30) {
			const slower = left.avgTime > right.avgTime ? 'left' : 'right';
			items.push(`Your ${slower} hand is noticeably slower. Try isolated drills for that hand.`);
		}

		const inaccurateFingers = fingerStats.filter(f => f.accuracy < 90 && f.totalKeystrokes > 5);
		if (inaccurateFingers.length > 0) {
			items.push(`Your ${inaccurateFingers[0].finger.replace('-', ' ')} has low accuracy (${Math.round(inaccurateFingers[0].accuracy)}%). Practice hitting those keys cleanly.`);
		}

		if (items.length === 0) {
			items.push('Great typing! Keep practicing to maintain and improve your skills.');
		}

		return items;
	});
</script>

<div class="flex flex-col gap-3">
	{#each tips as tip}
		<div class="bg-surface rounded-lg p-4 border-l-2 border-accent">
			<p class="text-sm text-text">{tip}</p>
		</div>
	{/each}
</div>
