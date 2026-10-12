import {useEffect, useRef, useState, type CSSProperties, type PointerEvent} from 'react';

import {useAnnounce} from './LiveAnnouncer';

/**
 * Click an item to select it, then click a target to place it — the accessible
 * replacement for HTML5 drag-and-drop, which has no keyboard path and does not
 * fire from a touch tap.
 *
 *   const board = useSelectAndPlace({items: CHIPS, containers: ZONES, bankId: 'bank'});
 *   <button {...board.getItemProps('win')}>message = "You win!"</button>
 *   <button {...board.getTargetProps('dz-win')}>{…}</button>
 *
 * Items and targets must be real `<button>`s, which gives Enter/Space and the
 * tab order for free. Pointer drag is wired on top of the same place/remove
 * calls, so mouse and touch users can drag but never have to. Escape and a
 * click outside clear the selection. Placements and removals announce
 * themselves; scoring and reset messages are the app's to announce.
 */

export interface SelectAndPlaceItem {
  id: string;
  /** Spoken in announcements, e.g. `message = "You win!"`. */
  label: string;
}

export interface SelectAndPlaceContainer {
  id: string;
  /** Spoken in announcements and used as the target's accessible name, e.g. "Yes branch, before You Win". */
  label: string;
  /** Placing into a full container evicts an occupant back to the bank. Unlimited by default. */
  capacity?: number;
}

export interface SelectAndPlaceOptions {
  items: readonly SelectAndPlaceItem[];
  containers: readonly SelectAndPlaceContainer[];
  /** Container the items start in and return to. Must appear in `containers`. */
  bankId: string;
}

/** Pixels the pointer must travel before a press counts as a drag rather than a click. */
const DRAG_THRESHOLD_PX = 8;

const itemStyle: CSSProperties = {
  // WCAG 2.5.8 floor, and touch-action so a touch drag does not scroll the page.
  minWidth: 44,
  minHeight: 44,
  touchAction: 'none',
};

const targetStyle: CSSProperties = {minWidth: 44, minHeight: 44};

