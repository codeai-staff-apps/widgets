import type {CSSProperties} from 'react';

/**
 * One rolling wheel. `current` sits over `next`; sliding the track up by the
 * shared value's fractional part reveals `next` from below, exactly as an
 * odometer wheel turns. The actual transform lives in odometer.css, reading
 * the `--frac` custom property set here — `prefers-reduced-motion` overrides
 * `--frac` back to 0 there, so no JS branch is needed for it.
 */
export default function DigitCell({
  current,
  next,
  frac,
}: {
  current: string;
  next: string;
  frac: number;
}) {
  return (
    <div className="odoCell">
      <div className="odoCellTrack" style={{'--frac': frac} as CSSProperties}>
        <span className="odoDigit">{current}</span>
        <span className="odoDigit">{next}</span>
      </div>
    </div>
  );
}
