import type { Keystroke } from '$lib/types/keystroke';

export function computeWpm(keystrokes: Keystroke[]): number {
	if (keystrokes.length < 2) return 0;
	const elapsed = (keystrokes[keystrokes.length - 1].time - keystrokes[0].time) / 1000 / 60;
	if (elapsed <= 0) return 0;
	const correctChars = keystrokes.filter((k) => k.correct).length;
	return Math.round(correctChars / 5 / elapsed);
}

export function computeRawWpm(keystrokes: Keystroke[]): number {
	if (keystrokes.length < 2) return 0;
	const elapsed = (keystrokes[keystrokes.length - 1].time - keystrokes[0].time) / 1000 / 60;
	if (elapsed <= 0) return 0;
	return Math.round(keystrokes.length / 5 / elapsed);
}

export function computeAccuracy(keystrokes: Keystroke[]): number {
	if (keystrokes.length === 0) return 100;
	const correct = keystrokes.filter((k) => k.correct).length;
	return Math.round((correct / keystrokes.length) * 1000) / 10;
}

export function computeLiveWpm(keystrokes: Keystroke[], now: number): number {
	if (keystrokes.length === 0) return 0;
	const elapsed = (now - keystrokes[0].time) / 1000 / 60;
	if (elapsed <= 0) return 0;
	const correctChars = keystrokes.filter((k) => k.correct).length;
	return Math.round(correctChars / 5 / elapsed);
}
