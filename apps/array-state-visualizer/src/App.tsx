import Alert from '@code-dot-org/component-library/alert';
import Button from '@code-dot-org/component-library/button';
import Typography from '@code-dot-org/component-library/typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import {Fragment, useState} from 'react';

import {directions, examples, resetAnnouncement} from './examples';
import MethodExample from './MethodExample';
import {useAnnounce} from './shared';

import './page.css';

/** The one directions step that calls out the run button by name, verbatim. */
const RUN_BUTTON_LABEL = 'Run this code';

function DirectionStep({step}: {step: string}) {
  const calloutIndex = step.indexOf(RUN_BUTTON_LABEL);
  if (calloutIndex === -1) {
    return <li>{step}</li>;
  }
  return (
    <li>
      {step.slice(0, calloutIndex)}
      <strong>{RUN_BUTTON_LABEL}</strong>
      {step.slice(calloutIndex + RUN_BUTTON_LABEL.length)}
    </li>
  );
}

export default function App() {
  const announce = useAnnounce();
  const [ran, setRan] = useState<Record<string, boolean>>({});

  return (
    <Stack
      component="main"
      className="page"
      gap={4}
      sx={{maxWidth: 900, mx: 'auto', px: 2, pt: 2, pb: 6}}
    >
      <div>
        <Typography semanticTag="h1" visualAppearance="heading-lg">
          Array State Visualizer
        </Typography>
        <Alert
          type="info"
          // Standing directions, not an event: no live-region role.
          role="note"
          text={
            <>
              <strong>{directions.heading}</strong>
              <ol style={{margin: '4px 0 0'}}>
                {directions.steps.map(step => (
                  <DirectionStep key={step} step={step} />
                ))}
              </ol>
            </>
          }
        />
      </div>

      {examples.map((example, i) => (
        <Fragment key={example.id}>
          {i > 0 && <Divider sx={{borderColor: '#E4E2F8'}} />}
          <MethodExample
            example={example}
            run={Boolean(ran[example.id])}
            onRun={() => {
              setRan(previous => ({...previous, [example.id]: true}));
              announce(example.announcement);
            }}
          />
        </Fragment>
      ))}

      <div>
        <Button
          text="Reset all"
          type="tertiary"
          color="black"
          onClick={() => {
            setRan({});
            announce(resetAnnouncement);
          }}
        />
      </div>
    </Stack>
  );
}
