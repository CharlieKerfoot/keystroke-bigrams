import type { TestMode, TestConfig, TestSession } from '$lib/types/session';
import type { Keystroke } from '$lib/types/keystroke';
import type { AnalyticsData } from '$lib/types/analytics';
import {
	createTypingState,
	processKey,
	type TypingState
} from '$lib/engine/typing-engine';
import { computeAnalytics } from '$lib/engine/analytics-computer';
import { computeLiveWpm, computeAccuracy } from '$lib/engine/wpm';
import { addSession } from '$lib/services/persistence';

export type TestPhase = 'idle' | 'ready' | 'typing' | 'finished';

let phase = $state<TestPhase>('idle');
let config = $state<TestConfig>({ mode: 'timed', textSource: 'words', duration: 30 });
let typingState = $state<TypingState>(createTypingState(''));
let timerRemaining = $state<number>(0);
let timerInterval = $state<ReturnType<typeof setInterval> | null>(null);
let lastSession = $state<TestSession | null>(null);
let lastAnalytics = $state<AnalyticsData | null>(null);

export function getPhase() {
	return phase;
}
export function getConfig() {
	return config;
}
export function getTypingState() {
	return typingState;
}
export function getTimerRemaining() {
	return timerRemaining;
}
export function getLastSession() {
	return lastSession;
}
export function getLastAnalytics() {
	return lastAnalytics;
}

export function getLiveWpm(): number {
	if (typingState.keystrokes.length === 0) return 0;
	return computeLiveWpm(typingState.keystrokes, performance.now());
}

export function getLiveAccuracy(): number {
	return computeAccuracy(typingState.keystrokes);
}

export function getProgress(): number {
	if (config.mode === 'timed' && config.duration) {
		const elapsed = config.duration - timerRemaining;
		return (elapsed / config.duration) * 100;
	}
	if (typingState.text.length === 0) return 0;
	return (typingState.charIndex / typingState.text.length) * 100;
}

export function setupTest(text: string, testConfig: TestConfig) {
	cleanup();
	config = testConfig;
	typingState = createTypingState(text);
	timerRemaining = testConfig.duration ?? 0;
	phase = 'ready';
	lastSession = null;
	lastAnalytics = null;
}

export function handleKey(key: string): void {
	if (phase === 'finished') return;

	const now = performance.now();

	// Start on first keypress
	if (phase === 'ready') {
		phase = 'typing';
		if (config.mode === 'timed' && config.duration) {
			startTimer();
		}
	}

	const result = processKey(typingState, key, now);
	typingState = result.state;

	if (result.passageComplete) {
		finishTest();
	} else if (config.mode === 'words' && config.wordCount) {
		// Check if we've typed enough words
		const wordsTyped = typingState.keystrokes.filter((k) => k.char === ' ' && k.correct).length;
		if (wordsTyped >= (config.wordCount ?? 0)) {
			finishTest();
		}
	}
}

function startTimer() {
	timerInterval = setInterval(() => {
		timerRemaining--;
		if (timerRemaining <= 0) {
			timerRemaining = 0;
			finishTest();
		}
	}, 1000);
}

function finishTest() {
	phase = 'finished';
	if (timerInterval) {
		clearInterval(timerInterval);
		timerInterval = null;
	}

	const endTime = performance.now();
	const session: TestSession = {
		id: crypto.randomUUID(),
		config,
		keystrokes: typingState.keystrokes,
		startTime: typingState.startTime,
		endTime,
		text: typingState.text,
		completed: true
	};

	lastSession = session;
	lastAnalytics = computeAnalytics(session.keystrokes);

	// Persist
	addSession(session);
}

export function restart() {
	cleanup();
	phase = 'idle';
}

function cleanup() {
	if (timerInterval) {
		clearInterval(timerInterval);
		timerInterval = null;
	}
}
