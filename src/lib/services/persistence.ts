import type { SessionSummary, HistoricalRecord } from '$lib/types/history';
import type { Keystroke } from '$lib/types/keystroke';
import type { TestSession } from '$lib/types/session';
import { computeWpm, computeRawWpm, computeAccuracy } from '$lib/engine/wpm';

const HISTORY_KEY = 'typeslow_history';
const SESSIONS_KEY = 'typeslow_sessions';
const CURRENT_VERSION = 1;
const MAX_RAW_SESSIONS = 50;

export function loadHistory(): HistoricalRecord {
	try {
		const raw = localStorage.getItem(HISTORY_KEY);
		if (raw) {
			const data = JSON.parse(raw) as HistoricalRecord;
			if (data.version === CURRENT_VERSION) return data;
		}
	} catch {
		// corrupted data
	}
	return { sessions: [], version: CURRENT_VERSION };
}

export function saveHistory(record: HistoricalRecord): void {
	localStorage.setItem(HISTORY_KEY, JSON.stringify(record));
}

export function sessionToSummary(session: TestSession): SessionSummary {
	return {
		id: session.id,
		date: new Date(session.startTime).toISOString(),
		config: session.config,
		wpm: computeWpm(session.keystrokes),
		rawWpm: computeRawWpm(session.keystrokes),
		accuracy: computeAccuracy(session.keystrokes),
		duration: session.endTime - session.startTime,
		charCount: session.keystrokes.length
	};
}

export function addSession(session: TestSession): void {
	const history = loadHistory();
	history.sessions.push(sessionToSummary(session));
	saveHistory(history);

	// Store raw keystrokes separately, capped at MAX_RAW_SESSIONS
	const rawSessions = loadRawSessions();
	rawSessions.push({
		id: session.id,
		keystrokes: session.keystrokes
	});
	if (rawSessions.length > MAX_RAW_SESSIONS) {
		rawSessions.splice(0, rawSessions.length - MAX_RAW_SESSIONS);
	}
	localStorage.setItem(SESSIONS_KEY, JSON.stringify(rawSessions));
}

export function loadRawSessions(): { id: string; keystrokes: Keystroke[] }[] {
	try {
		const raw = localStorage.getItem(SESSIONS_KEY);
		if (raw) return JSON.parse(raw);
	} catch {
		// corrupted
	}
	return [];
}

export function getSessionKeystrokes(id: string): Keystroke[] | null {
	const sessions = loadRawSessions();
	const found = sessions.find((s) => s.id === id);
	return found?.keystrokes ?? null;
}

export function exportData(): string {
	const history = loadHistory();
	const sessions = loadRawSessions();
	return JSON.stringify({ history, sessions }, null, 2);
}

export function importData(json: string): boolean {
	try {
		const data = JSON.parse(json);
		if (data.history) saveHistory(data.history);
		if (data.sessions) localStorage.setItem(SESSIONS_KEY, JSON.stringify(data.sessions));
		return true;
	} catch {
		return false;
	}
}

export function clearAllData(): void {
	localStorage.removeItem(HISTORY_KEY);
	localStorage.removeItem(SESSIONS_KEY);
}
