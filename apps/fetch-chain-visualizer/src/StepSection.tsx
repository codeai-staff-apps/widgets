import Alert from '@code-dot-org/component-library/alert';
import Button from '@code-dot-org/component-library/button';
import Typography from '@code-dot-org/component-library/typography';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import classNames from 'classnames';
import {useEffect, useId, useState} from 'react';

import {highlight, inlineCode} from './markup';
import MockWeatherCard from './MockWeatherCard';
import {CodeBlock} from './shared';
import {REVEAL_DELAY_MS, verdictLabel, type Step} from './steps';

export default function StepSection({
  step,
  done,
  enabled,
  onRun,
}: {
  step: Step;
  done: boolean;
  enabled: boolean;
  onRun: () => void;
}) {
  const headingId = useId();
  const hintId = useId();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!done) {
      setRevealed(false);
      return;
    }
    const id = window.setTimeout(() => setRevealed(true), REVEAL_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [done]);

  return (
    <section aria-labelledby={headingId}>
      <Stack direction="row" gap={1.25} alignItems="center" sx={{mb: 1.25}}>
        <Avatar
          aria-hidden="true"
          sx={{
            width: 26,
            height: 26,
            bgcolor: 'primary.main',
            fontFamily: 'var(--font-family-heading)',
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {step.number}
        </Avatar>
        <Typography semanticTag="h2" visualAppearance="heading-md" id={headingId} noMargin>
          {step.heading}
        </Typography>
      </Stack>
      <Stack gap={2}>
        <CodeBlock tone="code" summary={step.codeSummary}>
          {highlight(step.code)}
        </CodeBlock>
        <div>
          <Button
            text={step.buttonLabel}
            disabled={!enabled}
            onClick={onRun}
            iconLeft={{iconName: 'play', iconStyle: 'solid'}}
            aria-describedby={!enabled && !done ? hintId : undefined}
          />
        </div>
        <Card variant="outlined" sx={{borderColor: done ? 'primary.main' : undefined}}>
          <CardContent component={Stack} gap={1}>
            <Typography semanticTag="p" visualAppearance="overline-three" noMargin>
              {step.resultLabel}
            </Typography>
            {done ? (
              <CodeBlock tone="result" summary={step.resultLabel} revealed={revealed}>
                {highlight(step.result)}
              </CodeBlock>
            ) : (
              <Typography semanticTag="p" visualAppearance="body-three" noMargin id={hintId}>
                <em style={{color: 'var(--text-neutral-secondary)'}}>{step.initialHint}</em>
              </Typography>
            )}
          </CardContent>
        </Card>
        {done && step.number === 3 && <MockWeatherCard />}
        {done && (
          <Alert
            type="info"
            // Already announced once via useAnnounce(); a second live region
            // would narrate the same click twice, in different words.
            role="note"
            showIcon={false}
            className={classNames('verdict', {visible: revealed})}
            text={
              <>
                <strong>{verdictLabel}: </strong>
                {inlineCode(step.verdictBody)}
              </>
            }
          />
        )}
      </Stack>
    </section>
  );
}
