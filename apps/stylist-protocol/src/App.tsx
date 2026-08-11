import Button from '@code-dot-org/component-library/button';
import Typography from '@code-dot-org/component-library/typography';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import {useEffect, useState} from 'react';

import './app.css';
import CodePanel from './CodePanel';
import {CHROME, STEPS} from './content/content';
import type {TextSegment} from './content/types';
import Dialogue from './Dialogue';
import {Screen, useAnnounce, useScreenMachine} from './shared';
import StepScreen from './StepScreen';
import SummaryScreen from './SummaryScreen';

const STEP_IDS = STEPS.map((_, i) => `step-${i}`);
const SCREEN_IDS = ['intro', ...STEP_IDS, 'summary'];

/** The step whose entry reveals the helper function the AI wrote. */
const REVEAL_STEP = STEP_IDS[4];

const progressLabel = (stepNumber: number) =>
  CHROME.progressOf.replace('{n}', String(stepNumber));

const dotLabel = (template: string, stepNumber: number) =>
  template.replace('{n}', String(stepNumber));

const pillSx = {
  bgcolor: 'rgba(106, 98, 217, 0.1)',
  color: 'var(--text-brand-primary)',
  border: '1px solid rgba(106, 98, 217, 0.25)',
  borderRadius: '999px',
  fontWeight: 700,
  fontSize: '0.68rem',
};

const unitTagSx = {
  bgcolor: 'rgba(106, 98, 217, 0.18)',
  color: 'var(--text-brand-primary)',
  border: '1px solid rgba(106, 98, 217, 0.4)',
  borderRadius: '999px',
  fontWeight: 700,
  fontSize: '0.7rem',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
};

/** Renders the amber-emphasised data values the notification calls out. */
function Emphasized({segments}: {segments: TextSegment[]}) {
  return (
    <>
      {segments.map((segment, i) =>
        segment.emphasis ? (
          <strong key={i} className="dataValue">
            {segment.text}
          </strong>
        ) : (
          segment.text
        ),
      )}
    </>
  );
}

