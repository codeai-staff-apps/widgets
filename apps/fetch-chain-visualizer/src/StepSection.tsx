import Alert from '@code-dot-org/component-library/alert';
import Typography from '@code-dot-org/component-library/typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import {useId} from 'react';

import {inlineCode} from './markup';
import MockWeatherCard from './MockWeatherCard';
import {CodeBlock} from './shared';
import {verdictLabel, type Step} from './steps';

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
  return (
    <section aria-labelledby={headingId}>
      <Typography semanticTag="h2" visualAppearance="heading-md" id={headingId}>
        {step.heading}
      </Typography>
      <Stack gap={2}>
        <CodeBlock summary={step.codeSummary}>{step.code}</CodeBlock>
        <div>
          <Button variant="contained" disabled={!enabled} onClick={onRun}>
            {step.buttonLabel}
          </Button>
        </div>
        <Card variant="outlined">
          <CardContent component={Stack} gap={1}>
            <Typography semanticTag="p" visualAppearance="overline-three" noMargin>
              {step.resultLabel}
            </Typography>
            {done ? (
              <CodeBlock>{step.result}</CodeBlock>
            ) : (
              <Typography semanticTag="p" visualAppearance="body-three" noMargin>
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
