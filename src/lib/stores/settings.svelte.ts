import type { TestConfig, TextSource, TimedDuration, WordCount } from '$lib/types/session';

const SETTINGS_KEY = 'typeslow_settings';

interface Settings {
	textSource: TextSource;
	timedDuration: TimedDuration;
	wordCount: WordCount;
}

const defaults: Settings = {
	textSource: 'words',
	timedDuration: 30,
	wordCount: 25
};

function loadSettings(): Settings {
	try {
		const raw = localStorage.getItem(SETTINGS_KEY);
		if (raw) return { ...defaults, ...JSON.parse(raw) };
	} catch {
		// ignore
	}
	return { ...defaults };
}

function saveSettings(s: Settings): void {
	localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

const stored = loadSettings();

export let textSource = $state<TextSource>(stored.textSource);
export let timedDuration = $state<TimedDuration>(stored.timedDuration);
export let wordCount = $state<WordCount>(stored.wordCount);

export function updateTextSource(v: TextSource) {
	textSource = v;
	saveSettings({ textSource, timedDuration, wordCount });
}

export function updateTimedDuration(v: TimedDuration) {
	timedDuration = v;
	saveSettings({ textSource, timedDuration, wordCount });
}

export function updateWordCount(v: WordCount) {
	wordCount = v;
	saveSettings({ textSource, timedDuration, wordCount });
}
