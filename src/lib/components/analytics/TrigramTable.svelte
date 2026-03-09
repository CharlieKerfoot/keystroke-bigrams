<script lang="ts">
	import type { TrigramTiming } from '$lib/types/keystroke';
	import DataTable from '$lib/components/shared/DataTable.svelte';

	interface Props {
		trigrams: TrigramTiming[];
		maxRows?: number;
	}

	let { trigrams, maxRows = 30 }: Props = $props();

	const rows = $derived(
		trigrams.slice(0, maxRows).map((t, i) => [
			i + 1,
			t.trigram,
			`${Math.round(t.median)} ms`,
			t.count
		])
	);
</script>

<DataTable
	headers={['#', 'Trigram', 'Median Time', 'Samples']}
	{rows}
/>
