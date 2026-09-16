import {LANGUAGE} from './language';

/** Cipher-letter -> guessed plaintext-letter, for every guess the learner has locked in. */
export type Assignments = Readonly<Record<string, string>>;

/** How often each letter of `LANGUAGE.letters` appears in `message`, as a fraction of its letter count. */
export function messageFrequencies(message: string): Record<string, number> {
  const counts: Record<string, number> = {};
  LANGUAGE.letters.forEach(letter => (counts[letter] = 0));

  let total = 0;
  for (const char of message.toUpperCase()) {
    if (char in counts) {
      counts[char]++;
      total++;
    }
  }

  const frequencies: Record<string, number> = {};
  LANGUAGE.letters.forEach(letter => (frequencies[letter] = total === 0 ? 0 : counts[letter] / total));
  return frequencies;
}

/** `LANGUAGE.letters` sorted A-to-Z. */
export function alphabeticOrder(): string[] {
  return [...LANGUAGE.letters];
}

/** `LANGUAGE.letters` sorted by descending frequency (ties broken alphabetically). */
export function byFrequencyOrder(frequencies: Readonly<Record<string, number>>): string[] {
  return [...LANGUAGE.letters].sort((a, b) => {
    const delta = (frequencies[b] ?? 0) - (frequencies[a] ?? 0);
    return delta !== 0 ? delta : a.localeCompare(b);
  });
}

/** `LANGUAGE.letters` in a random order (Fisher-Yates). */
export function shuffledOrder(): string[] {
  const order = [...LANGUAGE.letters];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/**
 * The full 26-letter assignment implied by shifting the alphabet by
 * `shift` positions (a Caesar cipher). `shift` may be any integer; it is
 * normalized into 0-25.
 */
export function caesarAssignments(shift: number): Assignments {
  const {letters} = LANGUAGE;
  const n = letters.length;
  const normalized = ((shift % n) + n) % n;
  const assignments: Record<string, string> = {};
  letters.forEach((letter, i) => {
    assignments[letter] = letters[(i + n - normalized) % n];
  });
  return assignments;
}

/**
 * Assigns `guess` to `targetCipherLetter`. If `guess` was already assigned
 * elsewhere, that slot is freed; if `targetCipherLetter` already held a
 * different guess, that guess swaps into the freed slot (or, if `guess`
 * came from the bank rather than another slot, returns to the bank).
 */
export function place(assignments: Assignments, guess: string, targetCipherLetter: string): Assignments {
  const next: Record<string, string> = {...assignments};
  const sourceCipherLetter = Object.keys(next).find(letter => next[letter] === guess);
  const displaced = next[targetCipherLetter];

  if (sourceCipherLetter && sourceCipherLetter !== targetCipherLetter) {
    delete next[sourceCipherLetter];
  }

  if (displaced && displaced !== guess) {
    if (sourceCipherLetter) {
      next[sourceCipherLetter] = displaced;
    }
    // else: `displaced` simply returns to the bank (it is no longer a value in `next`).
  }

  next[targetCipherLetter] = guess;
  return next;
}

/** Returns `guess` to the bank, wherever it currently sits. */
export function unassign(assignments: Assignments, guess: string): Assignments {
  const next: Record<string, string> = {...assignments};
  const cipherLetter = Object.keys(next).find(letter => next[letter] === guess);
  if (cipherLetter) {
    delete next[cipherLetter];
  }
  return next;
}

/**
 * Fills every unassigned cipher letter with the next unused bank letter, in
 * `bankOrder`, working through `columns` in the board's current display
 * order (so "Assign remaining" fills left-to-right as shown, not A-to-Z).
 */
export function assignRemaining(
  assignments: Assignments,
  bankOrder: readonly string[],
  columns: readonly string[],
): Assignments {
  const next: Record<string, string> = {...assignments};
  const used = new Set(Object.values(next));
  const available = bankOrder.filter(letter => !used.has(letter));

  let i = 0;
  for (const cipherLetter of columns) {
    if (!(cipherLetter in next) && i < available.length) {
      next[cipherLetter] = available[i++];
    }
  }
  return next;
}

export interface DecodedChar {
  /** The original character, case and all, including punctuation/whitespace. */
  original: string;
  /** What to display: the guessed plaintext letter if locked, else `original`. */
  display: string;
  /** Whether this character has a guess locked in. */
  locked: boolean;
  /** Whether this character is one of the 26 cipherable letters at all. */
  isLetter: boolean;
}

/** Applies `assignments` to `message`, preserving case and non-letter characters untouched. */
export function decodeMessage(message: string, assignments: Assignments): DecodedChar[] {
  return message.split('').map(original => {
    const upper = original.toUpperCase();
    const isLetter = (LANGUAGE.letters as readonly string[]).includes(upper);
    if (!isLetter) {
      return {original, display: original, locked: false, isLetter};
    }
    const guess = assignments[upper];
    if (!guess) {
      return {original, display: original, locked: false, isLetter};
    }
    const display = original === upper ? guess : guess.toLowerCase();
    return {original, display, locked: true, isLetter};
  });
}
