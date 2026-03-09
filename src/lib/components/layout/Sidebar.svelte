<script lang="ts">
	import { page } from '$app/state';

	const links = [
		{ href: '/', label: 'Type', icon: '⌨' },
		{ href: '/analytics', label: 'Analytics', icon: '📊' },
		{ href: '/practice', label: 'Practice', icon: '🎯' },
		{ href: '/history', label: 'History', icon: '📋' }
	];
</script>

<nav class="fixed left-0 top-0 h-full w-16 bg-surface flex flex-col items-center py-6 gap-2 z-50 border-r border-white/5">
	<a href="/" class="text-accent text-xl font-bold mb-6">TS</a>
	{#each links as link}
		<a
			href={link.href}
			class="w-12 h-12 flex flex-col items-center justify-center rounded-lg text-xs gap-0.5 transition-colors
				{page.url.pathname === link.href ? 'bg-accent/20 text-accent' : 'text-text-dim hover:text-text hover:bg-white/5'}"
		>
			<span class="text-lg">{link.icon}</span>
			<span>{link.label}</span>
		</a>
	{/each}
</nav>
