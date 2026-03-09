<script lang="ts">
	import { onMount } from 'svelte';
	import type { SessionSummary } from '$lib/types/history';

	interface Props {
		sessions: SessionSummary[];
	}

	let { sessions }: Props = $props();

	let canvas: HTMLCanvasElement | undefined = $state();
	let chart: any = $state(null);

	const data = $derived(sessions.slice(-30));

	async function renderChart() {
		if (!canvas || data.length < 2) return;

		const { Chart, registerables } = await import('chart.js');
		Chart.register(...registerables);

		if (chart) chart.destroy();

		const labels = data.map((s, i) => `#${i + 1}`);

		chart = new Chart(canvas, {
			type: 'line',
			data: {
				labels,
				datasets: [
					{
						label: 'WPM',
						data: data.map((s) => s.wpm),
						borderColor: '#7aa2f7',
						backgroundColor: '#7aa2f720',
						tension: 0.3,
						fill: true,
						yAxisID: 'y'
					},
					{
						label: 'Accuracy %',
						data: data.map((s) => s.accuracy),
						borderColor: '#9ece6a',
						backgroundColor: '#9ece6a20',
						tension: 0.3,
						fill: true,
						yAxisID: 'y1'
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					y: {
						type: 'linear',
						position: 'left',
						ticks: { color: '#565f89' },
						grid: { color: '#24283b' },
						title: { display: true, text: 'WPM', color: '#7aa2f7' }
					},
					y1: {
						type: 'linear',
						position: 'right',
						min: 80,
						max: 100,
						ticks: { color: '#565f89' },
						grid: { display: false },
						title: { display: true, text: 'Accuracy %', color: '#9ece6a' }
					},
					x: {
						ticks: { color: '#565f89' },
						grid: { color: '#24283b' }
					}
				},
				plugins: {
					legend: {
						labels: { color: '#c0caf5' }
					}
				}
			}
		});
	}

	onMount(() => {
		renderChart();
	});

	$effect(() => {
		// re-render when data changes
		if (data) renderChart();
	});
</script>

{#if data.length < 2}
	<p class="text-text-dim text-sm">Complete at least 2 sessions to see trends.</p>
{:else}
	<div class="h-64">
		<canvas bind:this={canvas}></canvas>
	</div>
{/if}
