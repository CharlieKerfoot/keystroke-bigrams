<script lang="ts">
	interface Props {
		label: string;
		value: string | number;
		color?: 'accent' | 'correct' | 'error' | 'warning' | 'text';
	}

	let { label, value, color = 'accent' }: Props = $props();

	const colorMap: Record<string, string> = {
		accent: 'text-accent',
		correct: 'text-correct',
		error: 'text-error',
		warning: 'text-warning',
		text: 'text-text'
	};
</script>

<div class="bg-bg rounded-lg px-4 py-3 text-center min-w-[100px]">
	<div class="text-text-dim text-[0.65rem] uppercase tracking-wider">{label}</div>
	<div class="text-2xl font-bold mt-1 {colorMap[color]}">{value}</div>
</div>
