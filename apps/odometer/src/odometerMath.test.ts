import {describe, expect, it} from 'vitest';

import {readOdometer} from './odometerMath';

describe('readOdometer digit.changing', () => {
  it('marks only the trailing digit as changing when a tick does not carry', () => {
    // 5 -> 6 in decimal: every digit but the last stays put.
    const {digits} = readOdometer(5, 10);
    digits.slice(0, -1).forEach(d => expect(d.changing).toBe(false));
    expect(digits.at(-1)).toMatchObject({current: '5', next: '6', changing: true});
  });

  it('marks every digit a carry actually touches, and no others', () => {
    // 9 -> 10 in decimal: the ones and tens digits change, nothing above them does.
    const {digits} = readOdometer(9, 10);
    expect(digits.slice(0, -2).every(d => !d.changing)).toBe(true);
    expect(digits.at(-2)).toMatchObject({current: '0', next: '1', changing: true});
    expect(digits.at(-1)).toMatchObject({current: '9', next: '0', changing: true});
  });

  it('never marks a digit changing when current and next are equal', () => {
    // Binary, no carry: only the ones wheel moves.
    const {digits} = readOdometer(4, 2); // 100 -> 101
    for (const d of digits) {
      expect(d.changing).toBe(d.current !== d.next);
    }
    expect(digits.at(-1)!.changing).toBe(true);
    expect(digits.at(-2)!.changing).toBe(false);
  });
});
