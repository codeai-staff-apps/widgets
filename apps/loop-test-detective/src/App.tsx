import Alert from '@code-dot-org/component-library/alert';
import Button from '@code-dot-org/component-library/button';
import Typography from '@code-dot-org/component-library/typography';
import LinearProgress from '@mui/material/LinearProgress';
import {useEffect, useState} from 'react';

import './app.css';
import CheckScreen from './CheckScreen';
import CodePanel from './CodePanel';
import {resolveContent} from './content/resolve';
import Dialogue from './Dialogue';
import {CodeBlock, Screen, useAnnounce, useScreenMachine} from './shared';
import SummaryScreen from './SummaryScreen';

const {lang, chrome, scenario, fellBack} = resolveContent(window.location.search);

const CHECK_IDS = scenario.checks.map((_, i) => `check-${i}`);
const SCREEN_IDS = ['intro', ...CHECK_IDS, 'summary'];

const progressLabel = (checkNumber: number) =>
  chrome.progressOf.replace('{n}', String(checkNumber));

export default function App() {
  const announce = useAnnounce();
  const [answers, setAnswers] = useState<(boolean | null)[]>(() =>
    scenario.checks.map(() => null),
  );

  const machine = useScreenMachine(SCREEN_IDS, {
    onEnter: id => {
      const index = CHECK_IDS.indexOf(id);
      if (index >= 0) {
        announce(progressLabel(index + 1));
      }
    },
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = chrome.documentTitle;
  }, []);

  const checkIndex = CHECK_IDS.indexOf(machine.current);
  const inActivity = checkIndex >= 0;
  const revealed = answers[scenario.revealAt] !== null;

  const answer = (index: number, saidIssue: boolean) => {
    setAnswers(previous => previous.map((value, i) => (i === index ? saidIssue : value)));
    if (index === scenario.revealAt) {
      // The console filling in is the one state change no visible alert covers.
      announce(
        `${scenario.consoleOutput.join(' ')} ${scenario.consoleWarning.replace('// ', '')}`,
      );
    }
  };

  const restart = () => {
    setAnswers(scenario.checks.map(() => null));
    machine.goTo(CHECK_IDS[0]);
  };

  return (
    <main className="page">
      <Screen
        machine={machine}
        id="intro"
        heading={chrome.introTitle}
        headingTag="h1"
        headingAppearance="heading-lg"
      >
        {chrome.eyebrow && (
          <Typography semanticTag="p" visualAppearance="overline-two">
            {chrome.eyebrow}
          </Typography>
        )}
        <Typography semanticTag="p" visualAppearance="body-one">
          {chrome.introSub}
        </Typography>

        {fellBack && (
          <Alert type="info" size="s" isImmediateImportance={false} text={chrome.fallbackNote} />
        )}

        {chrome.introTeacherLine && (
          <Dialogue speaker={chrome.teacherName}>{chrome.introTeacherLine}</Dialogue>
        )}

        {chrome.scenarioCard && (
          <section className="card">
            <Typography semanticTag="p" visualAppearance="overline-two">
              {chrome.scenarioCard.label}
            </Typography>
            <Typography semanticTag="h2" visualAppearance="heading-sm">
              {chrome.scenarioCard.header}
            </Typography>
            <Dialogue speaker={chrome.scenarioCard.studentLabel}>
              {chrome.scenarioCard.quote}
            </Dialogue>
            <Typography semanticTag="p" visualAppearance="body-two" noMargin>
              {chrome.scenarioCard.body}
            </Typography>
          </section>
        )}

        <CodeBlock>
          {[
            scenario.code.comment,
            '',
            scenario.code.loop,
            scenario.code.body,
            scenario.code.close,
            '',
            scenario.code.expected,
            scenario.code.actualUnknown,
          ].join('\n')}
        </CodeBlock>

        <section className="card">
          <Typography semanticTag="h2" visualAppearance="heading-sm">
            {chrome.missionHeading}
          </Typography>
          <Typography semanticTag="p" visualAppearance="body-two">
            {chrome.missionText}
          </Typography>
          {chrome.missionSteps && (
            <ol className="missionSteps">
              {chrome.missionSteps.map(step => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          )}
        </section>

        <div>
          <Button
            type="primary"
            color="purple"
            text={chrome.startBtn}
            onClick={() => machine.goTo(CHECK_IDS[0])}
          />
        </div>
        {chrome.startNote && (
          <Typography semanticTag="p" visualAppearance="body-three">
            {chrome.startNote}
          </Typography>
        )}
      </Screen>

      <div className={inActivity ? 'activityGrid' : undefined}>
        <div>
          {inActivity && (
            <p className="progress">
              <span>{progressLabel(checkIndex + 1)}</span>
              <LinearProgress
                aria-hidden="true"
                variant="determinate"
                value={((checkIndex + 1) / scenario.checks.length) * 100}
              />
            </p>
          )}
          {scenario.checks.map((check, i) => (
            <CheckScreen
              key={CHECK_IDS[i]}
              machine={machine}
              id={CHECK_IDS[i]}
              check={check}
              chrome={chrome}
              answer={answers[i]}
              onAnswer={saidIssue => answer(i, saidIssue)}
              onNext={() => machine.goTo(SCREEN_IDS[i + 2])}
              isLast={i === scenario.checks.length - 1}
            />
          ))}
        </div>

        {inActivity && (
          <CodePanel
            scenario={scenario}
            chrome={chrome}
            highlight={scenario.checks[checkIndex].highlight}
            revealed={revealed}
          />
        )}
      </div>

      <SummaryScreen
        machine={machine}
        id="summary"
        chrome={chrome}
        scenario={scenario}
        answers={answers}
        onRestart={restart}
      />
    </main>
  );
}
