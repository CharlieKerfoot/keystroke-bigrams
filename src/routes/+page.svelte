<script lang="ts">
	import { goto } from '$app/navigation';
	import type { TestMode, TextSource, TimedDuration, WordCount, TestConfig } from '$lib/types/session';
	import TestModeSelector from '$lib/components/typing/TestModeSelector.svelte';
	import TypingArea from '$lib/components/typing/TypingArea.svelte';
	import LiveStats from '$lib/components/typing/LiveStats.svelte';
	import PostTestResults from '$lib/components/typing/PostTestResults.svelte';
	import {
		getPhase,
		getTypingState,
		getLastAnalytics,
		setupTest,
		handleKey,
		restart
	} from '$lib/stores/test.svelte';
	import { generateText, generateTimedText } from '$lib/engine/text-generator';

	async function onStart(mode: TestMode, source: TextSource, duration?: TimedDuration, wordCount?: WordCount) {
		const config: TestConfig = { mode, textSource: source, duration, wordCount };
		let text: string;

		if (mode === 'timed') {
			text = await generateTimedText(source);
		} else {
			text = await generateText(source, wordCount ?? 25);
		}

		setupTest(text, config);
	}

	function onRestart() {
		restart();
	}

	function onViewAnalytics() {
		goto('/analytics');
	}

	function onEscape() {
		restart();
	}
</script>

<svelte:head>
	<title>TypeSlow — Typing Test</title>
</svelte:head>

<div class="flex flex-col items-center pt-8">
	<h1 class="text-accent text-3xl font-bold mb-1">TypeSlow</h1>
	<p class="text-text-dim text-sm mb-8">Typing Analytics & Training</p>

	{#if getPhase() === 'idle'}
		<TestModeSelector {onStart} />
	{:else if getPhase() === 'ready' || getPhase() === 'typing'}
		<div class="w-full max-w-3xl">
			<LiveStats />
			<TypingArea
				text={getTypingState().text}
				charIndex={getTypingState().charIndex}
				keystrokes={getTypingState().keystrokes}
				onKey={handleKey}
				{onEscape}
			/>
		</div>
	{:else if getPhase() === 'finished' && getLastAnalytics()}
		<PostTestResults
			analytics={getLastAnalytics()!}
			{onRestart}
			{onViewAnalytics}
		/>
	{/if}
</div>
