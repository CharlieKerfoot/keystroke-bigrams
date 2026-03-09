<script lang="ts">
	import { onMount } from 'svelte';
	import { getAnalytics, computeFromAllSessions } from '$lib/stores/analytics.svelte';
	import PracticeGenerator from '$lib/components/practice/PracticeGenerator.svelte';
	import SuggestionCard from '$lib/components/practice/SuggestionCard.svelte';
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

	let drillLabel = $state('');

	onMount(() => {
		computeFromAllSessions();
	});

	const analytics = $derived(getAnalytics());

	function onStartDrill(text: string, label: string) {
		drillLabel = label;
		setupTest(text, { mode: 'words', textSource: 'words', wordCount: 50 });
	}

	function onEscape() {
		restart();
	}
</script>

<svelte:head>
	<title>TypeSlow — Practice</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<h1 class="text-accent text-2xl font-bold">Practice</h1>

	{#if getPhase() === 'ready' || getPhase() === 'typing'}
		<p class="text-text-dim text-sm">{drillLabel}</p>
		<LiveStats />
		<TypingArea
			text={getTypingState().text}
			charIndex={getTypingState().charIndex}
			keystrokes={getTypingState().keystrokes}
			onKey={handleKey}
			{onEscape}
		/>
	{:else if getPhase() === 'finished' && getLastAnalytics()}
		<PostTestResults
			analytics={getLastAnalytics()!}
			onRestart={() => restart()}
			onViewAnalytics={() => restart()}
		/>
	{:else if !analytics}
		<div class="bg-surface rounded-lg p-8 text-center">
			<p class="text-text-dim">Complete some typing tests first to generate personalized drills.</p>
			<a href="/" class="text-accent hover:underline text-sm mt-2 inline-block">Go to typing test</a>
		</div>
	{:else}
		<!-- Suggestions -->
		<section class="bg-surface rounded-lg p-4">
			<h2 class="text-accent text-sm font-bold mb-3">Tips & Suggestions</h2>
			<SuggestionCard
				fingerStats={analytics.fingers}
				handStats={analytics.hands}
				accuracy={analytics.accuracy}
			/>
		</section>

		<!-- Drills -->
		<section>
			<h2 class="text-accent text-sm font-bold mb-3">Generated Drills</h2>
			<PracticeGenerator
				weakBigrams={analytics.bigrams.slice(0, 15)}
				fingerStats={analytics.fingers}
				{onStartDrill}
			/>
		</section>
	{/if}
</div>
