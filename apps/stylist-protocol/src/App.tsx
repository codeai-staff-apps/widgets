import Button from '@code-dot-org/component-library/button';
import Typography from '@code-dot-org/component-library/typography';
import LinearProgress from '@mui/material/LinearProgress';
import {useEffect, useState} from 'react';

import './app.css';
import CodePanel from './CodePanel';
import {CHROME, STEPS} from './content/content';
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

  return (
    <main className="page">
      <Screen
        machine={machine}
        id="intro"
        heading={CHROME.introTitle}
        headingTag="h1"
        headingAppearance="heading-lg"
      >
        <Typography semanticTag="p" visualAppearance="overline-two">
          {CHROME.unitTag}
        </Typography>
        <Typography semanticTag="p" visualAppearance="body-one">
          {CHROME.introSub}
        </Typography>

        <section className="card">
          <Typography semanticTag="h2" visualAppearance="heading-sm">
            <span aria-hidden="true">{CHROME.notifIcon} </span>
            {CHROME.notifTitle}
          </Typography>
          <Typography semanticTag="p" visualAppearance="body-two">
            {CHROME.notifDetails}
          </Typography>
          <Typography semanticTag="p" visualAppearance="body-three" noMargin>
            {CHROME.notifItems}
          </Typography>
        </section>

        <Dialogue speaker={CHROME.teacherName}>{CHROME.introTeacherLine}</Dialogue>

        <ol className="stepsPreview">
          {CHROME.stepsPreview.map(preview => (
            <li key={preview}>{preview}</li>
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
      </Screen>

      <div className={inActivity ? 'activityGrid' : undefined}>
        <div>
          {inActivity && (
            <p className="progress">
              <span>{progressLabel(stepIndex + 1)}</span>
              <LinearProgress
                aria-hidden="true"
                variant="determinate"
                value={((stepIndex + 1) / STEPS.length) * 100}
              />
            </p>
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
          />
        )}
      </div>

      <SummaryScreen machine={machine} id="summary" results={results} onRestart={restart} />
    </main>
  );
}
