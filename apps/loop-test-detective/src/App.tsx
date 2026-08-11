import Alert from '@code-dot-org/component-library/alert';
import Button from '@code-dot-org/component-library/button';
import Typography from '@code-dot-org/component-library/typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import {useEffect, useState} from 'react';

import './app.css';
import studentImg from './assets/student_veo.png';
import teacherImg from './assets/teacher_veo.png';
import CheckScreen from './CheckScreen';
import CodePanel from './CodePanel';
import {resolveContent} from './content/resolve';
import Dialogue from './Dialogue';
import {renderLine} from './highlightCode';
import {Screen, useAnnounce, useScreenMachine} from './shared';
import SummaryScreen from './SummaryScreen';

const {lang, chrome, scenario, fellBack} = resolveContent(window.location.search);

const CHECK_IDS = scenario.checks.map((_, i) => `check-${i}`);
const SCREEN_IDS = ['intro', ...CHECK_IDS, 'summary'];

const progressLabel = (checkNumber: number) =>
  chrome.progressOf.replace('{n}', String(checkNumber));

const CODE_PREVIEW_LINES = [
  scenario.code.comment,
  '',
  scenario.code.loop,
  scenario.code.body,
  scenario.code.close,
  '',
  scenario.code.expected,
  scenario.code.actualUnknown,
];

export default function App() {
  const announce = useAnnounce();
  const [answers, setAnswers] = useState<(boolean | null)[]>(() =>
    scenario.checks.map(() => null),
  );

  const machine = useScreenMachine(SCREEN_IDS, {
    onEnter: id => {
      const index = CHECK_IDS.indexOf(id);
      if (index >= 0) {
        announce(`${progressLabel(index + 1)}. ${scenario.checks[index].title}`);
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
        panelClassName="hero"
        eyebrow={chrome.eyebrow && <p className="heroEyebrow">{chrome.eyebrow}</p>}
        afterHeading={<p className="heroSub">{chrome.introSub}</p>}
        panelEnd={
          <img
            className="heroImg"
            src={teacherImg}
            alt={chrome.heroImgAlt ?? chrome.teacherImgAlt}
          />
        }
      >
        {fellBack && (
          <Alert type="info" size="s" isImmediateImportance={false} text={chrome.fallbackNote} />
        )}

        {chrome.introTeacherLine && (
          <Dialogue speaker={chrome.teacherName}>{chrome.introTeacherLine}</Dialogue>
        )}

        {chrome.scenarioCard && (
          <section className="card noPad">
            <Box
              sx={{bgcolor: '#000', color: '#fff', px: 2.25, py: 1.25}}
              className="blackStrip"
            >
              <span className="blackStripLabel">{chrome.scenarioCard.label}</span>
              <span className="blackStripTitle">{chrome.scenarioCard.header}</span>
            </Box>
            <div className="scenarioBody">
              <img
                className="scenarioImg"
                src={studentImg}
                alt={chrome.scenarioCard.imgAlt ?? chrome.studentImgAlt}
              />
              <div>
                <Dialogue speaker={chrome.scenarioCard.studentLabel}>
                  {chrome.scenarioCard.quote}
                </Dialogue>
                <Typography semanticTag="p" visualAppearance="body-two" noMargin>
                  {chrome.scenarioCard.body}
                </Typography>
              </div>
            </div>
          </section>
        )}

        <div className="codeDark" role="group" aria-label="Alex's loop code">
          <div className="codeDarkHeader" aria-hidden="true">
            <span className="ideDot ideDotR" />
            <span className="ideDot ideDotY" />
            <span className="ideDot ideDotG" />
            <span className="codeDarkLabel">script.js — Alex's AI-generated loop</span>
          </div>
          <div className="codeDarkBody">
            {CODE_PREVIEW_LINES.map((line, i) => (
              <div key={i} className="codeLine">
                {renderLine(line, `preview-${i}`)}
              </div>
            ))}
          </div>
        </div>

        <section className="card">
          <Typography semanticTag="h2" visualAppearance="heading-sm">
            {chrome.missionHeading}
          </Typography>
          {chrome.missionSteps && (
            <ol className="missionSteps">
              {chrome.missionSteps.map((step, i) => (
                <li key={step}>
                  <Chip
                    avatar={
                      <Avatar
                        sx={{
                          width: 20,
                          height: 20,
                          fontSize: '0.65rem',
                          fontWeight: 900,
                          bgcolor: 'primary.main',
                          color: '#fff',
                        }}
                      >
                        {i + 1}
                      </Avatar>
                    }
                    label={step}
                    sx={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      bgcolor: 'var(--background-neutral-secondary)',
                      border: '1.5px solid var(--border-neutral-secondary)',
                    }}
                  />
                </li>
              ))}
            </ol>
          )}
          <hr className="hairline" />
          <Typography semanticTag="p" visualAppearance="body-two" noMargin>
            {chrome.missionText}
          </Typography>
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
              <span className="progressCheckLabel">
                {progressLabel(checkIndex + 1)} — {scenario.checks[checkIndex].title}
              </span>
              <span className="progressUnitLabel">{chrome.unitTag}</span>
              <LinearProgress
                aria-hidden="true"
                variant="determinate"
                value={((checkIndex + 1) / scenario.checks.length) * 100}
                className="progressTrack"
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
            checkIndex={checkIndex}
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