export function useSelectAndPlace({items, containers, bankId}: SelectAndPlaceOptions) {
  const announce = useAnnounce();

  const initial = () =>
    Object.fromEntries(containers.map(c => [c.id, c.id === bankId ? items.map(i => i.id) : []]));

  const [contents, setContents] = useState<Record<string, string[]>>(initial);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Refs mirror state so the handlers below can read the current board and fire
  // announcements outside of a state updater (StrictMode runs those twice).
  const contentsRef = useRef(contents);
  contentsRef.current = contents;
  const selectedRef = useRef(selectedId);
  selectedRef.current = selectedId;

  const labelOfItem = (id: string) => items.find(i => i.id === id)?.label ?? id;
  const container = (id: string) => containers.find(c => c.id === id);
  const containerOf = (itemId: string) =>
    Object.keys(contentsRef.current).find(c => contentsRef.current[c].includes(itemId)) ?? bankId;

  const select = (itemId: string | null) => {
    selectedRef.current = itemId;
    setSelectedId(itemId);
  };

  const relocate = (itemId: string, containerId: string, index?: number) => {
    const next: Record<string, string[]> = {};
    Object.entries(contentsRef.current).forEach(([id, ids]) => {
      next[id] = ids.filter(id_ => id_ !== itemId);
    });

    const target = next[containerId];
    target.splice(index ?? target.length, 0, itemId);

    const capacity = container(containerId)?.capacity ?? Infinity;
    const evicted = target.filter(id => id !== itemId).slice(0, Math.max(0, target.length - capacity));
    next[containerId] = target.filter(id => !evicted.includes(id));
    next[bankId] = [...next[bankId], ...evicted];

    contentsRef.current = next;
    setContents(next);
    select(null);
  };

  /** Moves `itemId` into `containerId`, evicting to the bank if that fills it. */
  const place = (itemId: string, containerId: string, index?: number) => {
    relocate(itemId, containerId, index);
    announce(`${labelOfItem(itemId)} placed in ${container(containerId)?.label ?? containerId}.`);
  };

  /** Returns an item to the bank. */
  const remove = (itemId: string) => {
    const from = container(containerOf(itemId))?.label ?? '';
    relocate(itemId, bankId);
    announce(`${labelOfItem(itemId)} removed from ${from}.`);
  };

  /** Reorders an item within its own container — wire this to Up/Down buttons. */
  const move = (itemId: string, delta: number) => {
    const containerId = containerOf(itemId);
    const ids = contentsRef.current[containerId];
    const to = ids.indexOf(itemId) + delta;
    if (to < 0 || to >= ids.length) {
      return;
    }
    const next = {...contentsRef.current, [containerId]: ids.filter(id => id !== itemId)};
    next[containerId].splice(to, 0, itemId);
    contentsRef.current = next;
    setContents(next);
    announce(`${labelOfItem(itemId)} moved to position ${to + 1} of ${ids.length}.`);
  };

  const reset = () => {
    const next = initial();
    contentsRef.current = next;
    setContents(next);
    select(null);
  };

  // Escape and clicks outside the board clear the selection.
  useEffect(() => {
    if (!selectedId) {
      return;
    }
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element).closest('[data-sap-item],[data-sap-target]')) {
        select(null);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && select(null);
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedId]);

  // Pointer drag: an enhancement over clicking, sharing the same place() call.
  const drag = useRef<{itemId: string; x: number; y: number; moved: boolean} | null>(null);
  const dragEnded = useRef(false);

  const onPointerDown = (itemId: string) => (e: PointerEvent<HTMLElement>) => {
    drag.current = {itemId, x: e.clientX, y: e.clientY, moved: false};

    const onMove = (move_: globalThis.PointerEvent) => {
      const d = drag.current;
      if (d && !d.moved && Math.hypot(move_.clientX - d.x, move_.clientY - d.y) > DRAG_THRESHOLD_PX) {
        d.moved = true;
        select(d.itemId);
      }
    };
    const onUp = (up: globalThis.PointerEvent) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      const d = drag.current;
      drag.current = null;
      if (!d?.moved) {
        return;
      }
      // A drag ends with a click event on the common ancestor; swallow it so it
      // does not immediately toggle the selection back off.
      dragEnded.current = true;
      window.setTimeout(() => (dragEnded.current = false), 0);

      const dropped = document
        .elementFromPoint(up.clientX, up.clientY)
        ?.closest<HTMLElement>('[data-sap-target]');
      if (dropped?.dataset.sapTarget) {
        const index = dropped.dataset.sapIndex;
        place(d.itemId, dropped.dataset.sapTarget, index === undefined ? undefined : Number(index));
      }
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  /** Props for an item's `<button>`. Merge your own `className`/`style` in. */
  const getItemProps = (itemId: string) => ({
    type: 'button' as const,
    'aria-pressed': selectedId === itemId,
    'data-sap-item': itemId,
    style: itemStyle,
    onPointerDown: onPointerDown(itemId),
    onClick: () => {
      if (dragEnded.current) {
        return;
      }
      select(selectedRef.current === itemId ? null : itemId);
    },
  });

  /**
   * Props for a target's `<button>`. Pass `index` to make it an insertion slot
   * in an ordered container, and `label` to override the accessible name.
   */
  const getTargetProps = (containerId: string, opts: {index?: number; label?: string} = {}) => {
    const occupants = contents[containerId] ?? [];
    const base = container(containerId)?.label ?? containerId;
    const derived =
      opts.index !== undefined
        ? `${base}, position ${opts.index + 1}`
        : occupants.length === 0
          ? `${base}, empty`
          : `${base}: ${occupants.map(labelOfItem).join(', ')}`;

    return {
      type: 'button' as const,
      'aria-label': opts.label ?? derived,
      'data-sap-target': containerId,
      'data-sap-index': opts.index,
      style: targetStyle,
      onClick: () => {
        if (dragEnded.current) {
          return;
        }
        const selected = selectedRef.current;
        if (selected) {
          place(selected, containerId, opts.index);
        } else if ((container(containerId)?.capacity ?? Infinity) === 1 && occupants.length === 1) {
          remove(occupants[0]);
        }
      },
    };
  };

  return {
    selectedId,
    /** Item ids in a container, in order. */
    itemsIn: (containerId: string) => contents[containerId] ?? [],
    containerOf,
    select,
    place,
    remove,
    move,
    reset,
    getItemProps,
    getTargetProps,
  };
}
