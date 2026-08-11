import Alert from '@code-dot-org/component-library/alert';
import DsButton from '@code-dot-org/component-library/button';
import Typography from '@code-dot-org/component-library/typography';
import Avatar from '@mui/material/Avatar';
// MUI Button only for the choice list: see the comment on those buttons below.
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import {useEffect, useRef, useState} from 'react';

import {rich} from './markup';
import PromptBox from './PromptBox';
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

/** The letter disc's fill, recoloured by how the response actually went. */
const LETTER_COLORS: Record<OutcomeType, {bgcolor: string; color: string}> = {
  best: {bgcolor: '#34BD43', color: '#ffffff'},
  ok: {bgcolor: '#FFA868', color: '#510000'},
  miss: {bgcolor: '#FFA868', color: '#510000'},
};
const LETTER_DEFAULT = {bgcolor: '#E4E2F8', color: '#1F1976'};

export default function ChoicesScreen({onNext}: {onNext: () => void}) {
  const announce = useAnnounce();
  const [picked, setPicked] = useState<Choice | null>(null);
  const [showReaction, setShowReaction] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const nextButton = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
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
      <PromptBox label={choicesScreen.repeatedPromptLabel} text={student.quote} quote />

      <div role="group" aria-label="Response options">
        <Stack gap={1.25}>
          {choices.map(choice => {
            const isPicked = picked?.key === choice.key;
            const letterColors = isPicked ? LETTER_COLORS[choice.outcome.type] : LETTER_DEFAULT;
            return (
              // Stays MUI: the design system's Button takes a `text` string, so it
              // cannot host the letter/prose row, and it has no full-width or
              // text-align API for a block-shaped answer option.
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
                  <Avatar
                    aria-hidden="true"
                    sx={{
                      width: 24,
                      height: 24,
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-family-heading)',
                      fontWeight: 700,
                      ...letterColors,
                    }}
                  >
                    {choice.letter}
                  </Avatar>
                  <span>{choice.text}</span>
                </Stack>
              </Button>
            );
          })}
        </Stack>
      </div>

      {picked && (
        <Alert
          type={ALERT_TYPE[picked.outcome.type]}
          showIcon={false}
          text={
            <>
              <span aria-hidden="true" style={{fontSize: '1.1rem', marginRight: '6px'}}>
                {picked.outcome.icon}
              </span>
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
          <DsButton
            ref={nextButton}
            text={choicesScreen.nextButtonLabel}
            onClick={onNext}
          />
        </div>
      )}
    </Stack>
  );
}
