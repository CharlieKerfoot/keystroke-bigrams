import type { Keystroke, BigramTiming } from '$lib/types/keystroke';

function median(arr: number[]): number {
	if (arr.length === 0) return 0;
	const s = [...arr].sort((a, b) => a - b);
	const mid = Math.floor(s.length / 2);
	return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export function computeBigramTimings(keystrokes: Keystroke[]): BigramTiming[] {
	const timings: Record<string, number[]> = {};

	for (let i = 1; i < keystrokes.length; i++) {
		if (!keystrokes[i].correct || !keystrokes[i - 1].correct) continue;
		const a = keystrokes[i - 1].char.toLowerCase();
		const b = keystrokes[i].char.toLowerCase();
		if (!/[a-z]/.test(a) || !/[a-z]/.test(b)) continue;

		const bg = a + b;
		const dt = keystrokes[i].time - keystrokes[i - 1].time;
		if (dt > 0 && dt < 2000) {
			if (!timings[bg]) timings[bg] = [];
			timings[bg].push(dt);
		}
	}

	return Object.entries(timings)
		.filter(([, times]) => times.length >= 2)
		.map(([bigram, times]) => ({
			bigram,
			times,
			median: median(times),
			count: times.length
		}))
		.sort((a, b) => b.median - a.median);
}

export function getSlowestBigrams(bigrams: BigramTiming[], n = 20): BigramTiming[] {
	return bigrams.slice(0, n);
}

export function overallBigramMedian(bigrams: BigramTiming[]): number {
	const medians = bigrams.map((b) => b.median);
	return medians.length > 0 ? median(medians) : 150;
}

export { median };
