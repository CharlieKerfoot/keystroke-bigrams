import type { Keystroke } from '$lib/types/keystroke';
import type {
	AnalyticsData,
	PerCharStats,
	FingerStats,
	HandStats,
	RowStats,
	ErrorPattern
} from '$lib/types/analytics';
import { computeBigramTimings } from './bigram';
import { computeTrigramTimings } from './trigram';
import { computeWpm, computeRawWpm, computeAccuracy } from './wpm';
import { getKeyInfo, type Finger, type Hand, type Row } from '$lib/config/keyboard';

export function computeAnalytics(keystrokes: Keystroke[]): AnalyticsData {
	return {
		perChar: computePerCharStats(keystrokes),
		bigrams: computeBigramTimings(keystrokes),
		trigrams: computeTrigramTimings(keystrokes),
		fingers: computeFingerStats(keystrokes),
		hands: computeHandStats(keystrokes),
		rows: computeRowStats(keystrokes),
		errors: computeErrorPatterns(keystrokes),
		wpm: computeWpm(keystrokes),
		rawWpm: computeRawWpm(keystrokes),
		accuracy: computeAccuracy(keystrokes)
	};
}

function computePerCharStats(keystrokes: Keystroke[]): PerCharStats[] {
	const stats: Record<string, { times: number[]; correct: number; total: number }> = {};

	for (let i = 1; i < keystrokes.length; i++) {
		const k = keystrokes[i];
		const ch = k.char.toLowerCase();
		if (!stats[ch]) stats[ch] = { times: [], correct: 0, total: 0 };
		stats[ch].total++;
		if (k.correct) {
			stats[ch].correct++;
			const dt = k.time - keystrokes[i - 1].time;
			if (dt > 0 && dt < 2000) stats[ch].times.push(dt);
		}
	}

	return Object.entries(stats)
		.map(([char, s]) => ({
			char,
			avgTime: s.times.length > 0 ? s.times.reduce((a, b) => a + b, 0) / s.times.length : 0,
			accuracy: s.total > 0 ? (s.correct / s.total) * 100 : 100,
			count: s.total
		}))
		.sort((a, b) => b.avgTime - a.avgTime);
}

function computeFingerStats(keystrokes: Keystroke[]): FingerStats[] {
	const stats: Record<string, { times: number[]; correct: number; total: number }> = {};

	for (let i = 1; i < keystrokes.length; i++) {
		const k = keystrokes[i];
		const info = getKeyInfo(k.char);
		if (!info) continue;
		const finger = info.finger;
		if (!stats[finger]) stats[finger] = { times: [], correct: 0, total: 0 };
		stats[finger].total++;
		if (k.correct) {
			stats[finger].correct++;
			const dt = k.time - keystrokes[i - 1].time;
			if (dt > 0 && dt < 2000) stats[finger].times.push(dt);
		}
	}

	return Object.entries(stats).map(([finger, s]) => ({
		finger,
		avgTime: s.times.length > 0 ? s.times.reduce((a, b) => a + b, 0) / s.times.length : 0,
		accuracy: s.total > 0 ? (s.correct / s.total) * 100 : 100,
		totalKeystrokes: s.total
	}));
}

function computeHandStats(keystrokes: Keystroke[]): HandStats[] {
	const stats: Record<Hand, { times: number[]; correct: number; total: number }> = {
		left: { times: [], correct: 0, total: 0 },
		right: { times: [], correct: 0, total: 0 }
	};

	for (let i = 1; i < keystrokes.length; i++) {
		const k = keystrokes[i];
		const info = getKeyInfo(k.char);
		if (!info) continue;
		const hand = info.hand;
		stats[hand].total++;
		if (k.correct) {
			stats[hand].correct++;
			const dt = k.time - keystrokes[i - 1].time;
			if (dt > 0 && dt < 2000) stats[hand].times.push(dt);
		}
	}

	return (['left', 'right'] as Hand[]).map((hand) => ({
		hand,
		avgTime:
			stats[hand].times.length > 0
				? stats[hand].times.reduce((a, b) => a + b, 0) / stats[hand].times.length
				: 0,
		accuracy:
			stats[hand].total > 0 ? (stats[hand].correct / stats[hand].total) * 100 : 100,
		totalKeystrokes: stats[hand].total
	}));
}

function computeRowStats(keystrokes: Keystroke[]): RowStats[] {
	const rows: Row[] = ['number', 'top', 'home', 'bottom'];
	const stats: Record<Row, { times: number[]; correct: number; total: number }> = {
		number: { times: [], correct: 0, total: 0 },
		top: { times: [], correct: 0, total: 0 },
		home: { times: [], correct: 0, total: 0 },
		bottom: { times: [], correct: 0, total: 0 }
	};

	for (let i = 1; i < keystrokes.length; i++) {
		const k = keystrokes[i];
		const info = getKeyInfo(k.char);
		if (!info) continue;
		const row = info.row;
		stats[row].total++;
		if (k.correct) {
			stats[row].correct++;
			const dt = k.time - keystrokes[i - 1].time;
			if (dt > 0 && dt < 2000) stats[row].times.push(dt);
		}
	}

	return rows
		.filter((row) => stats[row].total > 0)
		.map((row) => ({
			row,
			avgTime:
				stats[row].times.length > 0
					? stats[row].times.reduce((a, b) => a + b, 0) / stats[row].times.length
					: 0,
			accuracy:
				stats[row].total > 0 ? (stats[row].correct / stats[row].total) * 100 : 100,
			totalKeystrokes: stats[row].total
		}));
}

function computeErrorPatterns(keystrokes: Keystroke[]): ErrorPattern[] {
	const errors: Record<string, number> = {};

	for (const k of keystrokes) {
		if (!k.correct) {
			const key = `${k.char}→${k.typed}`;
			errors[key] = (errors[key] || 0) + 1;
		}
	}

	return Object.entries(errors)
		.map(([key, count]) => {
			const [expected, actual] = key.split('→');
			return { expected, actual, count };
		})
		.sort((a, b) => b.count - a.count);
}
