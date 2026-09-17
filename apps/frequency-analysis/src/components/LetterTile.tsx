import Typography from '@code-dot-org/component-library/typography';
import {useDraggable} from '@dnd-kit/core';
import type {CSSProperties} from 'react';

import {LANGUAGE} from '../language';
import {strings} from '../strings';

const pct = (fraction: number) => `${Math.round(fraction * 100)}%`;

export interface LetterTileProps {
  /** The plaintext letter this tile represents. Also its drag id (`tile-<letter>`). */
  letter: string;
  /** The ciphertext letter this tile is currently assigned to, if any (undefined while unassigned). */
  cipherLetter?: string;
  /** How often `cipherLetter` appears in the message, when this tile is assigned to a column
   * (undefined while unassigned) — folded into the accessible name so a screen-reader user gets
   * the letter and its frequency together instead of as two disconnected lists. */
  messageFrequency?: number;
  /**
   * True for the floating copy rendered in the `DragOverlay`: same look, but
   * not itself a drag source and hidden from assistive tech (the real tile
   * underneath keeps the id, the focus and the accessible name).
   */
  presentational?: boolean;
}

/** A draggable letter chip: pointer/touch drag via dnd-kit, or keyboard (space/enter + arrows). */
export default function LetterTile({letter, cipherLetter, messageFrequency, presentational}: LetterTileProps) {
  const {attributes, listeners, setNodeRef, isDragging} = useDraggable({
    id: presentational ? `overlay-${letter}` : `tile-${letter}`,
    disabled: presentational,
  });

  const style: CSSProperties = {touchAction: 'none'};
  const languageFrequency = LANGUAGE.frequency[letter] ?? 0;
  const label = cipherLetter
    ? strings.slotFilledLabel(cipherLetter, letter, pct(messageFrequency ?? 0), pct(languageFrequency))
    : strings.tileLabel(letter, pct(languageFrequency));

  return (
    <button
      type="button"
      ref={presentational ? undefined : setNodeRef}
      style={style}
      className="freq-tile"
      data-state={isDragging ? 'dragging' : cipherLetter ? 'assigned' : 'unassigned'}
      data-drag-overlay={presentational || undefined}
      aria-label={presentational ? undefined : label}
      aria-hidden={presentational || undefined}
      data-notranslate
      {...(presentational ? {tabIndex: -1} : listeners)}
      {...(presentational ? {} : attributes)}
    >
      <Typography semanticTag="span" visualAppearance="body-one" noMargin>
        {letter}
      </Typography>
    </button>
  );
}
