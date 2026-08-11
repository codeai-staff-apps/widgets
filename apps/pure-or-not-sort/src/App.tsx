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
const Note = ({type, text}: {type: 'success' | 'warning'; text: string | JSX.Element}) => (
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

  const scoreLabel = result
    ? scoreMessage(result.correct)
    : placed === 0
      ? 'place all methods to check'
      : placed < METHODS.length
        ? `${METHODS.length - placed} left to place`
        : 'ready — check your answers!';

  return (
    <main className="page">
      <Typography semanticTag="h1" visualAppearance="heading-lg" noMargin>
        Pure or Not? Sorting What You Know
      </Typography>
      <div className="directions" role="note" aria-label="Activity directions">
        <Typography semanticTag="p" visualAppearance="body-one" noMargin>
          Sort each method into the correct category — <strong>Pure / non-mutating</strong> or{' '}
          <strong>Has side effects</strong>. Use what you saw in the visualizer to guide you, then
          check your answers.
        </Typography>
      </div>
      <Typography semanticTag="p" visualAppearance="body-two">
        Select a method, then choose a category. You can also drag a method onto a category.
      </Typography>

      <Tray containerId={BANK_ID} title={ZONE_NAMES[BANK_ID]} board={board} results={result?.byId} />

      <div className="zones">
        <Tray
          containerId={PURE_ID}
          title={ZONE_NAMES[PURE_ID]}
          glyph="✦"
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
        sx={{
          marginTop: 1,
          height: 4,
          borderRadius: 2,
          bgcolor: 'var(--background-brand-purple-extra-light)',
        }}
      />

      <div className="bottomRow">
        <div className="scoreArea">
          <Typography semanticTag="p" visualAppearance="heading-md" noMargin className="scoreNum">
            {result ? `${result.correct} / ${METHODS.length}` : '—'}
          </Typography>
          <Typography semanticTag="p" visualAppearance="body-two" noMargin>
            {scoreLabel}
          </Typography>
        </div>
        <div className="actions">
          <Button text="Reset" type="secondary" color="black" onClick={reset} />
          <Button
            text="Check answers"
            color="purple"
            disabled={placed < METHODS.length || result !== null}
            onClick={check}
          />
        </div>
      </div>

      {result && (
        <div className="hints">
          {wrong.length === 0 ? (
            <Note type="success" text={ALL_CORRECT_HINT} />
          ) : (
            <>
              {wrong.map(method => (
                <Note
                  key={method.id}
                  type="warning"
                  text={
                    <>
                      <code>{method.label}</code> — {method.hint}
                    </>
                  }
                />
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
      )}
    </main>
  );
}
