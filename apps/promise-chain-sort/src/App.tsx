import Alert from '@code-dot-org/component-library/alert';
import Button from '@code-dot-org/component-library/button';
import Typography from '@code-dot-org/component-library/typography';
import {Fragment, useState} from 'react';

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

  // Picking up a step — by click, keyboard activation, or the first pointer-move
  // past the drag threshold — clears feedback the same way the original's
  // dragstart/touchstart handlers called clearFeedbackStyles().
  const pickUp = (step: Step) => {
    const {onPointerDown, onClick, ...rest} = board.getItemProps(step.id);
    return {
      ...rest,
      onPointerDown: (e: Parameters<typeof onPointerDown>[0]) => {
        setMarks(null);
        onPointerDown(e);
      },
      onClick: () => {
        setMarks(null);
        onClick();
      },
    };
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
        Drag the steps into timeline order, or move them with each step's up and down buttons.
        Then check your answer before moving on.
      </Typography>

      <ol className={board.selectedId ? 'steps steps--armed' : 'steps'}>
        <li className="slotRow">
          <button {...board.getTargetProps(STEPS_ID, {index: 0})} className="slot" />
        </li>
        {order.map((step, index) => (
          <Fragment key={step.id}>
            <li
              className={
                'step' +
                (marks ? (marks[step.id] ? ' step--right' : ' step--wrong') : '') +
                (board.selectedId === step.id ? ' step--picked' : '')
              }
            >
              <button {...pickUp(step)} className="handle" aria-label={`Pick up ${plainText(step)}`}>
                <span aria-hidden="true">⠿</span>
              </button>
              <span className="stepPosition" aria-hidden="true">
                {index + 1}
              </span>
              <span className="stepText">{renderSegments(step.segments)}</span>
              {marks && (
                <span className={marks[step.id] ? 'mark mark--right' : 'mark mark--wrong'}>
                  <span aria-hidden="true">{marks[step.id] ? '✓ ' : '✗ '}</span>
                  {marks[step.id] ? 'correct' : 'needs to move'}
                </span>
              )}
              <Button
                isIconOnly
                icon={{iconName: 'arrow-up', iconStyle: 'solid'}}
                type="secondary"
                color="black"
                size="l"
                ariaLabel={`Move ${plainText(step)} up`}
                onClick={() => move(step, -1)}
              />
              <Button
                isIconOnly
                icon={{iconName: 'arrow-down', iconStyle: 'solid'}}
                type="secondary"
                color="black"
                size="l"
                ariaLabel={`Move ${plainText(step)} down`}
                onClick={() => move(step, 1)}
              />
            </li>
            <li className="slotRow">
              <button {...board.getTargetProps(STEPS_ID, {index: index + 1})} className="slot" />
            </li>
          </Fragment>
        ))}
      </ol>

      <div className="actions">
        <Button
          text="Check Order"
          iconRight={{iconName: 'check', iconStyle: 'solid'}}
          color="purple"
          onClick={check}
        />
        <Button text="Reset" type="secondary" color="black" onClick={reset} />
      </div>

      {marks && (
        // Advisory only. The shared announcer is this app's one live region.
        <Alert
          isImmediateImportance={false}
          aria-live="off"
          type={allCorrect ? 'success' : 'warning'}
          text={allCorrect ? ALL_CORRECT : NOT_YET}
        />
      )}
    </main>
  );
}
