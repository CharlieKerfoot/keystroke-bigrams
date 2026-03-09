<script lang="ts">
	import type { ErrorPattern } from '$lib/types/analytics';
	import DataTable from '$lib/components/shared/DataTable.svelte';

	interface Props {
		errors: ErrorPattern[];
	}

	let { errors }: Props = $props();

	const rows = $derived(
		errors.slice(0, 20).map((e, i) => [
			i + 1,
			`"${e.expected}"`,
			`"${e.actual}"`,
			e.count
		])
	);
</script>

{#if errors.length === 0}
	<p class="text-text-dim text-sm">No errors recorded. Great accuracy!</p>
{:else}
	<DataTable
		headers={['#', 'Expected', 'Typed', 'Count']}
		{rows}
	/>
{/if}
