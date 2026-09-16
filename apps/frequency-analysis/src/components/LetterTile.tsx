import Typography from '@code-dot-org/component-library/typography';
import {useDraggable} from '@dnd-kit/core';
import type {CSSProperties} from 'react';

import {strings} from '../strings';

export interface LetterTileProps {
  /** The plaintext letter this tile represents. Also its drag id (`tile-<letter>`). */
  letter: string;
  /** The ciphertext letter this tile is currently assigned to, if any (undefined while unassigned). */
  cipherLetter?: string;
  /**
   * True for the floating copy rendered in the `DragOverlay`: same look, but
   * not itself a drag source and hidden from assistive tech (the real tile
   * underneath keeps the id, the focus and the accessible name).
   */
  presentational?: boolean;
}

/** A draggable letter chip: pointer/touch drag via dnd-kit, or keyboard (space/enter + arrows). */
export default function LetterTile({letter, cipherLetter, presentational}: LetterTileProps) {
  const {attributes, listeners, setNodeRef, isDragging} = useDraggable({
    id: presentational ? `overlay-${letter}` : `tile-${letter}`,
    disabled: presentational,
  });

  const style: CSSProperties = {touchAction: 'none'};
  const label = cipherLetter ? strings.slotFilledLabel(cipherLetter, letter) : strings.tileLabel(letter);

  return (
    <button
      type="button"
      ref={presentational ? undefined : setNodeRef}
      style={style}
      className="freq-tile"
      data-state={isDragging ? 'dragging' : cipherLetter ? 'assigned' : 'unassigned'}
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
