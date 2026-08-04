import Alert from '@code-dot-org/component-library/alert';
import Typography from '@code-dot-org/component-library/typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import {useEffect, useRef, useState} from 'react';

import {rich} from './markup';
import {
  choices,
  choicesScreen,
  NEXT_BUTTON_DELAY_MS,
  REACTION_DELAY_MS,
  student,
  type Choice,
  type OutcomeType,
} from './scenario';
import {useAnnounce} from './shared';

/**
 * The original painted `miss` in the same amber as `ok`, so "this reinforces
 * the misconception" looked identical to "this is fine but not ideal".
 */
const ALERT_TYPE: Record<OutcomeType, 'success' | 'warning' | 'danger'> = {
  best: 'success',
  ok: 'warning',
  miss: 'danger',
};

export default function ChoicesScreen({onNext}: {onNext: () => void}) {
  const announce = useAnnounce();
  const [picked, setPicked] = useState<Choice | null>(null);
  const [showReaction, setShowReaction] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const nextButton = useRef<HTMLButtonElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  useEffect(() => {
    if (showNext) {
      nextButton.current?.focus();
    }
  }, [showNext]);

  // The feedback banner is a visible role="alert", so it is the announcement
  // for the pick itself; only the late-arriving reaction needs announcing.
  const pick = (choice: Choice) => {
    setPicked(choice);
    timers.current.push(
      window.setTimeout(() => {
        setShowReaction(true);
        announce(`${choicesScreen.reactionSectionLabel}: ${choice.outcome.reaction}`);
      }, REACTION_DELAY_MS),
      window.setTimeout(() => setShowNext(true), NEXT_BUTTON_DELAY_MS),
    );
  };

  return (
    <Stack gap={2}>
      <Card variant="outlined">
        <CardContent>
          <Typography semanticTag="p" visualAppearance="overline-three" noMargin>
            {choicesScreen.repeatedPromptLabel}
          </Typography>
          <blockquote style={{margin: 0}}>
            <Typography semanticTag="p" visualAppearance="body-two" noMargin>
              {student.quote}
            </Typography>
          </blockquote>
        </CardContent>
      </Card>

      {choices.map(choice => {
        const isPicked = picked?.key === choice.key;
        return (
          <Button
            key={choice.key}
            fullWidth
            // aria-disabled rather than disabled: a locked-out choice must stay
            // readable and reachable, and keep the colour that reports how it went.
            aria-disabled={picked !== null}
            // Filled marks the choice you made; how well it went is carried by
            // the feedback alert, the one place the theme colours severity.
            variant={isPicked ? 'contained' : 'outlined'}
            onClick={() => picked === null && pick(choice)}
            sx={{justifyContent: 'flex-start', textAlign: 'left', textTransform: 'none'}}
          >
            <Stack direction="row" gap={1.5} alignItems="flex-start">
              <strong>{choice.letter}</strong>
              <span>{choice.text}</span>
            </Stack>
          </Button>
        );
      })}

      {picked && (
        <Alert
          type={ALERT_TYPE[picked.outcome.type]}
          showIcon={false}
          text={
            <>
              <strong>{picked.outcome.label}. </strong>
              {rich(picked.outcome.body)}
            </>
          }
        />
      )}

      {picked && showReaction && (
        <Card variant="outlined">
          <CardContent component={Stack} direction="row" gap={2} alignItems="flex-start">
            <span aria-hidden="true" style={{fontSize: '1.75rem'}}>
              {student.avatar}
            </span>
            <div>
              <Typography semanticTag="p" visualAppearance="overline-three" noMargin>
                {choicesScreen.reactionSectionLabel}
              </Typography>
              <blockquote style={{margin: 0}}>
                <Typography semanticTag="p" visualAppearance="body-two" noMargin>
                  {picked.outcome.reaction}
                </Typography>
              </blockquote>
            </div>
          </CardContent>
        </Card>
      )}

      {showNext && (
        <div>
          <Button ref={nextButton} variant="contained" onClick={onNext}>
            {choicesScreen.nextButtonLabel}
          </Button>
        </div>
      )}
    </Stack>
  );
}
