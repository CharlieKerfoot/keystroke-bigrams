import type { Keystroke, TrigramTiming } from '$lib/types/keystroke';
import { median } from './bigram';

export function computeTrigramTimings(keystrokes: Keystroke[]): TrigramTiming[] {
	const timings: Record<string, number[]> = {};

	for (let i = 2; i < keystrokes.length; i++) {
		if (!keystrokes[i].correct || !keystrokes[i - 1].correct || !keystrokes[i - 2].correct)
			continue;
		const a = keystrokes[i - 2].char.toLowerCase();
		const b = keystrokes[i - 1].char.toLowerCase();
		const c = keystrokes[i].char.toLowerCase();
		if (!/[a-z]/.test(a) || !/[a-z]/.test(b) || !/[a-z]/.test(c)) continue;

		const tg = a + b + c;
		const dt = keystrokes[i].time - keystrokes[i - 2].time;
		if (dt > 0 && dt < 4000) {
			if (!timings[tg]) timings[tg] = [];
			timings[tg].push(dt);
		}
	}

	return Object.entries(timings)
		.filter(([, times]) => times.length >= 2)
		.map(([trigram, times]) => ({
			trigram,
			times,
			median: median(times),
			count: times.length
		}))
		.sort((a, b) => b.median - a.median);
}
