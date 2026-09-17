import TextField from '@code-dot-org/component-library/textField';

import {copy} from './copy';

/**
 * One dictionary row: the symbol this entry will hand out, and a plain-text
 * field for the pattern it stands for. The symbol chip is `aria-hidden` (a
 * private-use dingbat glyph has no meaning a screen reader could usefully
 * read) but its *identity* — "Symbol N" — is wired to the field via
 * `aria-describedby`, and the same "Symbol N" wording labels this entry's
 * occurrences in the compressed text, so the two sides of the mapping share
 * a name in the accessibility tree instead of only lining up visually.
 */
export default function DictionaryEntryRow({
  entryNumber,
  symbol,
  value,
  invalid,
  removable,
  onChange,
  onRemove,
}: {
  entryNumber: number;
  symbol: string;
  value: string;
  invalid: boolean;
  removable: boolean;
  onChange: (value: string) => void;
  onRemove: () => void;
}) {
  const symbolChipId = `tc-symbol-chip-${entryNumber}`;

  return (
    <li className="tcEntryRow">
      <span id={symbolChipId} className="tcSymbolChip" aria-label={copy.dictionary.symbolLabel(entryNumber)}>
        <span aria-hidden="true">{symbol}</span>
      </span>
      <TextField
        name={`tc-pattern-${entryNumber}`}
        label={copy.dictionary.patternLabel(entryNumber)}
        value={value}
        // A typed or pasted space becomes an underscore, matching how the text
        // itself represents spaces — otherwise a pattern could never match one.
        onChange={e => onChange(e.target.value.replace(/ /g, '_'))}
        errorMessage={invalid ? copy.dictionary.patternError : undefined}
        aria-describedby={symbolChipId}
        className="tcPatternField"
      />
      {removable && (
        <button
          type="button"
          className="tcRemoveButton"
          aria-label={copy.dictionary.removeLabel(entryNumber)}
          onClick={onRemove}
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </li>
  );
}
