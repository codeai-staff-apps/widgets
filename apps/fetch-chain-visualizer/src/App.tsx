import Alert from '@code-dot-org/component-library/alert';
import Typography from '@code-dot-org/component-library/typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {useEffect, useId, useRef, useState} from 'react';

import {highlight, inlineCode} from './markup';
import {CodeBlock, useAnnounce} from './shared';
import StepSection from './StepSection';
import {
  directions,
  fullChain,
  resetAnnounce,
  resetButtonLabel,
  steps,
  summary,
  SUMMARY_DELAY_MS,
  UNLOCK_DELAY_MS,
} from './steps';

const INITIAL = {done: 0, unlocked: 1, summaryShown: false};

export default function App() {
  const announce = useAnnounce();
  const chainHeadingId = useId();
  const [state, setState] = useState(INITIAL);
  const timers = useRef<number[]>([]);

  const cancelTimers = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };
  const later = (ms: number, run: () => void) => {
    timers.current.push(window.setTimeout(run, ms));
  };

  useEffect(() => cancelTimers, []);

  const runStep = (number: number) => {
    setState(previous => ({...previous, done: number}));
    announce(steps[number - 1].announce);
    if (number < steps.length) {
      later(UNLOCK_DELAY_MS, () =>
        setState(previous => ({...previous, unlocked: number + 1})),
      );
    } else {
      later(SUMMARY_DELAY_MS, () => setState(previous => ({...previous, summaryShown: true})));
    }
  };

  const reset = () => {
    cancelTimers();
    setState(INITIAL);
    announce(resetAnnounce);
  };

  return (
    <Stack component="main" gap={4} sx={{maxWidth: 800, mx: 'auto', px: 2, pt: 2, pb: 6}}>
      <div>
        <Typography semanticTag="h1" visualAppearance="heading-lg">
          How fetch() Works: Step by Step
        </Typography>
        <Alert
          type="info"
          role="note"
          showIcon={false}
          text={
            <>
              <strong>{directions.heading}</strong>
              <ol style={{margin: '4px 0 0'}}>
                {directions.steps.map(step => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </>
          }
        />
      </div>

      <section aria-labelledby={chainHeadingId}>
        <Typography semanticTag="h2" visualAppearance="heading-md" id={chainHeadingId}>
          {fullChain.heading}
        </Typography>
        <CodeBlock summary={fullChain.summary}>{highlight(fullChain.code)}</CodeBlock>
      </section>

      {steps.map(step => (
        <StepSection
          key={step.number}
          step={step}
          done={state.done >= step.number}
          enabled={state.unlocked >= step.number && state.done < step.number}
          onRun={() => runStep(step.number)}
        />
      ))}

      {state.summaryShown && (
        <Alert
          type="success"
          role="note"
          showIcon={false}
          text={
            <>
              <strong>{summary.label}</strong>
              {summary.paragraphs.map(paragraph => (
                <p key={paragraph} style={{margin: '8px 0 0'}}>
                  {inlineCode(paragraph)}
                </p>
              ))}
            </>
          }
        />
      )}

      <div>
        <Button variant="text" onClick={reset}>
          {resetButtonLabel}
        </Button>
      </div>
    </Stack>
  );
}
