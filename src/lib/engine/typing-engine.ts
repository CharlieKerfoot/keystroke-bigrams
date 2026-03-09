import type { Keystroke } from '$lib/types/keystroke';

export interface TypingState {
	text: string;
	charIndex: number;
	keystrokes: Keystroke[];
	startTime: number;
	finished: boolean;
}

export function createTypingState(text: string): TypingState {
	return {
		text,
		charIndex: 0,
		keystrokes: [],
		startTime: 0,
		finished: false
	};
}

export interface KeyResult {
	state: TypingState;
	passageComplete: boolean;
}

export function processKey(state: TypingState, key: string, time: number): KeyResult {
	if (state.finished) return { state, passageComplete: false };

	// Backspace
	if (key === 'Backspace') {
		if (state.charIndex > 0) {
			return {
				state: {
					...state,
					charIndex: state.charIndex - 1,
					keystrokes: state.keystrokes.slice(0, -1)
				},
				passageComplete: false
			};
		}
		return { state, passageComplete: false };
	}

	// Ignore non-printable
	if (key.length !== 1) return { state, passageComplete: false };

	const startTime = state.keystrokes.length === 0 ? time : state.startTime;
	const expected = state.text[state.charIndex];
	const correct = key === expected;

	const keystroke: Keystroke = {
		char: expected,
		typed: key,
		correct,
		time
	};

	const newIndex = state.charIndex + 1;
	const finished = newIndex >= state.text.length;

	return {
		state: {
			...state,
			charIndex: newIndex,
			keystrokes: [...state.keystrokes, keystroke],
			startTime,
			finished
		},
		passageComplete: finished
	};
}

export function shouldIgnoreKey(e: KeyboardEvent): boolean {
	if (e.ctrlKey || e.metaKey || e.altKey) return true;
	if (e.key === 'Tab' || e.key === 'Escape') return false; // handled separately
	if (['Shift', 'CapsLock', 'Control', 'Alt', 'Meta'].includes(e.key)) return true;
	return false;
}
