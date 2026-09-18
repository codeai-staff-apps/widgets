/**
 * Vigenère cipher over a 27-letter alphabet: A-Z plus one extra symbol
 * standing in for the space, so a message keeps its word breaks through the
 * cipher instead of losing them. This is the legacy widget's own alphabet
 * choice (dashboard/public/vigenere/vigenere.js), not a general-purpose one.
 */
export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_';
const LETTERS = ALPHABET.split('');
const SIZE = LETTERS.length;

/** The letter this alphabet uses in place of a space. */
export const SPACE_LETTER = '_';

/**
 * Uppercases, folds spaces to `SPACE_LETTER`, and drops every other
 * character (digits, punctuation, accents) — matching the legacy widget's
 * `clean()` exactly. Non-letters are removed, not passed through: a message
 * typed with punctuation loses it before it ever reaches the cipher.
 */
export function cleanText(text: string): string {
  return text
    .toUpperCase()
    .replace(/ /g, SPACE_LETTER)
    .replace(/[^A-Z_]/g, '');
}

function indexOfLetter(letter: string): number {
  return LETTERS.indexOf(letter);
}

/** The cell at (row, col) of the Vigenère square: row and col are alphabet positions (0-26), wrapping. */
export function squareLetter(row: number, col: number): string {
  return LETTERS[(row + col) % SIZE];
}

export type CipherMode = 'encrypt' | 'decrypt';

export interface CipherStep {
  /** 0-based position in the message. */
  index: number;
  /** The keyword letter aligned with this position (the keyword repeats, so this loops). */
  keyChar: string;
  /** `keyChar`'s position within the keyword itself — where the repeat loops back to 0. */
  keyIndex: number;
  /** How far this keyword letter shifts the alphabet, 0-26 — keyChar's own alphabet position. */
  shift: number;
  /** The plaintext letter at this position (typed, for encrypt; solved-for, for decrypt). */
  plainChar: string;
  /** The ciphertext letter at this position (solved-for, for encrypt; typed, for decrypt). */
  cipherChar: string;
  /** This step's row in the Vigenère square: `keyChar`'s alphabet position. */
  row: number;
  /** This step's column in the Vigenère square: `plainChar`'s alphabet position (the square's columns are always the plaintext alphabet, regardless of cipher direction). */
  col: number;
}

/**
 * Walks `message` one letter at a time against the repeating `keyword`,
 * either direction. Both strings must already be cleaned (see `cleanText`);
 * an empty keyword can't shift anything, so it produces no steps.
 *
 * Encrypt: keyword letter (row) + plaintext letter (column) -> ciphertext
 * (the square's cell). Decrypt inverts that lookup — same row, but solves for
 * the column that makes the cell equal the known ciphertext letter — which
 * is exactly why a decrypt step's `col` still lands on the plaintext letter:
 * the Vigenère square's columns are always the plaintext alphabet.
 */
export function computeSteps(mode: CipherMode, message: string, keyword: string): CipherStep[] {
  if (keyword.length === 0) {
    return [];
  }
  const steps: CipherStep[] = [];
  for (let index = 0; index < message.length; index++) {
    const keyIndex = index % keyword.length;
    const keyChar = keyword[keyIndex];
    const row = indexOfLetter(keyChar);

    let plainChar: string;
    let cipherChar: string;
    if (mode === 'encrypt') {
      plainChar = message[index];
      cipherChar = squareLetter(row, indexOfLetter(plainChar));
    } else {
      cipherChar = message[index];
      const col = (indexOfLetter(cipherChar) - row + SIZE) % SIZE;
      plainChar = LETTERS[col];
    }

    steps.push({
      index,
      keyChar,
      keyIndex,
      shift: row,
      plainChar,
      cipherChar,
      row,
      col: indexOfLetter(plainChar),
    });
  }
  return steps;
}
