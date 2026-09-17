/**
 * The dictionary's "symbols": short stand-ins a pattern gets replaced by.
 * Ported from the legacy widget's exact codepoint range and substitution
 * table, so the same 112 dingbats appear in the same order.
 */

/** First and one-past-last codepoint of the Miscellaneous Symbols block this widget draws from. */
export const FIRST_SYMBOL = 0x2600;
export const LAST_SYMBOL = 0x3000;

/** How many dictionary entries (patterns) the widget supports at once. */
export const MAX_DICT_ENTRIES = 112;

/**
 * A few codepoints in [FIRST_SYMBOL, FIRST_SYMBOL + MAX_DICT_ENTRIES) render
 * as missing-glyph boxes on common fonts, so the legacy widget swaps each for
 * a well-supported dingbat elsewhere in the block. Re-sorting afterward keeps
 * the whole set in ascending codepoint order despite the swap.
 */
const MISSING_SYMBOL_SUBSTITUTES: Record<number, number> = {
  0x2601: 0x271a,
  0x2614: 0x2702,
  0x2615: 0x2706,
  0x2618: 0x2708,
  0x2619: 0x2709,
  0x2626: 0x270c,
  0x2627: 0x270e,
  0x2628: 0x2714,
  0x2629: 0x2718,
  0x262a: 0x2747,
  0x262b: 0x2749,
  0x262c: 0x2756,
  0x262d: 0x2761,
};

/** One symbol per dictionary entry, indexed the same as the entry list (`SYMBOLS[0]` is entry 1's symbol). */
export const SYMBOLS: readonly string[] = (() => {
  const chars: string[] = [];
  for (let codePoint = FIRST_SYMBOL; codePoint < FIRST_SYMBOL + MAX_DICT_ENTRIES; codePoint++) {
    chars.push(String.fromCharCode(MISSING_SYMBOL_SUBSTITUTES[codePoint] ?? codePoint));
  }
  return chars.sort();
})();

/** True for any character this widget could hand out as a dictionary symbol. */
export function isSymbolChar(char: string): boolean {
  const codePoint = char.codePointAt(0) ?? 0;
  return codePoint >= FIRST_SYMBOL && codePoint <= LAST_SYMBOL;
}

/** From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions */
export function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const reservedRangeByIndex = new Map<number, RegExp>();

/**
 * True when `rule` (the text typed for dictionary entry `index`) itself
 * contains a symbol character at or above this entry's own symbol —
 * i.e. it accidentally includes a reserved character rather than plain text.
 * Ported as-is from the legacy widget's validation, including its asymmetry:
 * a rule may contain a *lower*-indexed entry's symbol without being flagged.
 */
export function isReservedRuleFor(rule: string, index: number): boolean {
  if (index >= SYMBOLS.length) {
    return true;
  }
  let range = reservedRangeByIndex.get(index);
  if (!range) {
    range = new RegExp(`[${SYMBOLS[index]}-\\u${LAST_SYMBOL.toString(16)}]`);
    reservedRangeByIndex.set(index, range);
  }
  return range.test(rule);
}
