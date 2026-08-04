import Alert from '@code-dot-org/component-library/alert';
import Button from '@code-dot-org/component-library/button';
import Typography from '@code-dot-org/component-library/typography';
import {useState} from 'react';

import {ALL_CORRECT, NOT_YET, plainText, STEPS, STEPS_ID, type Segment, type Step} from './data';
import './chain.css';
import {useAnnounce, useSelectAndPlace} from './shared';

const stepById = Object.fromEntries(STEPS.map(step => [step.id, step]));

const renderSegments = (segments: Segment[]) =>
  segments.map((segment, i) => {
    if (segment.code) {
      return <code key={i}>{segment.text}</code>;
    }
    if (segment.strong) {
      return <strong key={i}>{segment.text}</strong>;
    }
    return <span key={i}>{segment.text}</span>;
  });

/** Which steps sit in their timeline position, or null before the first check. */
type Marks = Record<string, boolean> | null;

export default function App() {
  const announce = useAnnounce();
  const board = useSelectAndPlace({
    items: STEPS.map(step => ({id: step.id, label: plainText(step)})),
    containers: [{id: STEPS_ID, label: 'the timeline'}],
    bankId: STEPS_ID,
  });
  const [marks, setMarks] = useState<Marks>(null);

  const order = board.itemsIn(STEPS_ID).map(id => stepById[id]);

  const move = (step: Step, delta: number) => {
    board.move(step.id, delta);
    setMarks(null);
  };

  const check = () => {
    const right: number[] = [];
    const wrong: number[] = [];
    const next: Record<string, boolean> = {};
    order.forEach((step, index) => {
      const ok = step.correctOrder === index + 1;
      next[step.id] = ok;
      (ok ? right : wrong).push(index + 1);
    });
    setMarks(next);
    announce(
      wrong.length === 0
        ? ALL_CORRECT
        : `${NOT_YET} In the right spot: ${right.join(', ') || 'none'}. Still out of order: ${wrong.join(', ')}.`,
    );
  };

  const reset = () => {
    board.reset();
    setMarks(null);
    announce('Order reset.');
  };

  const allCorrect = marks !== null && Object.values(marks).every(Boolean);

  return (
    <main className="page">
      <Typography semanticTag="h1" visualAppearance="heading-lg" noMargin>
        Mini Checkpoint
      </Typography>
      <Typography semanticTag="p" visualAppearance="body-one">
        Put the steps into timeline order with each step's up and down buttons. Then check your
        answer before moving on.
      </Typography>

      <ol className="steps">
        {order.map((step, index) => (
          <li key={step.id} className="step">
            <span className="stepPosition" aria-hidden="true">
              {index + 1}
            </span>
            <span className="stepText">{renderSegments(step.segments)}</span>
            {marks && (
              <span className={marks[step.id] ? 'mark mark--right' : 'mark mark--wrong'}>
                <span aria-hidden="true">{marks[step.id] ? '✓' : '✗'} </span>
                {marks[step.id] ? 'correct' : 'needs to move'}
              </span>
            )}
            <button
              type="button"
              className="moveButton"
              aria-label={`Move ${plainText(step)} up`}
              onClick={() => move(step, -1)}
            >
              <span aria-hidden="true">↑</span>
            </button>
            <button
              type="button"
              className="moveButton"
              aria-label={`Move ${plainText(step)} down`}
              onClick={() => move(step, 1)}
            >
              <span aria-hidden="true">↓</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="actions">
        <Button text="Check order" color="purple" onClick={check} />
        <Button text="Reset" type="secondary" color="black" onClick={reset} />
      </div>

      {marks && (
        // Advisory only. The shared announcer is this app's one live region.
        <Alert
          isImmediateImportance={false}
          aria-live="off"
          showIcon={false} // the design system's icons need FontAwesome, which the CSP blocks
          type={allCorrect ? 'success' : 'warning'}
          text={allCorrect ? ALL_CORRECT : NOT_YET}
        />
      )}
    </main>
  );
}
