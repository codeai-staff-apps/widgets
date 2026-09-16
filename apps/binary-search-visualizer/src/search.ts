/**
 * Binary search's logic, kept separate from rendering. A search is fully
 * determined by its sorted list and target, so the whole trace of
 * comparisons can be computed up front — stepping forward/back then just
 * moves an index into that trace instead of re-running the algorithm.
 */

export type StepOutcome = 'left' | 'right' | 'found';

export interface CompareStep {
  /** Lowest index still in play when this comparison was made. */
  low: number;
  /** Highest index still in play when this comparison was made. */
  high: number;
  /** The index compared against the target. */
  mid: number;
  midValue: number;
  outcome: StepOutcome;
}

export interface SearchExample {
  /** Sorted, unique. */
  values: number[];
  target: number;
}

const MIN_LENGTH = 9;
const MAX_LENGTH = 13;
const MAX_VALUE = 99;

function randomInt(maxExclusive: number): number {
  return Math.floor(Math.random() * maxExclusive);
}

/** A fresh sorted list of unique values and a target to search for. */
export function generateExample(): SearchExample {
  const length = MIN_LENGTH + randomInt(MAX_LENGTH - MIN_LENGTH + 1);
  const pool = new Set<number>();
  while (pool.size < length) {
    pool.add(1 + randomInt(MAX_VALUE));
  }
  const values = [...pool].sort((a, b) => a - b);

  // Most searches look for a value that's really there; the rest practice
  // the "range shrinks to nothing" case.
  const targetIsPresent = randomInt(3) > 0;
  let target: number;
  if (targetIsPresent) {
    target = values[randomInt(values.length)];
  } else {
    do {
      target = 1 + randomInt(MAX_VALUE);
    } while (values.includes(target));
  }

  return {values, target};
}

/** Every comparison binary search makes, in order, ending at "found" or an empty range. */
export function computeSteps(values: number[], target: number): CompareStep[] {
  const steps: CompareStep[] = [];
  let low = 0;
  let high = values.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midValue = values[mid];
    if (midValue === target) {
      steps.push({low, high, mid, midValue, outcome: 'found'});
      break;
    }
    if (target < midValue) {
      steps.push({low, high, mid, midValue, outcome: 'left'});
      high = mid - 1;
    } else {
      steps.push({low, high, mid, midValue, outcome: 'right'});
      low = mid + 1;
    }
  }
  return steps;
}

/** The worked-out reasoning for a comparison, shown after the student predicts. */
export function explainStep(step: CompareStep, target: number): string {
  switch (step.outcome) {
    case 'found':
      return `${target} equals ${step.midValue} at index ${step.mid} — found it!`;
    case 'left':
      return `${target} is less than ${step.midValue} (index ${step.mid}), so the target must be in the left half. The right half is eliminated.`;
    case 'right':
      return `${target} is greater than ${step.midValue} (index ${step.mid}), so the target must be in the right half. The left half is eliminated.`;
  }
}
