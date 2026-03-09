export type Finger = 'left-pinky' | 'left-ring' | 'left-middle' | 'left-index' | 'right-index' | 'right-middle' | 'right-ring' | 'right-pinky';
export type Hand = 'left' | 'right';
export type Row = 'number' | 'top' | 'home' | 'bottom';

export interface KeyInfo {
  finger: Finger;
  hand: Hand;
  row: Row;
}

// Standard QWERTY mapping for lowercase letters, numbers, and common punctuation
const KEY_MAP: Record<string, KeyInfo> = {
  // Number row
  '1': { finger: 'left-pinky', hand: 'left', row: 'number' },
  '2': { finger: 'left-ring', hand: 'left', row: 'number' },
  '3': { finger: 'left-middle', hand: 'left', row: 'number' },
  '4': { finger: 'left-index', hand: 'left', row: 'number' },
  '5': { finger: 'left-index', hand: 'left', row: 'number' },
  '6': { finger: 'right-index', hand: 'right', row: 'number' },
  '7': { finger: 'right-index', hand: 'right', row: 'number' },
  '8': { finger: 'right-middle', hand: 'right', row: 'number' },
  '9': { finger: 'right-ring', hand: 'right', row: 'number' },
  '0': { finger: 'right-pinky', hand: 'right', row: 'number' },
  // Top row: qwertyuiop
  'q': { finger: 'left-pinky', hand: 'left', row: 'top' },
  'w': { finger: 'left-ring', hand: 'left', row: 'top' },
  'e': { finger: 'left-middle', hand: 'left', row: 'top' },
  'r': { finger: 'left-index', hand: 'left', row: 'top' },
  't': { finger: 'left-index', hand: 'left', row: 'top' },
  'y': { finger: 'right-index', hand: 'right', row: 'top' },
  'u': { finger: 'right-index', hand: 'right', row: 'top' },
  'i': { finger: 'right-middle', hand: 'right', row: 'top' },
  'o': { finger: 'right-ring', hand: 'right', row: 'top' },
  'p': { finger: 'right-pinky', hand: 'right', row: 'top' },
  // Home row: asdfghjkl;
  'a': { finger: 'left-pinky', hand: 'left', row: 'home' },
  's': { finger: 'left-ring', hand: 'left', row: 'home' },
  'd': { finger: 'left-middle', hand: 'left', row: 'home' },
  'f': { finger: 'left-index', hand: 'left', row: 'home' },
  'g': { finger: 'left-index', hand: 'left', row: 'home' },
  'h': { finger: 'right-index', hand: 'right', row: 'home' },
  'j': { finger: 'right-index', hand: 'right', row: 'home' },
  'k': { finger: 'right-middle', hand: 'right', row: 'home' },
  'l': { finger: 'right-ring', hand: 'right', row: 'home' },
  ';': { finger: 'right-pinky', hand: 'right', row: 'home' },
  // Bottom row: zxcvbnm,.
  'z': { finger: 'left-pinky', hand: 'left', row: 'bottom' },
  'x': { finger: 'left-ring', hand: 'left', row: 'bottom' },
  'c': { finger: 'left-middle', hand: 'left', row: 'bottom' },
  'v': { finger: 'left-index', hand: 'left', row: 'bottom' },
  'b': { finger: 'left-index', hand: 'left', row: 'bottom' },
  'n': { finger: 'right-index', hand: 'right', row: 'bottom' },
  'm': { finger: 'right-index', hand: 'right', row: 'bottom' },
  ',': { finger: 'right-middle', hand: 'right', row: 'bottom' },
  '.': { finger: 'right-ring', hand: 'right', row: 'bottom' },
  '/': { finger: 'right-pinky', hand: 'right', row: 'bottom' },
  // Space
  ' ': { finger: 'right-index', hand: 'right', row: 'bottom' },
};

export function getKeyInfo(key: string): KeyInfo | undefined {
  return KEY_MAP[key.toLowerCase()];
}

export function getFinger(key: string): Finger | undefined {
  return KEY_MAP[key.toLowerCase()]?.finger;
}

export function getHand(key: string): Hand | undefined {
  return KEY_MAP[key.toLowerCase()]?.hand;
}

export function getRow(key: string): Row | undefined {
  return KEY_MAP[key.toLowerCase()]?.row;
}

// All keys on the keyboard for heatmap rendering
export const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
];

export { KEY_MAP };
