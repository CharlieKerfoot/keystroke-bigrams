export interface Keystroke {
  char: string;        // expected character
  typed: string;       // what was actually typed
  correct: boolean;
  time: number;        // performance.now() timestamp
}

export interface BigramTiming {
  bigram: string;
  times: number[];
  median: number;
  count: number;
}

export interface TrigramTiming {
  trigram: string;
  times: number[];
  median: number;
  count: number;
}
