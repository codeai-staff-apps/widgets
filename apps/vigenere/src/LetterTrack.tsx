import Typography from '@code-dot-org/component-library/typography';

import {copy} from './copy';

/**
 * One line of the "Result" panel: a label plus the letters themselves, with
 * the letter at `activeIndex` (if any) wrapped in a real `<mark>` so the
 * current step reads as highlighted content, not just colored pixels — the
 * text itself is always present, so a screen reader gets the full line
 * regardless of which letter (if any) is marked.
 */
export default function LetterTrack({
  label,
  text,
  activeIndex,
  role,
}: {
  label: string;
  text: string;
  activeIndex: number | null;
  role: 'key' | 'source' | 'result';
}) {
  return (
    <div className="vigTrack" data-role={role}>
      <Typography semanticTag="span" visualAppearance="body-three" className="vigTrackLabel">
        {label}
      </Typography>
      <p className="vigTrackText">
        {text.length === 0 ? (
          copy.result.empty
        ) : activeIndex === null ? (
          text
        ) : (
          <>
            {text.slice(0, activeIndex)}
            <mark>{text[activeIndex]}</mark>
            {text.slice(activeIndex + 1)}
          </>
        )}
      </p>
    </div>
  );
}
