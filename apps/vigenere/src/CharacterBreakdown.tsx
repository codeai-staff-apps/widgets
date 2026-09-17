import Typography from '@code-dot-org/component-library/typography';

import type {CipherMode, CipherStep} from './cipher';
import {copy} from './copy';

/**
 * States, in plain text, exactly what the table and letter tracks otherwise
 * only show by color and position: which keyword letter produced which
 * shift for which letter. This is the one place that relationship is
 * guaranteed available without relying on visual adjacency or color.
 */
export default function CharacterBreakdown({
  mode,
  steps,
  revealed,
}: {
  mode: CipherMode;
  steps: CipherStep[];
  revealed: number;
}) {
  const visible = steps.slice(0, revealed);

  return (
    <div className="vigBreakdown">
      <Typography semanticTag="h2" visualAppearance="heading-xs">
        {copy.breakdown.heading}
      </Typography>
      {visible.length === 0 ? (
        <Typography semanticTag="p" visualAppearance="body-three" className="vigHelp">
          {copy.breakdown.empty}
        </Typography>
      ) : (
        <dl className="vigBreakdownList">
          {visible.map((step, i) => {
            const knownChar = mode === 'encrypt' ? step.plainChar : step.cipherChar;
            const resultChar = mode === 'encrypt' ? step.cipherChar : step.plainChar;
            return (
              <div
                key={step.index}
                className="vigBreakdownItem"
                data-current={i === visible.length - 1 || undefined}
              >
                <dt>{copy.breakdown.term(step.index + 1, knownChar, step.keyChar)}</dt>
                <dd>{copy.breakdown.definition(step.shift, resultChar)}</dd>
              </div>
            );
          })}
        </dl>
      )}
    </div>
  );
}
