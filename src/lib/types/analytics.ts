import type { BigramTiming, TrigramTiming } from './keystroke.ts';

export interface PerCharStats {
  char: string;
  avgTime: number;
  accuracy: number;
  count: number;
}

export interface FingerStats {
  finger: string;       // e.g. "left-pinky", "right-index"
  avgTime: number;
  accuracy: number;
  totalKeystrokes: number;
}

export interface HandStats {
  hand: 'left' | 'right';
  avgTime: number;
  accuracy: number;
  totalKeystrokes: number;
}

export interface RowStats {
  row: 'number' | 'top' | 'home' | 'bottom';
  avgTime: number;
  accuracy: number;
  totalKeystrokes: number;
}

export interface ErrorPattern {
  expected: string;
  actual: string;
  count: number;
}

export interface AnalyticsData {
  perChar: PerCharStats[];
  bigrams: BigramTiming[];
  trigrams: TrigramTiming[];
  fingers: FingerStats[];
  hands: HandStats[];
  rows: RowStats[];
  errors: ErrorPattern[];
  wpm: number;
  rawWpm: number;
  accuracy: number;
}
