import Image from '@code-dot-org/component-library/image';
import Tags from '@code-dot-org/component-library/tags';
import Typography from '@code-dot-org/component-library/typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import ScenarioScreen from './ScenarioScreen';
import {intro, labels, scenarios, wrapUp} from './scenarios';
import {Screen, useAnnounce, useScreenMachine} from './shared';

import './walkthrough.css';

const FINAL = 'final';
const SCREENS = ['intro', ...scenarios.map(scenario => scenario.id), FINAL];

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
    <Stack component="main" gap={2} sx={{maxWidth: 760, mx: 'auto', px: 2, pt: 2, pb: 6}}>
      <Screen machine={machine} id="intro" headingTag="h1" heading={intro.title}>
        <Stack gap={2}>
          <Tags tagsList={[{label: intro.eyebrow}]} />
          <Typography semanticTag="p" visualAppearance="body-two" noMargin>
            {intro.body}
          </Typography>
          <Image className="photo" src={intro.image} altText={intro.imageAlt} loading="eager" />
          <div>
            <Button variant="contained" onClick={() => machine.goTo(SCREENS[1])}>
              {intro.startButtonLabel}
            </Button>
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
          <Tags tagsList={[{label: wrapUp.eyebrow}]} />
          <Typography semanticTag="p" visualAppearance="body-two" noMargin>
            {wrapUp.introText}
          </Typography>
          {/* Plain <ul>: the DS SimpleList marks items with an icon-font glyph,
              and the runtime vendors no icon font, so its bullets are invisible.
              Typography per item because the document body sets no font. */}
          <ul>
            {wrapUp.recapList.map(item => (
              <li key={item}>
                <Typography semanticTag="span" visualAppearance="body-two">
                  {item}
                </Typography>
              </li>
            ))}
          </ul>
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
            <Button variant="outlined" onClick={() => machine.goTo('intro')}>
              {wrapUp.restartButtonLabel}
            </Button>
          </div>
        </Stack>
      </Screen>
    </Stack>
  );
}
