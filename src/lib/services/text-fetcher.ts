import { getQuotes } from '$lib/engine/text-generator';

interface QuotableQuote {
	content: string;
	author: string;
}

const CACHE_KEY = 'typeslow_quotes_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CachedQuotes {
	quotes: { text: string; author: string }[];
	timestamp: number;
}

function getCachedQuotes(): CachedQuotes | null {
	try {
		const raw = localStorage.getItem(CACHE_KEY);
		if (!raw) return null;
		const data = JSON.parse(raw) as CachedQuotes;
		if (Date.now() - data.timestamp < CACHE_DURATION) return data;
	} catch {
		// ignore
	}
	return null;
}

function setCachedQuotes(quotes: { text: string; author: string }[]): void {
	const data: CachedQuotes = { quotes, timestamp: Date.now() };
	try {
		localStorage.setItem(CACHE_KEY, JSON.stringify(data));
	} catch {
		// storage full
	}
}

export async function fetchQuotes(
	count: number = 10
): Promise<{ text: string; author: string }[]> {
	// Check cache first
	const cached = getCachedQuotes();
	if (cached && cached.quotes.length >= count) {
		// Refresh in background
		refreshQuotesInBackground();
		return cached.quotes;
	}

	// Try API
	try {
		const res = await fetch(
			`https://api.quotable.io/quotes/random?limit=${count}`,
			{ signal: AbortSignal.timeout(3000) }
		);
		if (res.ok) {
			const data = (await res.json()) as QuotableQuote[];
			const quotes = data.map((q) => ({ text: q.content, author: q.author }));
			setCachedQuotes(quotes);
			return quotes;
		}
	} catch {
		// API failed, fall back
	}

	// Fallback to bundled quotes
	return getQuotes();
}

async function refreshQuotesInBackground(): Promise<void> {
	try {
		const res = await fetch('https://api.quotable.io/quotes/random?limit=20', {
			signal: AbortSignal.timeout(5000)
		});
		if (res.ok) {
			const data = (await res.json()) as QuotableQuote[];
			setCachedQuotes(data.map((q) => ({ text: q.content, author: q.author })));
		}
	} catch {
		// silent fail
	}
}
