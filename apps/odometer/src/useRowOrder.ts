import {KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent} from '@dnd-kit/core';
import {arrayMove, sortableKeyboardCoordinates} from '@dnd-kit/sortable';
import {useState} from 'react';

import {copy} from './copy';
import {useAnnounce} from './shared';

export type RowId = 'binary' | 'octal' | 'decimal' | 'hexadecimal' | 'custom';

const DEFAULT_ORDER: RowId[] = ['binary', 'octal', 'decimal', 'hexadecimal', 'custom'];

/**
 * Where `activeId` lands if dropped on `overId`, and what 1-based position to
 * announce it at — or `null` if dropped back where it started (no reorder, no
 * announcement). This is the one bit of reorder math dnd-kit doesn't already
 * give us (it hands back `active`/`over`, not "did anything change"), so it's
 * kept as a small pure, unit-tested wrapper around dnd-kit's own `arrayMove`
 * rather than a hand-rolled splice.
 */
export function computeReorder(
  order: readonly RowId[],
  activeId: RowId,
  overId: RowId,
): {order: RowId[]; position: number} | null {
  if (activeId === overId) {
    return null;
  }
  const from = order.indexOf(activeId);
  const to = order.indexOf(overId);
  const next = arrayMove(order as RowId[], from, to);
  return {order: next, position: next.indexOf(activeId) + 1};
}

/**
 * Row display order, plus drag-to-reorder via dnd-kit — the original
 * widget's rows were draggable (jQuery-UI) but had no keyboard path.
 * `@dnd-kit/core`'s pointer sensor covers touch as well as mouse, and its
 * keyboard sensor (`sortableKeyboardCoordinates`, from `@dnd-kit/sortable`)
 * is the keyboard equivalent: focus a row's handle, Space to lift, Up/Down
 * to move, Space to drop, Escape to cancel.
 */
export function useRowOrder(labelOf: (id: RowId) => string) {
  const announce = useAnnounce();
  const [order, setOrder] = useState<RowId[]>(DEFAULT_ORDER);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates}),
  );

  const onDragEnd = ({active, over}: DragEndEvent) => {
    if (!over) {
      return;
    }
    const result = computeReorder(order, active.id as RowId, over.id as RowId);
    if (!result) {
      return;
    }
    setOrder(result.order);
    announce(copy.reorderAnnounce(labelOf(active.id as RowId), result.position, result.order.length));
  };

  return {order, sensors, onDragEnd};
}
