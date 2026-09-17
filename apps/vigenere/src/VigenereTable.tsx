import {useMemo} from 'react';

import type {CipherMode, CipherStep} from './cipher';
import {ALPHABET, squareLetter} from './cipher';
import {copy} from './copy';

const LETTERS = ALPHABET.split('');

/**
 * The static 27x27 Vigenère square, highlighting the current step's lookup:
 * row = keyword letter, column = plaintext letter, the intersecting cell =
 * ciphertext letter. Which of {column, cell} is the "known" value the person
 * typed and which is the "solved for" value swaps with `mode` — see
 * `cipher.ts` — so their highlight colors swap too, while the row (the
 * keyword letter) stays the same role either way.
 *
 * This table is purely a supplementary visualization: every fact it shows
 * (the step's plaintext/keyword/shift/ciphertext letters) is also stated as
 * text in the letter-by-letter list, so screen reader users lose nothing by
 * this being `aria-hidden` — and gain not having to page through 729 cells.
 */
export default function VigenereTable({mode, step}: {mode: CipherMode; step: CipherStep | null}) {
  const rows = useMemo(
    () => LETTERS.map((_, row) => LETTERS.map((_, col) => squareLetter(row, col))),
    [],
  );

  const knownRole = mode === 'encrypt' ? 'source' : 'result';
  const solvedRole = mode === 'encrypt' ? 'result' : 'source';

  return (
    <figure className="vigTableFigure">
      <figcaption>
        <p className="vigTableHeading">{copy.table.heading}</p>
        <p className="vigTableDescription">{copy.table.description}</p>
      </figcaption>
      <table className="vigTable" aria-hidden="true">
        <tbody>
          <tr>
            <th scope="col" />
            {LETTERS.map((letter, col) => (
              <th
                key={letter}
                scope="col"
                data-role={step && col === step.col ? knownRole : undefined}
              >
                {letter}
              </th>
            ))}
          </tr>
          {rows.map((cells, row) => (
            <tr key={LETTERS[row]}>
              <th scope="row" data-role={step && row === step.row ? 'key' : undefined}>
                {LETTERS[row]}
              </th>
              {cells.map((letter, col) => {
                const isCell = step && row === step.row && col === step.col;
                const isTrail =
                  step &&
                  !isCell &&
                  ((row === step.row && col < step.col) || (col === step.col && row < step.row));
                return (
                  <td
                    key={col}
                    data-role={isCell ? solvedRole : undefined}
                    data-trail={isTrail || undefined}
                  >
                    {letter}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
