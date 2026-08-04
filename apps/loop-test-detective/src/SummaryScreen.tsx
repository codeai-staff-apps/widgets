import Button from '@code-dot-org/component-library/button';
import Typography from '@code-dot-org/component-library/typography';

import type {Chrome, Scenario} from './content/types';
import Dialogue from './Dialogue';
import {CodeBlock, Screen, type ScreenMachine} from './shared';

/**
 * The recap reports what the learner actually answered. Every English source
 * variant printed a fixed answer key here regardless of the run; only the
 * Spanish ones scored, and scoring is the behaviour worth keeping.
 */
export default function SummaryScreen({
  machine,
  id,
  chrome,
  scenario,
  answers,
  onRestart,
}: {
  machine: ScreenMachine;
  id: string;
  chrome: Chrome;
  scenario: Scenario;
  answers: (boolean | null)[];
  onRestart: () => void;
}) {
  const {checks, bugCallout} = scenario;
  const score = checks.filter((check, i) => answers[i] === check.correctIsIssue).length;
  const perfect = score === checks.length;

  return (
    <Screen machine={machine} id={id} heading={chrome.summaryTitle} headingTag="h1">
      {chrome.summaryEyebrow && (
        <Typography semanticTag="p" visualAppearance="overline-two">
          {chrome.summaryEyebrow}
        </Typography>
      )}
      <Typography semanticTag="p" visualAppearance="body-one">
        {chrome.summarySub}
      </Typography>

      <p className="score">
        <span className="scoreValue">
          {score} / {checks.length}
        </span>
        <span>{chrome.scoreLabel}</span>
      </p>

      {perfect && scenario.perfectMessage && (
        <Typography semanticTag="p" visualAppearance="body-one">
          {scenario.perfectMessage}
        </Typography>
      )}
      {!perfect && scenario.bugMessage && (
        <Typography semanticTag="p" visualAppearance="body-one">
          {scenario.bugMessage}
        </Typography>
      )}

      {bugCallout && (
        <section className="card">
          <Typography semanticTag="p" visualAppearance="overline-two">
            {bugCallout.label}
          </Typography>
          <Typography semanticTag="h2" visualAppearance="heading-sm">
            {bugCallout.title}
          </Typography>
          <div className="codeCompare">
            <CodeBlock>{`${bugCallout.aiLabel}\n${bugCallout.aiCode}\n${bugCallout.aiComment}`}</CodeBlock>
            <CodeBlock>{`${bugCallout.fixLabel}\n${bugCallout.fixCode}\n${bugCallout.fixComment}`}</CodeBlock>
          </div>
          <Typography semanticTag="p" visualAppearance="body-two">
            {bugCallout.explanation}
          </Typography>
        </section>
      )}

      {chrome.recapTitle && (
        <Typography semanticTag="h2" visualAppearance="heading-sm">
          {chrome.recapTitle}
        </Typography>
      )}
      <ul className="recap">
        {checks.map((check, i) => {
          const said = answers[i];
          const badge = check.correctIsIssue ? chrome.issueLabel : chrome.passLabel;
          return (
            <li key={check.title} className="card">
              <Typography semanticTag="h3" visualAppearance="heading-xs" noMargin>
                {check.title}
              </Typography>
              {said !== null && (
                <p className="recapVerdict">
                  <span>{said ? chrome.youSaidIssue : chrome.youSaidPasses}</span>
                  <span>
                    {said === check.correctIsIssue
                      ? chrome.verdictCorrect
                      : chrome.verdictIncorrect}
                  </span>
                  {badge && <span className="recapBadge">{badge}</span>}
                </p>
              )}
              {check.recapNote && (
                <Typography semanticTag="p" visualAppearance="body-three" noMargin>
                  {check.recapNote}
                </Typography>
              )}
            </li>
          );
        })}
      </ul>

      {chrome.takeaway && (
        <Dialogue speaker={chrome.takeaway.name}>{chrome.takeaway.quote}</Dialogue>
      )}

      {chrome.classroom && (
        <section className="card">
          <Typography semanticTag="h2" visualAppearance="heading-sm">
            {chrome.classroom.label}
          </Typography>
          <Typography semanticTag="p" visualAppearance="body-two" noMargin>
            {chrome.classroom.text}
          </Typography>
        </section>
      )}

      <div>
        <Button type="primary" color="purple" text={chrome.btnRestart} onClick={onRestart} />
      </div>
      {chrome.restartNote && (
        <Typography semanticTag="p" visualAppearance="body-three">
          {chrome.restartNote}
        </Typography>
      )}
    </Screen>
  );
}
