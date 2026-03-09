import type { TestConfig } from './session.ts';

export interface SessionSummary {
  id: string;
  date: string;       // ISO string
  config: TestConfig;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  duration: number;    // ms
  charCount: number;
}

export interface HistoricalRecord {
  sessions: SessionSummary[];
  version: number;
}
