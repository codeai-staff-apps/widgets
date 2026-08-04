import Alert from '@code-dot-org/component-library/alert';
import Button from '@code-dot-org/component-library/button';
import Typography from '@code-dot-org/component-library/typography';
import Stack from '@mui/material/Stack';
import {useState} from 'react';

import {directions, examples, resetAnnouncement} from './examples';
import MethodExample from './MethodExample';
import {useAnnounce} from './shared';

export default function App() {
  const announce = useAnnounce();
  const [ran, setRan] = useState<Record<string, boolean>>({});

  return (
    <Stack component="main" gap={4} sx={{maxWidth: 900, mx: 'auto', px: 2, pt: 2, pb: 6}}>
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
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </>
          }
        />
      </div>

      {examples.map(example => (
        <MethodExample
          key={example.id}
          example={example}
          run={Boolean(ran[example.id])}
          onRun={() => {
            setRan(previous => ({...previous, [example.id]: true}));
            announce(example.announcement);
          }}
        />
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
