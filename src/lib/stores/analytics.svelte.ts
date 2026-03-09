import type { AnalyticsData } from '$lib/types/analytics';
import type { Keystroke } from '$lib/types/keystroke';
import { computeAnalytics } from '$lib/engine/analytics-computer';
import { loadRawSessions } from '$lib/services/persistence';

let currentAnalytics = $state<AnalyticsData | null>(null);

export function getAnalytics() {
	return currentAnalytics;
}

export function computeFromKeystrokes(keystrokes: Keystroke[]) {
	currentAnalytics = computeAnalytics(keystrokes);
}

export function computeFromAllSessions() {
	const sessions = loadRawSessions();
	if (sessions.length === 0) {
		currentAnalytics = null;
		return;
	}
	// Merge all keystrokes
	const allKeystrokes = sessions.flatMap((s) => s.keystrokes);
	currentAnalytics = computeAnalytics(allKeystrokes);
}

export function computeFromSession(id: string) {
	const sessions = loadRawSessions();
	const session = sessions.find((s) => s.id === id);
	if (session) {
		currentAnalytics = computeAnalytics(session.keystrokes);
	}
}
