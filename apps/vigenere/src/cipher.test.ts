import {describe, expect, it} from 'vitest';

import {cleanText, computeSteps, squareLetter} from './cipher';

describe('cleanText', () => {
  it('uppercases and folds spaces to the underscore letter', () => {
    expect(cleanText('Hello World')).toBe('HELLO_WORLD');
  });

  it('drops digits and punctuation rather than passing them through', () => {
    expect(cleanText("It's 1, 2, 3!")).toBe('ITS___');
  });
});

describe('squareLetter', () => {
  it('wraps past Z back to A (and on to the underscore)', () => {
    expect(squareLetter(25, 1)).toBe('_'); // Z + 1
    expect(squareLetter(26, 1)).toBe('A'); // _ + 1, wraps
  });
});

describe('computeSteps', () => {
  it('produces no steps for an empty keyword', () => {
    expect(computeSteps('encrypt', 'HELLO', '')).toEqual([]);
  });

  it('encrypts by adding the keyword letter’s shift to each plaintext letter', () => {
    // A(0) shifted by B(1) -> B; B(1) shifted by B(1) -> C.
    const steps = computeSteps('encrypt', 'AB', 'BB');
    expect(steps.map(s => s.cipherChar)).toEqual(['B', 'C']);
    expect(steps.map(s => s.shift)).toEqual([1, 1]);
  });

  it('loops a short keyword across a longer message', () => {
    const steps = computeSteps('encrypt', 'AAAA', 'AB');
    expect(steps.map(s => s.keyChar)).toEqual(['A', 'B', 'A', 'B']);
    expect(steps.map(s => s.keyIndex)).toEqual([0, 1, 0, 1]);
  });

  it('decrypts back to the original plaintext for any keyword', () => {
    const plaintext = 'THE_SECRET_MESSAGE_IS_HIDDEN';
    const keyword = 'KEY';
    const encrypted = computeSteps('encrypt', plaintext, keyword)
      .map(s => s.cipherChar)
      .join('');
    const decrypted = computeSteps('decrypt', encrypted, keyword)
      .map(s => s.plainChar)
      .join('');
    expect(decrypted).toBe(plaintext);
  });

  it('keeps a decrypt step’s column on the plaintext letter, matching encrypt', () => {
    const keyword = 'KEY';
    const plaintext = 'HELLO';
    const encryptSteps = computeSteps('encrypt', plaintext, keyword);
    const ciphertext = encryptSteps.map(s => s.cipherChar).join('');
    const decryptSteps = computeSteps('decrypt', ciphertext, keyword);
    encryptSteps.forEach((step, i) => {
      expect(decryptSteps[i].col).toBe(step.col);
      expect(decryptSteps[i].row).toBe(step.row);
    });
  });
});