export default function App() {
  const announce = useAnnounce();
  const [results, setResults] = useState<(boolean | null)[]>(() => STEPS.map(() => null));
  const [consoleText, setConsoleText] = useState(CHROME.consoleInitial);
  const [phoneHasNewPost, setPhoneHasNewPost] = useState(false);
  const [selectedLine, setSelectedLine] = useState<string>();

  const machine = useScreenMachine(SCREEN_IDS, {
    onEnter: id => {
      const index = STEP_IDS.indexOf(id);
      if (index >= 0) {
        announce(progressLabel(index + 1));
      }
    },
  });

  useEffect(() => {
    document.title = CHROME.documentTitle;
  }, []);

  const stepIndex = STEP_IDS.indexOf(machine.current);
  const inActivity = stepIndex >= 0;
  const step = inActivity ? STEPS[stepIndex] : undefined;

  const answerStep = (index: number, correct: boolean) => {
    setResults(previous => previous.map((value, i) => (i === index ? correct : value)));

    const {interaction, consoleMsg} = STEPS[index];
    // The source printed "push() succeeded — 6 posts loaded" even when the
    // learner said the feed was wrong, and "Plan confirmed" on a wrong plan.
    // The console now only reports what actually happened.
    if (!correct && interaction.type === 'promptchoice') {
      setConsoleText(interaction.wrongConsoleMsg);
    } else if (correct && consoleMsg) {
      setConsoleText(consoleMsg);
    }

    if (correct && interaction.type === 'testconfirm') {
      setPhoneHasNewPost(true);
    }
  };

  /** Step 2 asks for a line, so the code panel is that step's control. */
  const clickLine = (id: string | undefined) => {
    if (!step || step.interaction.type !== 'clickline') {
      return;
    }
    setSelectedLine(id);
    answerStep(stepIndex, id === step.interaction.target);
  };

  const restart = () => {
    setResults(STEPS.map(() => null));
    setConsoleText(CHROME.consoleInitial);
    setPhoneHasNewPost(false);
    setSelectedLine(undefined);
    machine.goTo(STEP_IDS[0]);
  };

  const lineClickHandler =
    step?.interaction.type === 'clickline' && results[stepIndex] === null ? clickLine : undefined;
  const clickTarget = step?.interaction.type === 'clickline' ? step.interaction.target : undefined;

  return (
    <main className="page">
      <Screen
        machine={machine}
        id="intro"
        heading={
          <>
            {CHROME.introTitle} <span className="introTitleAccent">{CHROME.introTitleAccent}</span>
          </>
        }
        headingTag="h1"
        headingAppearance="heading-lg"
      >
        <div className="shell">
          <Chip label={CHROME.unitTag} size="small" sx={unitTagSx} />
          <Typography semanticTag="p" visualAppearance="body-one">
            {CHROME.introSub}
          </Typography>

          <section className="card">
            <Typography semanticTag="h2" visualAppearance="heading-sm">
              <span aria-hidden="true">{CHROME.notifIcon} </span>
              {CHROME.notifTitle}
            </Typography>
            <Typography semanticTag="p" visualAppearance="body-two">
              <Emphasized segments={CHROME.notifDetails} />
            </Typography>
            <Typography semanticTag="p" visualAppearance="body-three" noMargin>
              <Emphasized segments={CHROME.notifItems} />
            </Typography>
          </section>

          <Dialogue speaker={CHROME.teacherName} variant="teacher">
            {CHROME.introTeacherLine}
          </Dialogue>

          <ol className="stepsPreview" aria-label="Protocol steps">
            {CHROME.stepsPreview.map(preview => (
              <li key={preview}>
                <Chip label={preview} size="small" sx={pillSx} />
              </li>
            ))}
          </ol>

          <div>
            <Button
              type="primary"
              color="purple"
              text={CHROME.startBtn}
              onClick={() => machine.goTo(STEP_IDS[0])}
            />
          </div>
        </div>
      </Screen>

      <div className={inActivity ? 'activityGrid' : undefined}>
        <div>
          {inActivity && (
            <div className="progress">
              <span>{progressLabel(stepIndex + 1)}</span>
              <LinearProgress
                aria-hidden="true"
                variant="determinate"
                value={((stepIndex + 1) / STEPS.length) * 100}
                sx={{
                  height: 3,
                  borderRadius: 999,
                  bgcolor: '#1e2130',
                  '& .MuiLinearProgress-bar': {
                    backgroundImage: 'linear-gradient(90deg, #6a62d9, #a29ff0)',
                  },
                }}
              />
              <ol className="stepDots" aria-label="Step completion status">
                {STEPS.map((_, i) => {
                  const state = i < stepIndex ? 'isDone' : i === stepIndex ? 'isActive' : '';
                  const label =
                    i < stepIndex
                      ? CHROME.dotDoneLabel
                      : i === stepIndex
                        ? CHROME.dotActiveLabel
                        : CHROME.dotPendingLabel;
                  return (
                    <li key={STEP_IDS[i]} aria-label={dotLabel(label, i + 1)}>
                      <span className={`stepDot ${state}`} aria-hidden="true" />
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
          {STEPS.map((entry, i) => (
            <StepScreen
              key={STEP_IDS[i]}
              machine={machine}
              id={STEP_IDS[i]}
              step={entry}
              result={results[i]}
              onAnswer={correct => answerStep(i, correct)}
              onNext={() => machine.goTo(SCREEN_IDS[i + 2])}
              isLast={i === STEPS.length - 1}
              phoneHasNewPost={phoneHasNewPost}
            />
          ))}
        </div>

        {inActivity && step && (
          <CodePanel
            highlight={step.highlightLines}
            revealed={machine.is(REVEAL_STEP)}
            consoleText={consoleText}
            onLineClick={lineClickHandler}
            selectedLine={selectedLine}
            clickTarget={clickTarget}
          />
        )}
      </div>

      <SummaryScreen machine={machine} id="summary" results={results} onRestart={restart} />
    </main>
  );
}
