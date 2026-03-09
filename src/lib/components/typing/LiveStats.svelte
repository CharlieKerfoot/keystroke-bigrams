<script lang="ts">
	import { getLiveWpm, getLiveAccuracy, getTimerRemaining, getConfig, getPhase, getProgress } from '$lib/stores/test.svelte';
	import ProgressBar from '$lib/components/shared/ProgressBar.svelte';

	let wpm = $state(0);
	let accuracy = $state(100);

	// Update live stats periodically
	let interval: ReturnType<typeof setInterval> | null = null;

	$effect(() => {
		const p = getPhase();
		if (p === 'typing') {
			interval = setInterval(() => {
				wpm = getLiveWpm();
				accuracy = getLiveAccuracy();
			}, 200);
		}
		return () => {
			if (interval) clearInterval(interval);
		};
	});
</script>

<div class="flex items-center justify-center gap-8 mb-4">
	<div class="text-center">
		<span class="text-3xl font-bold text-accent">{wpm}</span>
		<span class="text-text-dim text-sm ml-1">WPM</span>
	</div>
	<div class="text-center">
		<span class="text-3xl font-bold {accuracy >= 95 ? 'text-correct' : accuracy >= 85 ? 'text-warning' : 'text-error'}">{accuracy}%</span>
		<span class="text-text-dim text-sm ml-1">ACC</span>
	</div>
	{#if getConfig().mode === 'timed'}
		<div class="text-center">
			<span class="text-3xl font-bold text-text">{getTimerRemaining()}</span>
			<span class="text-text-dim text-sm ml-1">s</span>
		</div>
	{/if}
</div>
<ProgressBar value={getProgress()} />
