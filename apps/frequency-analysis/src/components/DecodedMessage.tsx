import Typography from '@code-dot-org/component-library/typography';

import type {DecodedChar} from '../cipher';
import {strings} from '../strings';

export interface DecodedMessageProps {
  decoded: DecodedChar[];
}

/** The message with every locked-in guess substituted, updating live as guesses change. */
export default function DecodedMessage({decoded}: DecodedMessageProps) {
  return (
    <div className="freq-output-wrapper">
      <Typography semanticTag="h2" visualAppearance="heading-sm">
        {strings.decodedMessageHeading}
      </Typography>
      <Typography semanticTag="p" visualAppearance="body-two" className="freq-output-hint">
        {strings.decodedMessageHint}
      </Typography>
      <div className="freq-output" data-notranslate lang="en">
        {decoded.map((entry, index) => (
          <span key={index} data-state={entry.isLetter ? (entry.locked ? 'locked' : 'unlocked') : undefined}>
            {entry.display}
          </span>
        ))}
      </div>
    </div>
  );
}
