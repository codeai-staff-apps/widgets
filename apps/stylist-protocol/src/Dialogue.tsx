import Typography from '@code-dot-org/component-library/typography';
import type {ReactNode} from 'react';

/**
 * One line of character dialogue. The speaker's name is visible text rather
 * than the original's `aria-hidden` label, so a screen-reader user also
 * knows who is talking. `variant` recovers the original's two-tone bubbles
 * (fill, corner radius, and name colour all differ) — nearly every step
 * alternates the two voices, so telling them apart at a glance matters.
 */
export default function Dialogue({
  speaker,
  variant,
  children,
}: {
  speaker: string;
  variant: 'teacher' | 'student';
  children: ReactNode;
}) {
  return (
    <figure className={variant === 'teacher' ? 'dialogue teacher' : 'dialogue'}>
      <blockquote className="dialogueQuote">
        <Typography semanticTag="p" visualAppearance="body-two" noMargin>
          {children}
        </Typography>
      </blockquote>
      <figcaption className="dialogueSpeaker">{speaker}</figcaption>
    </figure>
  );
}
