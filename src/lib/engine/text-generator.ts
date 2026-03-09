import type { BigramTiming } from '$lib/types/keystroke';
import type { TextSource } from '$lib/types/session';

let wordsCache: string[] | null = null;
let quotesCache: { text: string; author: string }[] | null = null;
let programmingCache: string[] | null = null;

async function loadJson<T>(path: string): Promise<T> {
	const res = await fetch(path);
	return res.json();
}

export async function getWords(): Promise<string[]> {
	if (!wordsCache) {
		wordsCache = await loadJson<string[]>('/data/words.json');
	}
	return wordsCache;
}

export async function getQuotes(): Promise<{ text: string; author: string }[]> {
	if (!quotesCache) {
		quotesCache = await loadJson<{ text: string; author: string }[]>('/data/quotes.json');
	}
	return quotesCache;
}

export async function getProgrammingWords(): Promise<string[]> {
	if (!programmingCache) {
		programmingCache = await loadJson<string[]>('/data/programming.json');
	}
	return programmingCache;
}

function pickRandom<T>(arr: T[], n: number): T[] {
	const shuffled = [...arr].sort(() => Math.random() - 0.5);
	return shuffled.slice(0, n);
}

export async function generateText(
	source: TextSource,
	wordCount: number = 50
): Promise<string> {
	switch (source) {
		case 'words': {
			const words = await getWords();
			return pickRandom(words, wordCount).join(' ');
		}
		case 'quotes': {
			const quotes = await getQuotes();
			const picked = pickRandom(quotes, 5);
			let text = '';
			for (const q of picked) {
				if (text.length > 0) text += ' ';
				text += q.text;
				const words = text.split(/\s+/).length;
				if (words >= wordCount) break;
			}
			return text;
		}
		case 'programming': {
			const words = await getProgrammingWords();
			return pickRandom(words, wordCount).join(' ');
		}
	}
}

export async function generateTimedText(source: TextSource): Promise<string> {
	// Generate enough text for a long test (~120s at ~80wpm = ~160 words)
	return generateText(source, 200);
}

export function generatePracticeText(
	weakBigrams: BigramTiming[],
	wordCount: number = 50
): string {
	// This is synchronous because it works with already-loaded word lists
	if (!wordsCache || wordsCache.length === 0) {
		return 'the quick brown fox jumps over the lazy dog';
	}

	const targetSet = new Set(weakBigrams.map((b) => b.bigram));

	function scoreWord(word: string): number {
		let score = 0;
		const lw = word.toLowerCase();
		for (let i = 0; i < lw.length - 1; i++) {
			if (targetSet.has(lw[i] + lw[i + 1])) score++;
		}
		return score;
	}

	const scored = wordsCache.map((w) => ({ word: w, score: scoreWord(w) }));
	const highValue = scored.filter((w) => w.score >= 1);
	const filler = scored.filter((w) => w.score === 0);

	const result: string[] = [];
	for (let i = 0; i < wordCount; i++) {
		if (highValue.length > 0 && Math.random() < 0.75) {
			result.push(highValue[Math.floor(Math.random() * highValue.length)].word);
		} else {
			const pool = filler.length > 0 ? filler : scored;
			result.push(pool[Math.floor(Math.random() * pool.length)].word);
		}
	}
	return result.join(' ');
}
