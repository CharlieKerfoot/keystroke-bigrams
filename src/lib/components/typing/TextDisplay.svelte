<script lang="ts">
	interface Props {
		text: string;
		charIndex: number;
		keystrokes: { correct: boolean }[];
	}

	let { text, charIndex, keystrokes }: Props = $props();
</script>

<div class="text-xl leading-relaxed tracking-wide font-mono whitespace-pre-wrap break-words">
	{#each text.split('') as char, i}
		<span
			class:text-correct={i < charIndex && keystrokes[i]?.correct}
			class:text-error={i < charIndex && !keystrokes[i]?.correct}
			class:underline={i < charIndex && !keystrokes[i]?.correct}
			class:bg-accent={i === charIndex}
			class:text-bg={i === charIndex}
			class:text-text-dim={i > charIndex}
			class="rounded-[2px]"
		>{char === ' ' ? '\u00A0' : char}</span>
	{/each}
</div>
