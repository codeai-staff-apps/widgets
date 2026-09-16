import {describe, expect, it} from 'vitest';

import {computeReorder} from './useRowOrder';

describe('computeReorder', () => {
  const order = ['binary', 'octal', 'decimal', 'hexadecimal', 'custom'] as const;

  it('returns null when dropped back on itself — no reorder, no announcement', () => {
    expect(computeReorder(order, 'decimal', 'decimal')).toBeNull();
  });

  it('moves an item forward to the dropped-on row, shifting the ones between it', () => {
    const result = computeReorder(order, 'octal', 'hexadecimal');
    expect(result?.order).toEqual(['binary', 'decimal', 'hexadecimal', 'octal', 'custom']);
    expect(result?.position).toBe(4);
  });

  it('moves an item backward to the dropped-on row, shifting the ones between it', () => {
    const result = computeReorder(order, 'custom', 'octal');
    expect(result?.order).toEqual(['binary', 'custom', 'octal', 'decimal', 'hexadecimal']);
    expect(result?.position).toBe(2);
  });

  it('never mutates the input order', () => {
    const before = [...order];
    computeReorder(order, 'binary', 'custom');
    expect(order).toEqual(before);
  });
});
