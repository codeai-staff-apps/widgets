import Alert from '@code-dot-org/component-library/alert';
import Button from '@code-dot-org/component-library/button';
import Typography from '@code-dot-org/component-library/typography';
import LinearProgress from '@mui/material/LinearProgress';
import {useState} from 'react';

import {ACTION_ID, BANK_ID, BRIDGE_NOTE, PART_ID, TERMS, ZONE_HINT, ZONE_NAMES} from './data';
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
  const board = useSelectAndPlace({
    items: TERMS.map(term => ({id: term.id, label: term.label})),
    containers: Object.entries(ZONE_NAMES).map(([id, label]) => ({id, label})),
    bankId: BANK_ID,
  });
  const [result, setResult] = useState<Result | null>(null);

  const placed = TERMS.filter(term => board.containerOf(term.id) !== BANK_ID).length;

  const check = () => {
    board.select(null);
    const byId = Object.fromEntries(
      TERMS.map(term => [term.id, board.containerOf(term.id) === term.zone]),
    );
    const correct = Object.values(byId).filter(Boolean).length;
    setResult({correct, byId});
    announce(`${correct} of ${TERMS.length} placed correctly.`);
  };

  const reset = () => {
    board.reset();
    setResult(null);
    announce('Board reset. All terms returned to the bank.');
  };

  /** Categories that hold at least one misplaced term, in the order they appear. */
  const zonesWithErrors = [ACTION_ID, PART_ID].filter(zoneId =>
    board.itemsIn(zoneId).some(id => result && !result.byId[id]),
  );

  return (
    <main className="page">
      <Typography semanticTag="h1" visualAppearance="heading-lg" noMargin>
        Sort: Actions or Parts of the Page?
      </Typography>
      <Typography semanticTag="p" visualAppearance="body-one">
        Select a term below, then choose the category it belongs to. Place all eight before
        checking your answers.
      </Typography>
      <Typography semanticTag="p" visualAppearance="body-two">
        You can also drag a term onto a category, or select a placed term and put it back in the
        bank.
      </Typography>

      <Tray containerId={BANK_ID} title={ZONE_NAMES[BANK_ID]} board={board} results={result?.byId} />

      <div className="zones">
        <Tray
          containerId={ACTION_ID}
          title={ZONE_NAMES[ACTION_ID]}
          board={board}
          results={result?.byId}
        />
        <Tray
          containerId={PART_ID}
          title={ZONE_NAMES[PART_ID]}
          board={board}
          results={result?.byId}
        />
      </div>

      <Typography semanticTag="p" visualAppearance="body-two" noMargin>
        {placed} of {TERMS.length} placed
      </Typography>
      <LinearProgress
        aria-hidden="true" // the count above carries the same information as text
        variant="determinate"
        value={(placed / TERMS.length) * 100}
        sx={{marginTop: 1}}
      />

      <div className="actions">
        <Button
          text="Check answers"
          color="purple"
          disabled={placed < TERMS.length || result !== null}
          onClick={check}
        />
        <Button text="Reset" type="secondary" color="black" onClick={reset} />
      </div>

      {result && (
        <div className="hints">
          <Typography semanticTag="p" visualAppearance="heading-md" noMargin>
            {result.correct} of {TERMS.length} placed correctly.
          </Typography>
          {zonesWithErrors.map(zoneId => (
            <Note key={zoneId} type="warning" text={`${ZONE_NAMES[zoneId]} — ${ZONE_HINT}`} />
          ))}
          {result.correct === TERMS.length && <Note type="success" text={BRIDGE_NOTE} />}
        </div>
      )}
    </main>
  );
}
