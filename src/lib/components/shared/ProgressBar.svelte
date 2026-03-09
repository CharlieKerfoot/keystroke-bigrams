<script lang="ts">
	interface Props {
		value: number;
		max?: number;
		color?: string;
	}

	let { value, max = 100, color = 'bg-accent' }: Props = $props();

	const pct = $derived(Math.min(100, (value / max) * 100));
</script>

<div class="w-full h-1.5 bg-surface rounded-full overflow-hidden">
	<div
		class="h-full rounded-full transition-all duration-300 {color}"
		style="width: {pct}%"
	></div>
</div>
