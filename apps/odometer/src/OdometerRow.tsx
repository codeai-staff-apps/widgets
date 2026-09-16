import FontAwesomeV6Icon from '@code-dot-org/component-library/fontAwesomeV6Icon';
import Typography from '@code-dot-org/component-library/typography';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {useEffect, useRef, type CSSProperties} from 'react';

import {copy} from './copy';
import DigitCell from './DigitCell';
import {readOdometer} from './odometerMath';
import OverflowBadge from './OverflowBadge';
import type {RowId} from './useRowOrder';

export default function OdometerRow({
  id,
  label,
  radix,
  color,
  value,
  frac,
  onOverflowChange,
  position,
  total,
}: {
  id: RowId;
  label: string;
  radix: number;
  /** This row's wheel background — a design token or app-local CSS custom property. */
  color: string;
  value: number;
  frac: number;
  /** Fires only when this row's overflow state flips, so callers can announce it without spamming every tick. */
  onOverflowChange: (label: string, overflowing: boolean) => void;
  /** This row's place in the current order, 1-based, for the drag handle's accessible name. */
  position: number;
  total: number;
}) {
  // dnd-kit owns the drag/keyboard reordering interaction: `attributes` +
  // `listeners` make the handle a sortable activator (pointer and keyboard),
  // `setNodeRef`/`transform`/`transition` position this row while dragging.
  const {attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging} =
    useSortable({id});

  // Not memoized: `value` changes on every playback tick anyway, so the
  // memo would never hit and this stays cheap without it.
  const reading = readOdometer(value, radix);
  const wasOverflowing = useRef(reading.overflow);

  useEffect(() => {
    if (reading.overflow !== wasOverflowing.current) {
      wasOverflowing.current = reading.overflow;
      onOverflowChange(label, reading.overflow);
    }
  }, [reading.overflow, label, onOverflowChange]);

  const groupLabel = `${label}: ${reading.displayText}${reading.overflow ? copy.overflowAriaSuffix : ''}`;

  return (
    <div
      ref={setNodeRef}
      className="odoRow"
      data-dragging={isDragging || undefined}
      style={{transform: CSS.Transform.toString(transform), transition}}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        className="odoDragHandle"
        aria-label={copy.reorderHandleLabel(label, position, total)}
        {...attributes}
        {...listeners}
      >
        <FontAwesomeV6Icon iconName="grip-vertical" iconStyle="solid" />
      </button>
      <Typography
        semanticTag="span"
        visualAppearance="body-two"
        className="odoRowLabel"
        noMargin
        aria-hidden="true"
      >
        {label}
      </Typography>
      {/* The digits and badge below are purely visual; groupLabel is the one accessible statement of this row's value. */}
      <div className="odoWheelGroup" role="group" aria-label={groupLabel}>
        <div
          className="odoWheel"
          aria-hidden="true"
          style={{'--odo-wheel-color': color} as CSSProperties}
        >
          {reading.digits.map((digit, i) => (
            <DigitCell
              key={i}
              current={digit.current}
              next={digit.next}
              frac={digit.changing ? frac : 0}
            />
          ))}
        </div>
        <OverflowBadge visible={reading.overflow} />
      </div>
    </div>
  );
}
