import Button from '@code-dot-org/component-library/button';
import Typography from '@code-dot-org/component-library/typography';

import {CHROME, SUMMARY} from './content/content';
import Dialogue from './Dialogue';
import {Screen, type ScreenMachine} from './shared';

/**
 * The protocol recap. The original marked all five rows "pass" at page load,
 * before the learner had answered anything; these rows report the run.
 */
export default function SummaryScreen({
  machine,
  id,
  results,
  onRestart,
}: {
  machine: ScreenMachine;
  id: string;
  results: (boolean | null)[];
  onRestart: () => void;
}) {
  return (
    <Screen machine={machine} id={id} heading={SUMMARY.title} headingTag="h1">
      <Typography semanticTag="p" visualAppearance="body-one">
        {SUMMARY.sub}
      </Typography>
      <Dialogue speaker={CHROME.teacherName}>{SUMMARY.teacherLine}</Dialogue>

      <ul className="recap">
        {SUMMARY.steps.map((row, i) => (
          <li key={row.name} className="card">
            <Typography semanticTag="h2" visualAppearance="heading-xs" noMargin>
              <span aria-hidden="true">{row.icon} </span>
              {row.name}
            </Typography>
            <Typography semanticTag="p" visualAppearance="body-three" noMargin>
              {row.note}
            </Typography>
            <p className="recapVerdict">{results[i] ? CHROME.stepDone : CHROME.stepRetry}</p>
          </li>
        ))}
      </ul>

      <section className="card">
        <Typography semanticTag="p" visualAppearance="body-two" noMargin>
          {SUMMARY.takeaway}
        </Typography>
      </section>

      <div>
        <Button type="primary" color="purple" text={SUMMARY.btnRestart} onClick={onRestart} />
      </div>
    </Screen>
  );
}
