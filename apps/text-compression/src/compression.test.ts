import {describe, expect, it} from 'vitest';

import {computeCompression} from './compression';
import {SYMBOLS} from './symbols';

describe('computeCompression', () => {
  it('replaces every case-insensitive occurrence of a pattern with its symbol', () => {
    const result = computeCompression('the_cat_sat_on_the_mat', ['the']);
    expect(result.segments).toEqual([
      {text: SYMBOLS[0], entryIndex: 0, pattern: 'the'},
      {text: '_cat_sat_on_'},
      {text: SYMBOLS[0], entryIndex: 0, pattern: 'the'},
      {text: '_mat'},
    ]);
    // "the" -> 1-char symbol, twice: 22 chars - 2*(3-1) = 18.
    expect(result.compressedSize).toBe(18);
  });

  it('applies entries in order, each seeing the previous entries\' substitutions', () => {
    const result = computeCompression('aaaa', ['aa', 'a']);
    // First pass: "aa" -> symbol 0, twice -> two symbol-0 characters.
    // Second pass looks for literal "a", which no longer appears.
    expect(result.compressedSize).toBe(2);
  });

  it('reports no compression benefit as a non-positive percentage, not an error', () => {
    // A one-off pattern costs more to store in the dictionary than it saves.
    const result = computeCompression('abcabc', ['abc']);
    expect(result.compressionPercent).not.toBeNull();
    expect(result.compressionPercent!).toBeLessThanOrEqual(0);
  });

  it('flags a pattern that contains its own (or a later) reserved symbol character', () => {
    const result = computeCompression('hello_world', [`x${SYMBOLS[1]}y`, 'world']);
    expect(result.invalidEntryIndexes.has(0)).toBe(true);
    expect(result.compressionPercent).toBeNull();
    // The invalid entry contributes no substitution, but entry 1 still works.
    expect(result.segments.some(s => s.entryIndex === 1)).toBe(true);
  });

  it('does not flag a rule containing an earlier entry\'s symbol (ported quirk)', () => {
    const result = computeCompression('z', [SYMBOLS[0], `a${SYMBOLS[0]}b`]);
    expect(result.invalidEntryIndexes.has(1)).toBe(false);
  });

  it('ignores trailing empty entries when sizing the dictionary', () => {
    const withTrailingBlanks = computeCompression('abcabc', ['abc', '', '']);
    const withoutBlanks = computeCompression('abcabc', ['abc']);
    expect(withTrailingBlanks.dictionarySize).toBe(withoutBlanks.dictionarySize);
  });

  it('reports zero dictionary size and null percent for empty text with no patterns', () => {
    const result = computeCompression('', ['']);
    expect(result.dictionarySize).toBe(0);
    expect(result.compressionPercent).toBeNull();
  });
});
