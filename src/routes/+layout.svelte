<script lang="ts">
	import '../app.css';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';

	let { children } = $props();
</script>

<div class="flex min-h-screen">
	<Sidebar />
	<main class="ml-16 flex-1 p-6 max-w-5xl mx-auto w-full">
		{@render children()}
	</main>
</div>
