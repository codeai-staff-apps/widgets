import Alert from '@code-dot-org/component-library/alert';
import Button from '@code-dot-org/component-library/button';
import Typography from '@code-dot-org/component-library/typography';
import {useState} from 'react';

import {BANK_ID, CHIPS, ZONES} from './data';
import DropZone, {type Mark} from './DropZone';
import './flowchart.css';
import {useAnnounce, useSelectAndPlace} from './shared';

/** How long a wrong answer stays red before its chip goes back to the bank. */
const WRONG_RETURN_MS = 800;

const ALL_CORRECT = `Perfect! All ${ZONES.length} code blocks are correct. Great work!`;
const partialMessage = (correct: number) =>
  `${correct} out of ${ZONES.length} correct. Wrong answers returned — try again!`;

/** Marks are keyed by zone and chip, so a mark disappears when the zone changes hands. */
const markKey = (zoneId: string, itemId: string) => `${zoneId}:${itemId}`;

const Arrow = () => (
  <div className="arrow" aria-hidden="true">
    ↓
  </div>
);

export default function App() {
  const announce = useAnnounce();
  const board = useSelectAndPlace({
    items: CHIPS.map(chip => ({id: chip.id, label: chip.text})),
    containers: [
      {id: BANK_ID, label: 'the code bank'},
      ...ZONES.map(zone => ({id: zone.id, label: zone.label, capacity: 1})),
    ],
    bankId: BANK_ID,
  });
  const [marks, setMarks] = useState<Record<string, Mark>>({});
  const [score, setScore] = useState<number | null>(null);

  const markOf = (zoneId: string) => {
    const [itemId] = board.itemsIn(zoneId);
    return itemId ? marks[markKey(zoneId, itemId)] : undefined;
  };

  const placed = ZONES.filter(zone => board.itemsIn(zone.id).length > 0).length;

  const check = () => {
    board.select(null);

    const graded = ZONES.flatMap(zone => {
      const [itemId] = board.itemsIn(zone.id);
      return itemId ? [{zone, itemId, correct: itemId === zone.answer}] : [];
    });
    const wrong = graded.filter(entry => !entry.correct);
    const correct = graded.length - wrong.length;

    setMarks(prev => ({
      ...prev,
      ...Object.fromEntries(
        graded.map(
          entry => [markKey(entry.zone.id, entry.itemId), entry.correct ? 'correct' : 'wrong'] as const,
        ),
      ),
    }));
    setScore(correct);
    announce(correct === ZONES.length ? ALL_CORRECT : partialMessage(correct));

    if (wrong.length > 0) {
      window.setTimeout(() => {
        wrong.forEach(entry => board.remove(entry.itemId));
        setMarks(prev =>
          Object.fromEntries(Object.entries(prev).filter(([, mark]) => mark === 'correct')),
        );
      }, WRONG_RETURN_MS);
    }
  };

  const reset = () => {
    board.reset();
    setMarks({});
    setScore(null);
    announce('Board reset. All code chips returned to the code bank.');
  };

  return (
    <main className="page">
      <Typography semanticTag="h1" visualAppearance="heading-lg" noMargin>
        Flowchart → Code
      </Typography>
      <Typography semanticTag="p" visualAppearance="body-two">
        Unit 3 · Decision Making in Programs
      </Typography>
      <Typography semanticTag="p" visualAppearance="body-one">
        Click a code chip to select it, then click a drop zone to place it — or drag it directly.
      </Typography>

      <section aria-labelledby="bankHeading">
        <Typography semanticTag="h2" visualAppearance="heading-xs" id="bankHeading">
          Code bank
        </Typography>
        <div className="bank">
          {CHIPS.map(chip => (
            <button
              key={chip.id}
              {...board.getItemProps(chip.id)}
              className="chip"
              disabled={board.containerOf(chip.id) !== BANK_ID}
            >
              {chip.text}
            </button>
          ))}
        </div>
        <Typography semanticTag="p" visualAppearance="body-two">
          Progress: {placed} of {ZONES.length} placed
        </Typography>
      </section>

      <section aria-labelledby="chartHeading">
        <Typography semanticTag="h2" visualAppearance="heading-xs" id="chartHeading">
          Flowchart
        </Typography>
        <div className="chart">
          <div className="node oval">Playing Game</div>
          <Arrow />
          <DropZone zone={ZONES[0]} board={board} mark={markOf('dz-start')} />
          <Arrow />
          <div className="node diamond">Is score &gt; 100?</div>
          <DropZone zone={ZONES[1]} board={board} mark={markOf('dz-condition')} />
          <div className="branches">
            <div className="branch">
              <div className="branchLabel">Yes</div>
              <Arrow />
              <DropZone zone={ZONES[2]} board={board} mark={markOf('dz-win')} />
              <Arrow />
              <div className="node terminal terminal--win">
                <span aria-hidden="true">🏆</span> You Win!
              </div>
            </div>
            <div className="branch">
              <div className="branchLabel">No</div>
              <Arrow />
              <DropZone zone={ZONES[3]} board={board} mark={markOf('dz-else')} />
              <Arrow />
              <DropZone zone={ZONES[4]} board={board} mark={markOf('dz-keep')} />
              <Arrow />
              <div className="node terminal terminal--keep">
                <span aria-hidden="true">🔁</span> Keep Trying
              </div>
            </div>
          </div>
          <Arrow />
          <DropZone zone={ZONES[5]} board={board} mark={markOf('dz-end')} />
        </div>
      </section>

      <div className="actions">
        <Button text="Check answers" color="purple" onClick={check} />
        <Button text="Reset" type="secondary" color="black" onClick={reset} />
      </div>

      {score !== null && (
        // Advisory only. The shared announcer is this app's one live region, so
        // this banner must not also speak the result.
        <Alert
          isImmediateImportance={false}
          aria-live="off"
          type={score === ZONES.length ? 'success' : 'warning'}
          text={score === ZONES.length ? ALL_CORRECT : partialMessage(score)}
        />
      )}
    </main>
  );
}
