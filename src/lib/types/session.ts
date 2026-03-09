import type { Keystroke } from './keystroke.ts';

export type TestMode = 'timed' | 'words' | 'custom';
export type TextSource = 'words' | 'quotes' | 'programming';
export type TimedDuration = 15 | 30 | 60 | 120;
export type WordCount = 10 | 25 | 50 | 100;

export interface TestConfig {
  mode: TestMode;
  textSource: TextSource;
  duration?: TimedDuration;
  wordCount?: WordCount;
  customText?: string;
}

export interface TestSession {
  id: string;
  config: TestConfig;
  keystrokes: Keystroke[];
  startTime: number;
  endTime: number;
  text: string;
  completed: boolean;
}
