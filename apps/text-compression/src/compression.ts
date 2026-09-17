/**
 * Pure dictionary-compression logic. No React, no DOM — the same algorithm as
 * the legacy widget: each dictionary entry is a literal pattern, matched
 * case-insensitively and replaced by its symbol, entries applied in order.
 */
import {escapeRegExp, isReservedRuleFor, MAX_DICT_ENTRIES, SYMBOLS, isSymbolChar} from './symbols';

/** One run of the compressed text: either plain text, or a symbol standing in for `pattern`. */
export interface Segment {
  text: string;
  /** Set only for a symbol run — the 0-based dictionary entry it came from. */
  entryIndex?: number;
  /** Set only for a symbol run — the pattern text that symbol replaced. */
  pattern?: string;
}

export interface CompressionResult {
  segments: Segment[];
  compressedSize: number;
  dictionarySize: number;
  totalSize: number;
  originalSize: number;
  /** Percentage points saved (positive), or added (negative). `null` when there's a dictionary error or no text to measure. */
  compressionPercent: number | null;
  /** Entry indexes whose pattern text is invalid (contains a reserved symbol character). */
  invalidEntryIndexes: ReadonlySet<number>;
}

/** Drops trailing empty entries, so unused rows at the end of the list don't count toward dictionary size. */
function withoutTrailingEmpty(entries: readonly string[]): readonly string[] {
  let end = entries.length;
  while (end > 0 && entries[end - 1] === '') {
    end--;
  }
  return entries.slice(0, end);
}

function toSegments(text: string, symbolSource: Map<string, {entryIndex: number; pattern: string}>): Segment[] {
  const segments: Segment[] = [];
  let plain = '';
  for (const char of text) {
    const source = symbolSource.get(char);
    if (source && isSymbolChar(char)) {
      if (plain) {
        segments.push({text: plain});
        plain = '';
      }
      segments.push({text: char, entryIndex: source.entryIndex, pattern: source.pattern});
    } else {
      plain += char;
    }
  }
  if (plain) {
    segments.push({text: plain});
  }
  return segments;
}

export function computeCompression(originalText: string, entries: readonly string[]): CompressionResult {
  const rules = entries.slice(0, MAX_DICT_ENTRIES);
  const invalidEntryIndexes = new Set<number>();

  const validRules = rules.map((rule, index) => {
    if (rule !== '' && isReservedRuleFor(rule, index)) {
      invalidEntryIndexes.add(index);
      return '';
    }
    return rule;
  });

  let compressed = originalText;
  const symbolSource = new Map<string, {entryIndex: number; pattern: string}>();
  validRules.forEach((rule, entryIndex) => {
    if (rule === '') {
      return;
    }
    symbolSource.set(SYMBOLS[entryIndex], {entryIndex, pattern: rule});
    compressed = compressed.replace(new RegExp(escapeRegExp(rule), 'gi'), SYMBOLS[entryIndex]);
  });

  const segments = toSegments(compressed, symbolSource);

  const dictText = withoutTrailingEmpty(rules).join('\n');
  const dictionarySize = dictText.length === 0 ? 0 : dictText.length + 1;
  const compressedSize = compressed.length;
  const totalSize = dictionarySize + compressedSize;
  const originalSize = originalText.length;

  const compressionPercent =
    invalidEntryIndexes.size > 0 || originalSize === 0
      ? null
      : Math.round((1 - totalSize / originalSize) * 10000) / 100;

  return {
    segments,
    compressedSize,
    dictionarySize,
    totalSize,
    originalSize,
    compressionPercent,
    invalidEntryIndexes,
  };
}
