import type { SessionSummary } from '$lib/types/history';
import { loadHistory, loadRawSessions, getSessionKeystrokes } from '$lib/services/persistence';
import type { Keystroke } from '$lib/types/keystroke';

let sessions = $state<SessionSummary[]>([]);

export function getSessions() {
	return sessions;
}

export function refreshHistory() {
	const record = loadHistory();
	sessions = record.sessions;
}

export function getKeystrokesForSession(id: string): Keystroke[] | null {
	return getSessionKeystrokes(id);
}

// Init
if (typeof window !== 'undefined') {
	refreshHistory();
}
