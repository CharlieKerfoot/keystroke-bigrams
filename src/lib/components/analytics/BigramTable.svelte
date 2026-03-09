<script lang="ts">
	import type { BigramTiming } from '$lib/types/keystroke';
	import DataTable from '$lib/components/shared/DataTable.svelte';

	interface Props {
		bigrams: BigramTiming[];
		maxRows?: number;
	}

	let { bigrams, maxRows = 30 }: Props = $props();

	const rows = $derived(
		bigrams.slice(0, maxRows).map((b, i) => [
			i + 1,
			b.bigram,
			`${Math.round(b.median)} ms`,
			b.count
		])
	);
</script>

<DataTable
	headers={['#', 'Bigram', 'Median Time', 'Samples']}
	{rows}
/>
