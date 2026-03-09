<script lang="ts">
	interface Props {
		headers: string[];
		rows: (string | number)[][];
		maxRows?: number;
	}

	let { headers, rows, maxRows = 50 }: Props = $props();

	const displayRows = $derived(rows.slice(0, maxRows));
</script>

<div class="overflow-auto max-h-96">
	<table class="w-full text-sm border-collapse">
		<thead>
			<tr>
				{#each headers as h}
					<th class="text-left text-text-dim text-[0.65rem] uppercase tracking-wider px-3 py-2 border-b border-white/5">{h}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each displayRows as row}
				<tr class="hover:bg-white/5">
					{#each row as cell}
						<td class="px-3 py-1.5 border-b border-white/5">{cell}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
