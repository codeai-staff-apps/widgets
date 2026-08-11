import Alert from '@code-dot-org/component-library/alert';
import Button from '@code-dot-org/component-library/button';
import Tags from '@code-dot-org/component-library/tags';
import Typography from '@code-dot-org/component-library/typography';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

import BarCard from './BarCard';
import ChoicesScreen from './ChoicesScreen';
import {rich} from './markup';
import PromptBox from './PromptBox';
import {announcements, choicesScreen, footerNote, intro, student, summary} from './scenario';
import {Screen, useAnnounce, useScreenMachine} from './shared';
import './roleplay.css';

const SCREENS = ['intro', 'choices', 'summary'] as const;

// Column tint pairs with `summary.distinctionCard.columns` by index: the
// amber "URL Jordan found" column, then the lavender "API" column.
const DISTINCTION_STYLES = [
  {bgcolor: '#FFE3CE', borderColor: '#FFA868', color: '#510000'},
  {bgcolor: '#E4E2F8', borderColor: '#ACA8EA', color: '#1F1976'},
];

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
      <Screen
        machine={machine}
        id="intro"
        headingTag="h1"
        heading={intro.title}
        headingWrapper={h1 => (
          <Paper
            className="hero"
            elevation={0}
            sx={{
              bgcolor: '#4C42CF',
              color: '#fff',
              borderRadius: '14px',
              p: '26px 28px',
              mb: 2,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Tags tagsList={[{label: intro.eyebrow}]} />
            {h1}
            <Typography
              semanticTag="p"
              visualAppearance="body-two"
              noMargin
              style={{color: 'rgba(255, 255, 255, 0.88)'}}
            >
              {intro.subtitle}
            </Typography>
          </Paper>
        )}
      >
        <Stack gap={2}>
          <BarCard label={intro.scenarioBarLabel} title={intro.scenarioBarTitle}>
            <Stack direction="row" gap={2} alignItems="flex-start">
              <span aria-hidden="true" style={{fontSize: '1.75rem'}}>
                {student.avatar}
              </span>
              <div>
                <Typography semanticTag="p" visualAppearance="body-three" noMargin>
                  <strong>{student.name}</strong>
                </Typography>
                <blockquote
                  style={{margin: 0, borderLeft: '3px solid #4C42CF', paddingLeft: 12}}
                >
                  <Typography
                    semanticTag="p"
                    visualAppearance="body-two"
                    noMargin
                    style={{fontStyle: 'italic'}}
                  >
                    {student.quote}
                  </Typography>
                </blockquote>
              </div>
            </Stack>
            <Typography semanticTag="p" visualAppearance="body-three" noMargin>
              {rich(intro.scenarioContext)}
            </Typography>
          </BarCard>

          <PromptBox label={intro.promptLabel} text={intro.promptText} />

          <div>
            <Button text={intro.startButtonLabel} onClick={() => machine.goTo('choices')} />
          </div>
          <FooterNote />
        </Stack>
      </Screen>

      <Screen machine={machine} id="choices" headingTag="h1" heading={choicesScreen.title}>
        <ChoicesScreen onNext={() => machine.goTo('summary')} />
      </Screen>

      <Screen
        machine={machine}
        id="summary"
        headingTag="h1"
        heading={summary.title}
        headingWrapper={h1 => (
          <Paper
            className="summaryHero"
            elevation={0}
            sx={{
              bgcolor: '#1F1976',
              color: '#fff',
              borderRadius: '14px',
              p: '26px 28px',
              mb: 2,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Tags tagsList={[{label: summary.eyebrow}]} />
            {h1}
            <Typography
              semanticTag="p"
              visualAppearance="body-two"
              noMargin
              style={{color: 'rgba(255, 255, 255, 0.88)'}}
            >
              {summary.subtitle}
            </Typography>
          </Paper>
        )}
      >
        <Stack gap={2}>
          <BarCard
            label={summary.distinctionCard.barLabel}
            title={summary.distinctionCard.barTitle}
          >
            <Stack direction="row" gap={2} flexWrap="wrap">
              {summary.distinctionCard.columns.map((column, i) => (
                <Paper
                  key={column.label}
                  variant="outlined"
                  sx={{
                    ...DISTINCTION_STYLES[i],
                    flex: '1 1 220px',
                    borderRadius: '8px',
                    p: '12px 14px',
                  }}
                >
                  <Typography
                    semanticTag="p"
                    visualAppearance="overline-three"
                    noMargin
                    style={{color: DISTINCTION_STYLES[i].color}}
                  >
                    {column.label}
                  </Typography>
                  <Typography
                    semanticTag="p"
                    visualAppearance="body-three"
                    noMargin
                    style={{color: DISTINCTION_STYLES[i].color}}
                  >
                    {rich(column.text)}
                  </Typography>
                </Paper>
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
            aria-label="Classroom connection"
            showIcon={false}
            text={
              <>
                <strong>{summary.classroomConnection.label}: </strong>
                {rich(summary.classroomConnection.text)}
              </>
            }
          />

          <Divider sx={{borderColor: '#E4E2F8'}} />

          <div>
            <Button
              text={summary.restartButtonLabel}
              type="secondary"
              color="black"
              onClick={() => machine.goTo('choices')}
            />
          </div>
          <FooterNote />
        </Stack>
      </Screen>
    </Stack>
  );
}
