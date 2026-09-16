import Typography from '@code-dot-org/component-library/typography';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  pointerWithin,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type Announcements,
  type CollisionDetection,
  type DragEndEvent,
  type KeyboardCoordinateGetter,
} from '@dnd-kit/core';
import {useMemo, useState} from 'react';
import {createPortal} from 'react-dom';

import type {Assignments} from '../cipher';
import {LANGUAGE} from '../language';
import {strings} from '../strings';
import type {FrequencyAnalysis} from '../useFrequencyAnalysis';

import LetterTile from './LetterTile';

/*
 * These pixel values must match the `--freq-*` custom properties in
 * `frequencyAnalysis.css`: the CSS grid lays the placeholders out, and this
 * file positions the (separately absolutely-positioned) tiles on top of
 * them, so the two have to agree on the same geometry.
 */
const GUTTER = 96;
const COL = 40;
const ROW_H = 44;
const TILE_SIZE = 36;
const TILE_PAD = (COL - TILE_SIZE) / 2;

const pct = (fraction: number) => `${Math.round(fraction * 100)}%`;

const letterFromTileId = (id: string) => id.replace(/^tile-/, '');

const describeDropTarget = (id: string) => {
  if (id.startsWith('slot-')) {
    return `the slot for ${id.slice('slot-'.length)}`;
  }
  if (id.startsWith('unassigned-')) {
    return `the unassigned position for ${id.slice('unassigned-'.length)}`;
  }
  return id;
};

/**
 * dnd-kit's own drag-in-progress narration (pick up / move over / cancel).
 * The outcome of a drop ("B now maps to T") is announced separately, by
 * `useFrequencyAnalysis`'s actions, through the app's own live region — so
 * `onDragEnd` here stays silent to avoid a double announcement.
 */
const dndAnnouncements: Announcements = {
  onDragStart: ({active}) => `Picked up letter ${letterFromTileId(String(active.id))}.`,
  onDragOver: ({active, over}) =>
    over
      ? `Letter ${letterFromTileId(String(active.id))} is over ${describeDropTarget(String(over.id))}.`
      : `Letter ${letterFromTileId(String(active.id))} is not over a drop target.`,
  onDragEnd: () => '',
  onDragCancel: ({active}) => `Cancelled. Letter ${letterFromTileId(String(active.id))} was not moved.`,
};

/** Pointer drops land on whatever placeholder the cursor is over; falling
 * back to `closestCenter` keeps keyboard moves (which jump straight to a
 * placeholder's rect) and any pointer edge case resolving to *some* target. */
const collisionDetection: CollisionDetection = args => {
  const pointerCollisions = pointerWithin(args);
  return pointerCollisions.length > 0 ? pointerCollisions : closestCenter(args);
};

interface BoardPosition {
  row: 'slot' | 'unassigned';
  index: number;
}

function locate(letter: string, assignments: Assignments, columns: string[], bankOrder: string[]): BoardPosition {
  const cipherLetter = Object.keys(assignments).find(c => assignments[c] === letter);
  if (cipherLetter) {
    return {row: 'slot', index: columns.indexOf(cipherLetter)};
  }
  return {row: 'unassigned', index: bankOrder.indexOf(letter)};
}

function placeholderIdAt(position: BoardPosition, columns: string[], bankOrder: string[]): string | undefined {
  if (position.index < 0 || position.index > 25) {
    return undefined;
  }
  return position.row === 'slot' ? `slot-${columns[position.index]}` : `unassigned-${bankOrder[position.index]}`;
}

/**
 * One placeholder per arrow press: left/right move across columns within a
 * row, up/down jump between the Maps-to and Unassigned rows in the same
 * column. Mirrors the shape of `@dnd-kit/sortable`'s keyboard coordinate
 * getter (find the rect in the pressed direction, jump straight to it),
 * applied to our two placeholder rows instead of a sortable list.
 */
function createBoardCoordinateGetter(
  columns: string[],
  bankOrder: string[],
  assignments: Assignments,
): KeyboardCoordinateGetter {
  return (event, {active, currentCoordinates, context}) => {
    const letter = letterFromTileId(String(active));
    const from = locate(letter, assignments, columns, bankOrder);

    let to: BoardPosition | undefined;
    switch (event.code) {
      case 'ArrowLeft':
        to = {row: from.row, index: from.index - 1};
        break;
      case 'ArrowRight':
        to = {row: from.row, index: from.index + 1};
        break;
      case 'ArrowUp':
        to = from.row === 'unassigned' ? {row: 'slot', index: from.index} : undefined;
        break;
      case 'ArrowDown':
        to = from.row === 'slot' ? {row: 'unassigned', index: from.index} : undefined;
        break;
      default:
        return undefined;
    }
    if (!to) {
      return undefined;
    }

    const targetId = placeholderIdAt(to, columns, bankOrder);
    const targetRect = targetId ? context.droppableRects.get(targetId) : undefined;
    const {collisionRect} = context;
    if (!targetRect || !collisionRect) {
      return undefined;
    }

    event.preventDefault();
    return {
      x: currentCoordinates.x + (targetRect.left - collisionRect.left),
      y: currentCoordinates.y + (targetRect.top - collisionRect.top),
    };
  };
}

