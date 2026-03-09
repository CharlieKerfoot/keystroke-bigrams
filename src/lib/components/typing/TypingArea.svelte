<script lang="ts">
	import TextDisplay from './TextDisplay.svelte';
	import { shouldIgnoreKey } from '$lib/engine/typing-engine';

	interface Props {
		text: string;
		charIndex: number;
		keystrokes: { correct: boolean }[];
		onKey: (key: string) => void;
		onEscape: () => void;
	}

	let { text, charIndex, keystrokes, onKey, onEscape }: Props = $props();

	let inputEl: HTMLInputElement | undefined = $state();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			onEscape();
			return;
		}
		if (shouldIgnoreKey(e)) return;
		if (e.key === 'Tab') return;
		e.preventDefault();
		onKey(e.key);
	}

	function focus() {
		inputEl?.focus();
	}

	$effect(() => {
		focus();
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="bg-surface rounded-xl p-8 mb-4 min-h-[180px] cursor-text relative focus-within:ring-2 focus-within:ring-accent"
	onclick={focus}
>
	<TextDisplay {text} {charIndex} {keystrokes} />
	<input
		bind:this={inputEl}
		type="text"
		class="absolute inset-0 opacity-0 cursor-text"
		autocomplete="off"
		autocorrect="off"
		autocapitalize="off"
		spellcheck="false"
		onkeydown={handleKeydown}
		onblur={() => setTimeout(focus, 50)}
	/>
</div>

<p class="text-center text-text-dim text-xs italic">Click here or start typing. Press Escape to cancel.</p>
