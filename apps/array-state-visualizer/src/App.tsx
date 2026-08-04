import Alert from '@code-dot-org/component-library/alert';
import Typography from '@code-dot-org/component-library/typography';
import Button from '@mui/material/Button';
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
          // Standing directions, not an event: no live-region role, no icon
          // (the runtime vendors no icon font).
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
          variant="text"
          onClick={() => {
            setRan({});
            announce(resetAnnouncement);
          }}
        >
          Reset all
        </Button>
      </div>
    </Stack>
  );
}
