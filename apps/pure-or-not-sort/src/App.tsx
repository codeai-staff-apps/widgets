import Alert from '@code-dot-org/component-library/alert';
import Button from '@code-dot-org/component-library/button';
import Typography from '@code-dot-org/component-library/typography';
import LinearProgress from '@mui/material/LinearProgress';
import {useState} from 'react';

import {
  ALL_CORRECT_HINT,
  BANK_ID,
  METHODS,
  PURE_ID,
  scoreMessage,
  shuffled,
  SIDE_ID,
  ZONE_NAMES,
} from './data';
import './sort.css';
import {useAnnounce, useSelectAndPlace} from './shared';
import Tray from './Tray';

interface Result {
  correct: number;
  byId: Record<string, boolean>;
}

/** Hints and the score read fine as plain text; the announcer does the speaking. */
const Note = ({type, text}: {type: 'success' | 'warning'; text: string}) => (
  <Alert isImmediateImportance={false} aria-live="off" showIcon={false} type={type} text={text} />
);

export default function App() {
  const announce = useAnnounce();
  const [items] = useState(() => shuffled(METHODS).map(method => ({id: method.id, label: method.label})));
  const board = useSelectAndPlace({
    items,
    containers: Object.entries(ZONE_NAMES).map(([id, label]) => ({id, label})),
    bankId: BANK_ID,
  });
  const [result, setResult] = useState<Result | null>(null);

  const placed = METHODS.filter(method => board.containerOf(method.id) !== BANK_ID).length;

  const check = () => {
    board.select(null);
    const byId = Object.fromEntries(
      METHODS.map(method => [method.id, board.containerOf(method.id) === method.zone]),
    );
    const correct = Object.values(byId).filter(Boolean).length;
    setResult({correct, byId});
    announce(
      `Answers checked. You got ${correct} out of ${METHODS.length} correct. ${scoreMessage(correct)}`,
    );
  };

  const reset = () => {
    board.reset();
    setResult(null);
    announce('Activity reset. All methods returned to the bank.');
  };

  const wrong = METHODS.filter(method => result && !result.byId[method.id]);
  const right = METHODS.filter(method => result?.byId[method.id]);

  return (
    <main className="page">
      <Typography semanticTag="h1" visualAppearance="heading-lg" noMargin>
        Pure or Not? Sorting What You Know
      </Typography>
      <Typography semanticTag="p" visualAppearance="body-one">
        Sort each method into the correct category — <strong>Pure / non-mutating</strong> or{' '}
        <strong>Has side effects</strong>. Use what you saw in the visualizer to guide you, then
        check your answers.
      </Typography>
      <Typography semanticTag="p" visualAppearance="body-two">
        Select a method, then choose a category. You can also drag a method onto a category.
      </Typography>

      <Tray containerId={BANK_ID} title={ZONE_NAMES[BANK_ID]} board={board} results={result?.byId} />

      <div className="zones">
        <Tray
          containerId={PURE_ID}
          title={ZONE_NAMES[PURE_ID]}
          glyph="◆"
          board={board}
          results={result?.byId}
        />
        <Tray
          containerId={SIDE_ID}
          title={ZONE_NAMES[SIDE_ID]}
          glyph="⚡"
          board={board}
          results={result?.byId}
        />
      </div>

      <Typography semanticTag="p" visualAppearance="body-two" noMargin>
        {placed} of {METHODS.length} placed
      </Typography>
      <LinearProgress
        aria-hidden="true" // the count above carries the same information as text
        variant="determinate"
        value={(placed / METHODS.length) * 100}
        sx={{marginTop: 1}}
      />

      <div className="actions">
        <Button
          text="Check answers"
          color="purple"
          disabled={placed < METHODS.length || result !== null}
          onClick={check}
        />
        <Button text="Reset" type="secondary" color="black" onClick={reset} />
      </div>

      {result && (
        <>
          <Typography semanticTag="p" visualAppearance="heading-md" noMargin>
            {result.correct} / {METHODS.length}
          </Typography>
          <Typography semanticTag="p" visualAppearance="body-two">
            {scoreMessage(result.correct)}
          </Typography>
          <div className="hints">
            {wrong.length === 0 ? (
              <Note type="success" text={ALL_CORRECT_HINT} />
            ) : (
              <>
                {wrong.map(method => (
                  <Note key={method.id} type="warning" text={`${method.label} — ${method.hint}`} />
                ))}
                {right.length > 0 && (
                  <Note
                    type="success"
                    text={`You got ${right.map(method => method.label).join(', ')} correct.`}
                  />
                )}
              </>
            )}
          </div>
        </>
      )}
    </main>
  );
}