interface PlaceholderProps {
  id: string;
  empty: boolean;
  emptyLabel: string;
}

/** A drop target: one per ciphertext column (Maps-to row) or per bank position (Unassigned row).
 * The tile that occupies it, if any, is rendered separately in the tile layer, on top. */
function Placeholder({id, empty, emptyLabel}: PlaceholderProps) {
  const {setNodeRef, isOver} = useDroppable({id});
  return (
    <div
      ref={setNodeRef}
      id={id}
      className="freq-placeholder"
      data-state={empty ? 'empty' : 'filled'}
      data-over={isOver || undefined}
      aria-label={empty ? emptyLabel : undefined}
      aria-hidden={empty ? undefined : true}
    />
  );
}

export interface BoardProps {
  analysis: FrequencyAnalysis;
}

/**
 * The whole board: a shared-scale frequency chart, the Original/Maps-to/
 * Unassigned letter rows, and the dnd-kit wiring that lets a learner drag
 * (or keyboard-move) a letter between them. See `frequencyAnalysis.css`
 * (`.freq-board`) for the grid this renders into.
 */
export default function Board({analysis}: BoardProps) {
  const {columns, bankOrder, frequencies, maxValue, assignments} = analysis;
  const [activeId, setActiveId] = useState<string | null>(null);

  const coordinateGetter = useMemo(
    () => createBoardCoordinateGetter(columns, bankOrder, assignments),
    [columns, bankOrder, assignments],
  );
  const sensors = useSensors(
    useSensor(PointerSensor, {activationConstraint: {distance: 8}}),
    useSensor(KeyboardSensor, {coordinateGetter}),
  );

  const assignedLetters = useMemo(() => new Set(Object.values(assignments)), [assignments]);

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const letter = letterFromTileId(String(event.active.id));
    const overId = event.over ? String(event.over.id) : undefined;
    if (!overId) {
      return;
    }

    if (overId.startsWith('slot-')) {
      analysis.placeGuess(letter, overId.slice('slot-'.length));
      return;
    }

    if (overId.startsWith('unassigned-')) {
      const other = overId.slice('unassigned-'.length);
      const otherIsUnassigned = !assignedLetters.has(other);
      const ownCipherLetter = Object.keys(assignments).find(c => assignments[c] === letter);
      if (otherIsUnassigned && ownCipherLetter) {
        // Case: a slot letter dropped onto an unassigned tile — they trade places.
        analysis.placeGuess(other, ownCipherLetter);
      } else {
        // Any other drop onto the Unassigned row just clears the dragged letter.
        analysis.sendToBank(letter);
      }
    }
  };

  const activeLetter = activeId ? letterFromTileId(activeId) : null;
  const activeCipherLetter = activeLetter
    ? Object.keys(assignments).find(c => assignments[c] === activeLetter)
    : undefined;

  return (
    <section className="freq-board-section" aria-label={strings.boardHeading}>
      <Typography semanticTag="h2" visualAppearance="heading-sm">
        {strings.boardHeading}
      </Typography>
      <ul className="freq-legend">
        <li className="freq-legend-item" data-series="message">
          <span className="freq-swatch" aria-hidden="true" />
          {strings.chartMessageSeries}
        </li>
        <li className="freq-legend-item" data-series="language">
          <span className="freq-swatch" aria-hidden="true" />
          {strings.standardLanguage(LANGUAGE.name)}
        </li>
      </ul>

      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={({active}) => setActiveId(String(active.id))}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
        accessibility={{announcements: dndAnnouncements}}
      >
        <div className="freq-board-scroll">
          <div className="freq-board">
            {/* Row 1: top bars, original vs. substituted, shared scale with row 7. */}
            <div className="freq-gutter-cell" aria-hidden="true" />
            {columns.map(cipherLetter => {
              const guess = assignments[cipherLetter];
              const messageFreq = frequencies[cipherLetter] ?? 0;
              const languageFreq = guess ? LANGUAGE.frequency[guess] ?? 0 : 0;
              return (
                <div className="freq-bar-cell" key={cipherLetter} aria-hidden="true">
                  <div
                    className="freq-bar"
                    data-series="message"
                    style={{height: `${(messageFreq / maxValue) * 100}%`}}
                  />
                  <div
                    className="freq-bar"
                    data-series="language"
                    data-empty={!guess || undefined}
                    style={{height: `${(languageFreq / maxValue) * 100}%`}}
                  />
                </div>
              );
            })}

            {/* Row 2: per-column % values for row 1 (the non-color cue for the bars above). */}
            <div className="freq-gutter-cell" aria-hidden="true" />
            {columns.map(cipherLetter => {
              const guess = assignments[cipherLetter];
              const messageFreq = frequencies[cipherLetter] ?? 0;
              const languageFreq = guess ? LANGUAGE.frequency[guess] ?? 0 : 0;
              return (
                <div className="freq-value-cell" key={cipherLetter}>
                  <span data-series="message">{pct(messageFreq)}</span>
                  <span data-series="language">{guess ? pct(languageFreq) : '–'}</span>
                </div>
              );
            })}

            {/* Row 3: Original — the ciphertext letters, not interactive. */}
            <div className="freq-gutter-cell">{strings.captionOriginal}</div>
            {columns.map(cipherLetter => (
              <div className="freq-original-cell" key={cipherLetter} data-notranslate>
                {cipherLetter}
              </div>
            ))}

            {/* Row 4: Maps to — one placeholder per ciphertext column. */}
            <div className="freq-gutter-cell">{strings.captionMapsTo}</div>
            {columns.map(cipherLetter => (
              <Placeholder
                key={cipherLetter}
                id={`slot-${cipherLetter}`}
                empty={!assignments[cipherLetter]}
                emptyLabel={strings.slotEmptyLabel(cipherLetter)}
              />
            ))}

            {/* Row 5: Unassigned — one placeholder per bank position. */}
            <div className="freq-gutter-cell">{strings.captionUnassigned}</div>
            {bankOrder.map((letter, index) => (
              <Placeholder
                key={letter}
                id={`unassigned-${letter}`}
                empty={assignedLetters.has(letter)}
                emptyLabel={strings.unassignedEmptyLabel(index + 1)}
              />
            ))}

            {/* Row 6: per-column % values for row 7. */}
            <div className="freq-gutter-cell" aria-hidden="true" />
            {bankOrder.map(letter => {
              const isAssigned = assignedLetters.has(letter);
              const languageFreq = isAssigned ? 0 : LANGUAGE.frequency[letter] ?? 0;
              return (
                <div className="freq-value-cell" key={letter}>
                  <span data-series="language">{isAssigned ? '–' : pct(languageFreq)}</span>
                </div>
              );
            })}

            {/* Row 7: bottom bars, hanging down from the shared baseline. */}
            <div className="freq-gutter-cell">{strings.captionFrequency}</div>
            {bankOrder.map(letter => {
              const isAssigned = assignedLetters.has(letter);
              const languageFreq = isAssigned ? 0 : LANGUAGE.frequency[letter] ?? 0;
              return (
                <div className="freq-bar-cell freq-bar-cell-hanging" key={letter} aria-hidden="true">
                  <div
                    className="freq-bar freq-bar-hanging"
                    data-series="language"
                    data-empty={isAssigned || undefined}
                    style={{height: `${(languageFreq / maxValue) * 100}%`}}
                  />
                </div>
              );
            })}

            {/* The tile layer: all 26 letters, always mounted, positioned by transform.
             * Painted last so tiles draw above the placeholders they sit on. */}
            <div className="freq-tile-layer">
              {LANGUAGE.letters.map(letter => {
                const cipherLetter = Object.keys(assignments).find(c => assignments[c] === letter);
                const columnIndex = cipherLetter ? columns.indexOf(cipherLetter) : bankOrder.indexOf(letter);
                const x = GUTTER + columnIndex * COL + TILE_PAD;
                const y = cipherLetter ? 0 : ROW_H;
                return (
                  <div key={letter} className="freq-tile-wrapper" style={{transform: `translate(${x}px, ${y}px)`}}>
                    <LetterTile letter={letter} cipherLetter={cipherLetter} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {createPortal(
          <DragOverlay dropAnimation={null}>
            {activeLetter ? (
              <LetterTile letter={activeLetter} cipherLetter={activeCipherLetter} presentational />
            ) : null}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </section>
  );
}
