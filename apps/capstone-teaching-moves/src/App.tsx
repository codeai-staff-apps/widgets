import Button from '@code-dot-org/component-library/button';
import Image from '@code-dot-org/component-library/image';
import Typography from '@code-dot-org/component-library/typography';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

import ScenarioScreen from './ScenarioScreen';
import {intro, labels, scenarios, wrapUp} from './scenarios';
import {Screen, useAnnounce, useScreenMachine} from './shared';

import './walkthrough.css';

const FINAL = 'final';
const SCREENS = ['intro', ...scenarios.map(scenario => scenario.id), FINAL];

// The screen eyebrow (filled purple, white text) is the inverse of the
// scenario tag (lavender fill, purple text, rendered via DSCO `Tags`) — MUI
// `Chip` is used here because DSCO `Tags` only offers the inverse treatment.
function EyebrowChip({label}: {label: string}) {
  return (
    <Chip
      label={label}
      sx={{
        alignSelf: 'flex-start',
        bgcolor: '#4C42CF',
        color: '#fff',
        borderRadius: '100px',
        textTransform: 'uppercase',
        letterSpacing: '.06em',
        fontFamily: 'var(--font-family-heading)',
        fontWeight: 600,
        fontSize: 13,
      }}
    />
  );
}

export default function App() {
  const announce = useAnnounce();
  const machine = useScreenMachine(SCREENS, {
    // Each screen's heading takes focus and reads the title; the announcement
    // adds the position in the walkthrough, which the title does not carry.
    onEnter: id => {
      const index = scenarios.findIndex(scenario => scenario.id === id);
      if (index >= 0) {
        announce(labels.progress(index));
      }
    },
  });

  return (
    <Stack component="main" className="page">
      <Paper
        sx={{
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(31,25,118,0.14)',
          overflow: 'hidden',
          p: {xs: '24px 20px 26px', sm: '36px 36px 32px'},
          bgcolor: '#ffffff',
        }}
      >
        <Screen machine={machine} id="intro" headingTag="h1" heading={intro.title}>
          <Stack gap={2}>
            <EyebrowChip label={intro.eyebrow} />
            <Typography semanticTag="p" visualAppearance="body-two" noMargin>
              {intro.body}
            </Typography>
            <Image className="photo" src={intro.image} altText={intro.imageAlt} loading="eager" />
            <div>
              <Button text={intro.startButtonLabel} onClick={() => machine.goTo(SCREENS[1])} />
            </div>
          </Stack>
        </Screen>

        {scenarios.map((scenario, index) => (
          <Screen
            key={scenario.id}
            machine={machine}
            id={scenario.id}
            headingTag="h1"
            heading={scenario.title}
          >
            <ScenarioScreen
              scenario={scenario}
              index={index}
              onNext={() => machine.goTo(SCREENS[index + 2])}
            />
          </Screen>
        ))}

        <Screen machine={machine} id={FINAL} headingTag="h1" heading={wrapUp.title}>
          <Stack gap={2}>
            <EyebrowChip label={wrapUp.eyebrow} />
            <Typography semanticTag="p" visualAppearance="body-two" noMargin>
              {wrapUp.introText}
            </Typography>
            <Stack component="ul" gap={1} sx={{listStyle: 'none', p: 0, m: 0}}>
              {wrapUp.recapList.map(item => (
                <Paper
                  key={item}
                  component="li"
                  elevation={0}
                  sx={{
                    bgcolor: '#E4E2F8',
                    borderRadius: '12px',
                    p: '12px 16px',
                    display: 'flex',
                    gap: '10px',
                  }}
                >
                  <span aria-hidden="true" style={{color: '#4C42CF', fontWeight: 700}}>
                    ✓
                  </span>
                  <Typography semanticTag="span" visualAppearance="body-two" noMargin>
                    {item}
                  </Typography>
                </Paper>
              ))}
            </Stack>
            <Image
              className="photo"
              src={wrapUp.image}
              altText={wrapUp.imageAlt}
              loading="eager"
            />
            <Typography semanticTag="p" visualAppearance="body-two" noMargin>
              {wrapUp.outroText}
            </Typography>
            <div>
              <Button
                text={wrapUp.restartButtonLabel}
                type="secondary"
                color="black"
                onClick={() => machine.goTo('intro')}
              />
            </div>
          </Stack>
        </Screen>
      </Paper>
    </Stack>
  );
}
