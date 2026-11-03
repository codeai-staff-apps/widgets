import type {Checks} from './types';

/** `2026-11-03T07:34:43Z` -> `2026-11-03 07:34:43 UTC`. */
export const formatTime = (iso: string) => iso.replace('T', ' ').replace(/(\.\d+)?Z$/, ' UTC');

export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Azure categories that scored above zero, e.g. `Violence 2`. */
export const flaggedCategories = (checks: Checks) =>
  checks.azure.categories.filter(c => c.severity > 0).map(c => `${c.category} ${c.severity}`);

/** One line of moderation results, e.g. `Judge: flagged. Azure: safe.` */
export function summarizeChecks(checks?: Checks) {
  if (!checks) {
    return '';
  }
  const flagged = flaggedCategories(checks);
  return `Judge: ${checks.judge.verdict}. Azure: ${checks.azure.verdict}${
    flagged.length ? ` (${flagged.join(', ')})` : ''
  }.`;
}

/** `plural(1, 'filling')` -> `1 filling`; `plural(2, 'filling')` -> `2 fillings`. */
export const plural = (n: number, noun: string) => `${n} ${noun}${n === 1 ? '' : 's'}`;
