import Typography from '@code-dot-org/component-library/typography';
import {useEffect, useRef} from 'react';

import {copy} from './copy';
import DigitCell from './DigitCell';
import {readOdometer} from './odometerMath';
import OverflowBadge from './OverflowBadge';

export default function OdometerRow({
  label,
  radix,
  value,
  frac,
  onOverflowChange,
}: {
  label: string;
  radix: number;
  value: number;
  frac: number;
  /** Fires only when this row's overflow state flips, so callers can announce it without spamming every tick. */
  onOverflowChange: (label: string, overflowing: boolean) => void;
}) {
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
    <div className="odoRow">
      <Typography
        semanticTag="span"
        visualAppearance="body-two"
        className="odoRowLabel"
        aria-hidden="true"
      >
        {label}
      </Typography>
      {/* The digits and badge below are purely visual; groupLabel is the one accessible statement of this row's value. */}
      <div className="odoWheelGroup" role="group" aria-label={groupLabel}>
        <div className="odoWheel" aria-hidden="true">
          {reading.digits.map((digit, i) => (
            <DigitCell key={i} current={digit.current} next={digit.next} frac={frac} />
          ))}
        </div>
        <OverflowBadge visible={reading.overflow} />
      </div>
    </div>
  );
}
