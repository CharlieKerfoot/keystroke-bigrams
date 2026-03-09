<script lang="ts">
	import type { PerCharStats } from '$lib/types/analytics';
	import { KEYBOARD_ROWS } from '$lib/config/keyboard';

	interface Props {
		charStats: PerCharStats[];
	}

	let { charStats }: Props = $props();

	const statsMap = $derived(
		new Map(charStats.map((s) => [s.char, s]))
	);

	const times = $derived(charStats.filter(s => s.avgTime > 0).map((s) => s.avgTime));
	const minTime = $derived(times.length > 0 ? Math.min(...times) : 100);
	const maxTime = $derived(times.length > 0 ? Math.max(...times) : 300);

	function getColor(key: string): string {
		const stat = statsMap.get(key.toLowerCase());
		if (!stat || stat.avgTime === 0) return 'bg-surface text-text-dim';
		const pct = (stat.avgTime - minTime) / (maxTime - minTime || 1);
		if (pct < 0.33) return 'bg-correct/30 text-correct';
		if (pct < 0.66) return 'bg-warning/30 text-warning';
		return 'bg-error/30 text-error';
	}

	function getTime(key: string): string {
		const stat = statsMap.get(key.toLowerCase());
		if (!stat || stat.avgTime === 0) return '';
		return `${Math.round(stat.avgTime)}ms`;
	}

	function getAccuracy(key: string): string {
		const stat = statsMap.get(key.toLowerCase());
		if (!stat) return '';
		return `${Math.round(stat.accuracy)}%`;
	}

	const offsets = ['pl-0', 'pl-4', 'pl-8'];
</script>

<div class="flex flex-col gap-1.5 items-center">
	{#each KEYBOARD_ROWS as row, rowIdx}
		<div class="flex gap-1.5 {offsets[rowIdx]}">
			{#each row as key}
				<div
					class="w-14 h-14 rounded-lg flex flex-col items-center justify-center text-xs transition-colors {getColor(key)}"
					title="{key}: {getTime(key)} | {getAccuracy(key)}"
				>
					<span class="font-bold text-base">{key.toUpperCase()}</span>
					<span class="text-[0.6rem] opacity-75">{getTime(key)}</span>
				</div>
			{/each}
		</div>
	{/each}
	<!-- Space bar -->
	<div class="flex {offsets[1]}">
		<div
			class="w-64 h-10 rounded-lg flex items-center justify-center text-xs transition-colors {getColor(' ')}"
			title="Space: {getTime(' ')} | {getAccuracy(' ')}"
		>
			<span class="text-text-dim">SPACE {getTime(' ')}</span>
		</div>
	</div>
</div>
