import {useRef, useState, type KeyboardEvent, type PointerEvent} from 'react';

import {copy} from './copy';
import {useAnnounce} from './shared';

export type RowId = 'binary' | 'octal' | 'decimal' | 'hexadecimal' | 'custom';

const DEFAULT_ORDER: RowId[] = ['binary', 'octal', 'decimal', 'hexadecimal', 'custom'];

/**
 * Moves `id` to index `to` within `ids`, clamping `to` to a valid index.
 * Returns a new array; `ids` is never mutated. Pure so drag/keyboard math is
 * unit-testable without a DOM.
 */
export function reorderIds<T>(ids: readonly T[], id: T, to: number): T[] {
  const clamped = Math.max(0, Math.min(to, ids.length - 1));
  const next = ids.filter(x => x !== id);
  next.splice(clamped, 0, id);
  return next;
}

/**
 * Which slot a pointer at `y` should drop into, given each row's current
 * vertical midpoint (top + height / 2) in on-screen order: the first row
 * whose midpoint is below `y`, or the last row if `y` is below all of them.
 * Reading straight from the rows' real, current bounding boxes on every move
 * (rather than a cumulative "moved half a row" threshold) means a drag never
 * overshoots the row the cursor is actually over.
 */
export function dropIndexForY(y: number, rowMidpoints: readonly number[]): number {
  // <=, not <: a pointer sitting exactly on a row's own midpoint (the common
  // case right after a mouse-up snaps it there, or a synthetic/test move)
  // must land on that row, not roll over to the next one.
  const index = rowMidpoints.findIndex(mid => y <= mid);
  return index === -1 ? rowMidpoints.length - 1 : index;
}

/**
 * Row display order, plus drag-to-reorder and its keyboard equivalent — the
 * original widget's rows were draggable but had no keyboard path.
 *
 * Dragging uses pointer events (not HTML5 drag-and-drop, which never fires
 * from a touch tap) on each row's handle: every move, it re-measures the
 * rows' bounding boxes and drops the dragged row into whichever slot the
 * cursor is over (see `dropIndexForY`). The same handle takes Up/Down arrow
 * keys. A ref shadows the order state so both paths always read the latest
 * order, even mid-drag before React re-renders.
 */
export function useRowOrder(labelOf: (id: RowId) => string) {
  const announce = useAnnounce();
  const [order, setOrder] = useState<RowId[]>(DEFAULT_ORDER);
  const orderRef = useRef(order);
  orderRef.current = order;
  const [draggingId, setDraggingId] = useState<RowId | null>(null);
  const dragId = useRef<RowId | null>(null);

  const reorder = (id: RowId, to: number) => {
    const ids = orderRef.current;
    const from = ids.indexOf(id);
    const next = reorderIds(ids, id, to);
    const landedAt = next.indexOf(id);
    if (landedAt === from) {
      return;
    }
    orderRef.current = next;
    setOrder(next);
    announce(copy.reorderAnnounce(labelOf(id), landedAt + 1, next.length));
  };

  const moveRow = (id: RowId, delta: number) => {
    const from = orderRef.current.indexOf(id);
    reorder(id, from + delta);
  };

  const onHandlePointerDown = (id: RowId) => (e: PointerEvent<HTMLButtonElement>) => {
    const rowsEl = e.currentTarget.closest('.odoRows');
    if (!(rowsEl instanceof HTMLElement)) {
      return;
    }
    dragId.current = id;
    setDraggingId(id);

    const onMove = (move: globalThis.PointerEvent) => {
      if (!dragId.current) {
        return;
      }
      const midpoints = Array.from(rowsEl.children).map(row => {
        const rect = row.getBoundingClientRect();
        return rect.top + rect.height / 2;
      });
      reorder(dragId.current, dropIndexForY(move.clientY, midpoints));
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      dragId.current = null;
      setDraggingId(null);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  const onHandleKeyDown = (id: RowId) => (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveRow(id, -1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveRow(id, 1);
    }
  };

  return {order, draggingId, onHandlePointerDown, onHandleKeyDown};
}
