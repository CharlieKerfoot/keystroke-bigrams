<script lang="ts">
	import type { TestMode, TextSource, TimedDuration, WordCount } from '$lib/types/session';

	interface Props {
		onStart: (mode: TestMode, source: TextSource, duration?: TimedDuration, wordCount?: WordCount) => void;
	}

	let { onStart }: Props = $props();

	let mode = $state<TestMode>('timed');
	let source = $state<TextSource>('words');
	let duration = $state<TimedDuration>(30);
	let words = $state<WordCount>(25);

	const durations: TimedDuration[] = [15, 30, 60, 120];
	const wordCounts: WordCount[] = [10, 25, 50, 100];
	const sources: { value: TextSource; label: string }[] = [
		{ value: 'words', label: 'Common Words' },
		{ value: 'quotes', label: 'Quotes' },
		{ value: 'programming', label: 'Programming' }
	];

	function start() {
		onStart(mode, source, mode === 'timed' ? duration : undefined, mode === 'words' ? words : undefined);
	}
</script>

<div class="flex flex-col gap-4 items-center">
	<!-- Mode selector -->
	<div class="flex gap-2">
		{#each [['timed', 'Timed'], ['words', 'Words']] as [m, label]}
			<button
				class="px-4 py-2 rounded-lg text-sm transition-colors
					{mode === m ? 'bg-accent text-bg font-bold' : 'bg-surface text-text-dim hover:text-text'}"
				onclick={() => mode = m as TestMode}
			>{label}</button>
		{/each}
	</div>

	<!-- Duration/word count -->
	<div class="flex gap-2">
		{#if mode === 'timed'}
			{#each durations as d}
				<button
					class="px-3 py-1.5 rounded text-sm transition-colors
						{duration === d ? 'bg-accent/20 text-accent' : 'text-text-dim hover:text-text'}"
					onclick={() => duration = d}
				>{d}s</button>
			{/each}
		{:else}
			{#each wordCounts as w}
				<button
					class="px-3 py-1.5 rounded text-sm transition-colors
						{words === w ? 'bg-accent/20 text-accent' : 'text-text-dim hover:text-text'}"
					onclick={() => words = w}
				>{w}</button>
			{/each}
		{/if}
	</div>

	<!-- Text source -->
	<div class="flex gap-2">
		{#each sources as s}
			<button
				class="px-3 py-1.5 rounded text-sm transition-colors
					{source === s.value ? 'bg-accent/20 text-accent' : 'text-text-dim hover:text-text'}"
				onclick={() => source = s.value}
			>{s.label}</button>
		{/each}
	</div>

	<button
		class="mt-2 px-8 py-3 bg-accent text-bg rounded-lg font-bold text-base hover:opacity-85 transition-opacity"
		onclick={start}
	>Start Typing</button>
</div>
