<script lang="ts">
	import type { BigramTiming } from '$lib/types/keystroke';
	import type { FingerStats } from '$lib/types/analytics';

	interface Props {
		weakBigrams: BigramTiming[];
		fingerStats: FingerStats[];
		onStartDrill: (text: string, label: string) => void;
	}

	let { weakBigrams, fingerStats, onStartDrill }: Props = $props();

	import { generatePracticeText, getWords } from '$lib/engine/text-generator';

	const suggestions = $derived.by(() => {
		const items: { label: string; description: string; action: () => void }[] = [];

		if (weakBigrams.length > 0) {
			items.push({
				label: 'Weakest Bigrams Drill',
				description: `Target your ${Math.min(10, weakBigrams.length)} slowest bigrams: ${weakBigrams.slice(0, 5).map(b => b.bigram).join(', ')}...`,
				action: () => {
					const text = generatePracticeText(weakBigrams.slice(0, 10), 40);
					onStartDrill(text, 'Bigram Drill');
				}
			});
		}

		const slowFingers = fingerStats
			.filter(f => f.totalKeystrokes > 5)
			.sort((a, b) => b.avgTime - a.avgTime);

		if (slowFingers.length > 0) {
			const worst = slowFingers[0];
			items.push({
				label: `${worst.finger.replace('-', ' ')} Drill`,
				description: `Your ${worst.finger.replace('-', ' ')} averages ${Math.round(worst.avgTime)}ms — practice keys for this finger.`,
				action: () => {
					const text = generatePracticeText(weakBigrams, 30);
					onStartDrill(text, `${worst.finger} Drill`);
				}
			});
		}

		if (weakBigrams.length > 5) {
			items.push({
				label: 'Extended Practice',
				description: 'A longer drill mixing your weakest patterns into natural text.',
				action: () => {
					const text = generatePracticeText(weakBigrams, 80);
					onStartDrill(text, 'Extended Practice');
				}
			});
		}

		return items;
	});
</script>

{#if suggestions.length === 0}
	<p class="text-text-dim">Complete some typing tests first to generate personalized drills.</p>
{:else}
	<div class="grid gap-3">
		{#each suggestions as s}
			<button
				class="bg-surface rounded-lg p-4 text-left hover:ring-1 hover:ring-accent transition-all"
				onclick={s.action}
			>
				<h3 class="text-accent font-bold text-sm">{s.label}</h3>
				<p class="text-text-dim text-xs mt-1">{s.description}</p>
			</button>
		{/each}
	</div>
{/if}
