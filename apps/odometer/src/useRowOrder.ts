import {useRef, useState, type KeyboardEvent, type PointerEvent} from 'react';

import {copy} from './copy';
import {useAnnounce} from './shared';

export type RowId = 'binary' | 'octal' | 'decimal' | 'hexadecimal' | 'custom';

const DEFAULT_ORDER: RowId[] = ['binary', 'octal', 'decimal', 'hexadecimal', 'custom'];

/**
 * Row display order, plus drag-to-reorder and its keyboard equivalent — the
 * original widget's rows were draggable but had no keyboard path.
 *
 * Dragging uses pointer events (not HTML5 drag-and-drop, which never fires
 * from a touch tap) on each row's handle: press and move past half a row's
 * height to swap. The same handle takes Up/Down arrow keys. A ref shadows
 * the order state so both paths always read the latest order, even mid-drag
 * before React re-renders.
 */
export function useRowOrder(labelOf: (id: RowId) => string) {
  const announce = useAnnounce();
  const [order, setOrder] = useState<RowId[]>(DEFAULT_ORDER);
  const orderRef = useRef(order);
  orderRef.current = order;
  const [draggingId, setDraggingId] = useState<RowId | null>(null);
  const drag = useRef<{id: RowId; y: number; rowHeight: number} | null>(null);

  const moveRow = (id: RowId, delta: number) => {
    const ids = orderRef.current;
    const from = ids.indexOf(id);
    const to = from + delta;
    if (to < 0 || to >= ids.length) {
      return;
    }
    const next = ids.filter(rowId => rowId !== id);
    next.splice(to, 0, id);
    orderRef.current = next;
    setOrder(next);
    announce(copy.reorderAnnounce(labelOf(id), to + 1, next.length));
  };

  const onHandlePointerDown = (id: RowId) => (e: PointerEvent<HTMLButtonElement>) => {
    const rowsEl = e.currentTarget.closest('.odoRows');
    if (!(rowsEl instanceof HTMLElement)) {
      return;
    }
    drag.current = {id, y: e.clientY, rowHeight: rowsEl.scrollHeight / orderRef.current.length};
    setDraggingId(id);

    const onMove = (move: globalThis.PointerEvent) => {
      const d = drag.current;
      if (!d || Math.abs(move.clientY - d.y) < d.rowHeight / 2) {
        return;
      }
      moveRow(d.id, move.clientY > d.y ? 1 : -1);
      d.y = move.clientY;
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      drag.current = null;
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
