import Typography from '@code-dot-org/component-library/typography';
import {useEffect, useRef} from 'react';

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

  // The list scrolls internally (max-height), so the current (last) entry
  // can end up below the fold — invisible to sighted users tracking
  // playback — once a message runs longer than the visible list. Keep it in
  // view on every step. `smooth` doubles as the one place this component
  // animates, so it's gated on prefers-reduced-motion like any other motion.
  const currentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!currentRef.current) {
      return;
    }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    currentRef.current.scrollIntoView({
      block: 'nearest',
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }, [revealed]);

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
            const isCurrent = i === visible.length - 1;
            return (
              <div
                key={step.index}
                ref={isCurrent ? currentRef : undefined}
                className="vigBreakdownItem"
                data-current={isCurrent || undefined}
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
