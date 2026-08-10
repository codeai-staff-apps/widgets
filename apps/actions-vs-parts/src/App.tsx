import Alert from '@code-dot-org/component-library/alert';
import Button from '@code-dot-org/component-library/button';
import Typography from '@code-dot-org/component-library/typography';
import LinearProgress from '@mui/material/LinearProgress';
import {useState} from 'react';

import {ACTION_ID, BANK_ID, BRIDGE_NOTE, PART_ID, TERMS, ZONE_NAMES} from './data';
import './sort.css';
import {useAnnounce, useSelectAndPlace} from './shared';
import Zone from './Zone';

/** Where every term sits, so a grade can be discarded once the board moves on. */
const signatureOf = (board: ReturnType<typeof useSelectAndPlace>) =>
  TERMS.map(term => board.containerOf(term.id)).join('|');

export default function App() {
  const announce = useAnnounce();
  const board = useSelectAndPlace({
    items: TERMS.map(term => ({id: term.id, label: term.label})),
    containers: Object.entries(ZONE_NAMES).map(([id, label]) => ({id, label})),
    bankId: BANK_ID,
  });
  const [checked, setChecked] = useState<{signature: string; correct: number} | null>(null);

  // The original left its marks on screen while the board kept changing; drop
  // them instead of showing a grade that no longer describes the board.
  const result = checked?.signature === signatureOf(board) ? checked : null;

  const bankIds = board.itemsIn(BANK_ID);
  const placed = TERMS.length - bankIds.length;

  const gradeOf = (zoneId: string) => {
    if (!result) {
      return undefined;
    }
    const ids = board.itemsIn(zoneId);
    if (ids.length === 0) {
      return undefined;
    }
    return ids.every(id => TERMS.find(term => term.id === id)?.zone === zoneId)
      ? ('correct' as const)
      : ('incorrect' as const);
  };

  const check = () => {
    board.select(null);
    const correct = TERMS.filter(term => board.containerOf(term.id) === term.zone).length;
    setChecked({signature: signatureOf(board), correct});
    announce(`${correct} of ${TERMS.length} placed correctly.`);
  };

  const reset = () => {
    board.reset();
    setChecked(null);
    announce('Board reset. All terms returned to the bank.');
  };

  return (
    <main className="page">
      <Typography semanticTag="h1" visualAppearance="heading-lg" noMargin>
        Sort: Actions or Parts of the Page?
      </Typography>
      <Alert
        isImmediateImportance={false}
        aria-live="off"
        showIcon={false}
        type="info"
        text="Click a term below, then click the category it belongs to. Place all eight before checking your answers."
      />

      <LinearProgress
        variant="determinate"
        value={(placed / TERMS.length) * 100}
        aria-label={`${placed} of ${TERMS.length} terms placed`}
        sx={{margin: '20px 0'}}
      />

      <div className="bank" aria-label="Unsorted terms" role="group">
        {bankIds.map(id => (
          <button {...board.getItemProps(id)} key={id} className="chip chip--pickable">
            {TERMS.find(term => term.id === id)?.label}
          </button>
        ))}
      </div>

      <div className="zones">
        <Zone
          containerId={ACTION_ID}
          title={ZONE_NAMES[ACTION_ID]}
          board={board}
          graded={gradeOf(ACTION_ID)}
        />
        <Zone
          containerId={PART_ID}
          title={ZONE_NAMES[PART_ID]}
          board={board}
          graded={gradeOf(PART_ID)}
        />
      </div>

      <div className="actions">
        <Button text="Check answers" color="purple" onClick={check} />
        <Button text="Reset" type="secondary" color="black" onClick={reset} />
      </div>

      {result && (
        <div className="results">
          <Alert
            isImmediateImportance={false}
            aria-live="off"
            showIcon={false}
            type="info"
            text={`${result.correct} of ${TERMS.length} placed correctly.`}
          />
          {result.correct === TERMS.length && (
            <Alert
              isImmediateImportance={false}
              aria-live="off"
              showIcon={false}
              type="success"
              text={BRIDGE_NOTE}
            />
          )}
        </div>
      )}
    </main>
  );
}
