import Typography from '@code-dot-org/component-library/typography';
import type {ReactNode} from 'react';

/**
 * One line of character dialogue. The speaker's name is visible text rather
 * than the original's `aria-hidden` label, so a screen-reader user also knows
 * who is talking.
 */
export default function Dialogue({speaker, children}: {speaker: string; children: ReactNode}) {
  return (
    <figure className="dialogue">
      <blockquote className="dialogueQuote">
        <Typography semanticTag="p" visualAppearance="body-two" noMargin>
          {children}
        </Typography>
      </blockquote>
      <figcaption className="dialogueSpeaker">{speaker}</figcaption>
    </figure>
  );
}
