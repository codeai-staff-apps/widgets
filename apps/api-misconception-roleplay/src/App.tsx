import Alert from '@code-dot-org/component-library/alert';
import Tags from '@code-dot-org/component-library/tags';
import Typography from '@code-dot-org/component-library/typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import BarCard from './BarCard';
import ChoicesScreen from './ChoicesScreen';
import {rich} from './markup';
import {announcements, choicesScreen, footerNote, intro, student, summary} from './scenario';
import {Screen, useAnnounce, useScreenMachine} from './shared';

const SCREENS = ['intro', 'choices', 'summary'] as const;

function FooterNote() {
  return (
    <Typography
      semanticTag="p"
      visualAppearance="body-four"
      style={{color: 'var(--text-neutral-secondary)'}}
    >
      {footerNote}
    </Typography>
  );
}

export default function App() {
  const announce = useAnnounce();
  const machine = useScreenMachine(SCREENS, {
    onEnter: (id, previous) => {
      if (id === 'choices') {
        announce(previous === 'summary' ? announcements.restart : announcements.choices);
      }
      if (id === 'summary') {
        announce(announcements.summary);
      }
    },
  });

  return (
    <Stack component="main" gap={2} sx={{maxWidth: 660, mx: 'auto', px: 2, pt: 2, pb: 6}}>
      <Screen machine={machine} id="intro" headingTag="h1" heading={intro.title}>
        <Stack gap={2}>
          <Tags tagsList={[{label: intro.eyebrow}]} />
          <Typography semanticTag="p" visualAppearance="body-two" noMargin>
            {intro.subtitle}
          </Typography>

          <BarCard label={intro.scenarioBarLabel} title={intro.scenarioBarTitle}>
            <Stack direction="row" gap={2} alignItems="flex-start">
              <span aria-hidden="true" style={{fontSize: '1.75rem'}}>
                {student.avatar}
              </span>
              <div>
                <Typography semanticTag="p" visualAppearance="body-three" noMargin>
                  <strong>{student.name}</strong>
                </Typography>
                <blockquote style={{margin: 0}}>
                  <Typography semanticTag="p" visualAppearance="body-two" noMargin>
                    {student.quote}
                  </Typography>
                </blockquote>
              </div>
            </Stack>
            <Typography semanticTag="p" visualAppearance="body-three" noMargin>
              {rich(intro.scenarioContext)}
            </Typography>
          </BarCard>

          <Alert
            type="info"
            role="note"
            showIcon={false}
            text={
              <>
                <strong>{intro.promptLabel}: </strong>
                {intro.promptText}
              </>
            }
          />

          <div>
            <Button variant="contained" onClick={() => machine.goTo('choices')}>
              {intro.startButtonLabel}
            </Button>
          </div>
          <FooterNote />
        </Stack>
      </Screen>

      <Screen machine={machine} id="choices" headingTag="h1" heading={choicesScreen.title}>
        <ChoicesScreen onNext={() => machine.goTo('summary')} />
      </Screen>

      <Screen machine={machine} id="summary" headingTag="h1" heading={summary.title}>
        <Stack gap={2}>
          <Tags tagsList={[{label: summary.eyebrow}]} />
          <Typography semanticTag="p" visualAppearance="body-two" noMargin>
            {summary.subtitle}
          </Typography>

          <BarCard
            label={summary.distinctionCard.barLabel}
            title={summary.distinctionCard.barTitle}
          >
            <Stack direction="row" gap={2} flexWrap="wrap">
              {summary.distinctionCard.columns.map(column => (
                <div key={column.label} style={{flex: '1 1 220px'}}>
                  <Typography semanticTag="p" visualAppearance="overline-three" noMargin>
                    {column.label}
                  </Typography>
                  <Typography semanticTag="p" visualAppearance="body-three" noMargin>
                    {rich(column.text)}
                  </Typography>
                </div>
              ))}
            </Stack>
            <Typography semanticTag="p" visualAppearance="body-three" noMargin>
              {rich(summary.distinctionCard.explanation)}
            </Typography>
          </BarCard>

          <BarCard label={summary.whyBestCard.barLabel} title={summary.whyBestCard.barTitle}>
            <Typography semanticTag="p" visualAppearance="body-three" noMargin>
              {rich(summary.whyBestCard.explanation)}
            </Typography>
          </BarCard>

          <Alert
            type="info"
            role="note"
            showIcon={false}
            text={
              <>
                <strong>{summary.classroomConnection.label}: </strong>
                {rich(summary.classroomConnection.text)}
              </>
            }
          />

          <div>
            <Button variant="outlined" onClick={() => machine.goTo('choices')}>
              {summary.restartButtonLabel}
            </Button>
          </div>
          <FooterNote />
        </Stack>
      </Screen>
    </Stack>
  );
}
