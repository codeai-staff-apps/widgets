export interface Method {
  id: string;
  label: string;
  /** Correct category. */
  zone: string;
  /** Shown when this method is sorted into the wrong category. */
  hint: string;
}

export const BANK_ID = 'bank';
export const PURE_ID = 'zone-pure';
export const SIDE_ID = 'zone-side';

export const ZONE_NAMES: Record<string, string> = {
  // Matches the tray's visible label, so the accessible name contains it.
  [BANK_ID]: 'Methods to sort',
  [PURE_ID]: 'Pure / non-mutating',
  [SIDE_ID]: 'Has side effects',
};

export const METHODS: Method[] = [
  {
    id: 'filter',
    label: '.filter()',
    zone: PURE_ID,
    hint: 'Returns a new array — the original is never touched.',
  },
  {
    id: 'map',
    label: '.map()',
    zone: PURE_ID,
    hint: 'Transforms each item into a brand new array — pure.',
  },
  {
    id: 'forEach',
    label: '.forEach()',
    zone: SIDE_ID,
    hint: 'No return value — any change inside it mutates the original.',
  },
  {
    id: 'forloop',
    label: 'for loop',
    zone: SIDE_ID,
    hint: 'Writes directly into the original array with opportunities[i] = ...',
  },
  {
    id: 'shift',
    label: '.shift()',
    zone: SIDE_ID,
    hint: 'Removes the first item from the original array in place.',
  },
];

export const ALL_CORRECT_HINT =
  'All correct! Pure functions return new data and leave the original alone. Side effects change something outside the function.';

export function scoreMessage(correct: number): string {
  const pct = (correct / METHODS.length) * 100;
  if (pct === 100) {
    return 'perfect — you know your methods!';
  }
  return pct >= 60 ? 'nice work — review the hints below' : 'keep going — the hints below will help';
}

/** Bank order is randomised so repeat plays cannot be solved from memory. */
export function shuffled<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
