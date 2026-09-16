import {describe, expect, it} from 'vitest';

import {dropIndexForY, reorderIds} from './useRowOrder';

describe('reorderIds', () => {
  it('moves an item forward to the requested index, shifting the ones between it', () => {
    expect(reorderIds(['a', 'b', 'c', 'd', 'e'], 'b', 3)).toEqual(['a', 'c', 'd', 'b', 'e']);
  });

  it('moves an item backward to the requested index, shifting the ones between it', () => {
    expect(reorderIds(['a', 'b', 'c', 'd', 'e'], 'e', 1)).toEqual(['a', 'e', 'b', 'c', 'd']);
  });

  it('clamps a below-range target to the first index instead of dropping the item', () => {
    expect(reorderIds(['a', 'b', 'c'], 'c', -5)).toEqual(['c', 'a', 'b']);
  });

  it('clamps an above-range target to the last index instead of dropping the item', () => {
    expect(reorderIds(['a', 'b', 'c'], 'a', 99)).toEqual(['b', 'c', 'a']);
  });

  it('never mutates the input array', () => {
    const ids = ['a', 'b', 'c'];
    reorderIds(ids, 'a', 2);
    expect(ids).toEqual(['a', 'b', 'c']);
  });
});

describe('dropIndexForY', () => {
  // Three rows with midpoints at y = 10, 20, 30.
  const midpoints = [10, 20, 30];

  it('picks the first row whose midpoint is below the pointer', () => {
    expect(dropIndexForY(5, midpoints)).toBe(0);
    expect(dropIndexForY(15, midpoints)).toBe(1);
    expect(dropIndexForY(25, midpoints)).toBe(2);
  });

  it('falls back to the last row when the pointer is below every midpoint', () => {
    expect(dropIndexForY(1000, midpoints)).toBe(2);
  });

  it('lands on a row when the pointer sits exactly on that row\'s own midpoint', () => {
    // Regression: a strict `<` here rolled a pointer sitting exactly on a
    // row's midpoint over to the *next* row, overshooting every drop by one
    // row (reported as drag-and-drop overshoot).
    expect(dropIndexForY(20, midpoints)).toBe(1);
  });

  it('reads live midpoints directly, so one big jump lands on the row under the pointer without overshooting', () => {
    // A fast drag straight from the top row to the bottom one in a single
    // pointermove must land on the last row, not skip past it.
    expect(dropIndexForY(29, [10, 20, 30, 40, 50])).toBe(2);
  });
});
