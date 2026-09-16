/** Pure formatting logic for one odometer row. No React, no DOM — easy to reason about in isolation. */

/** Wheels per row. 10 matches the legacy widget and exactly spans the value slider's 0-1023 range in binary. */
export const DIGIT_COUNT = 10;

export interface OdometerDigit {
  /** Digit shown at rest. */
  current: string;
  /** Digit one tick later at this position — what rolls into view as the wheel turns. */
  next: string;
  /**
   * True only when `current !== next` — like a real odometer, a wheel that
   * isn't about to carry stays put. Positions where the next tick doesn't
   * change the digit (everything except the trailing digits that carry) must
   * render statically, never scrolling.
   */
  changing: boolean;
}

export interface OdometerReading {
  digits: OdometerDigit[];
  /** The value's radix text, unpadded — may be longer than DIGIT_COUNT. */
  fullText: string;
  /** fullText fit to DIGIT_COUNT characters — what the wheels show. */
  displayText: string;
  /** True when fullText needs more characters than the row has wheels for. */
  overflow: boolean;
}

function toRadixText(n: number, radix: number): string {
  return n.toString(radix).toUpperCase();
}

/**
 * Left-pads or left-truncates to `width` characters. An odometer has a fixed
 * number of wheels: a value too big to show loses its highest-order digits
 * (they roll off the front), it does not grow more wheels.
 */
function fitToWidth(text: string, width: number): string {
  return text.length >= width ? text.slice(text.length - width) : text.padStart(width, '0');
}

/** Reads `value` (clamped to >= 0) in `radix`, formatted to DIGIT_COUNT wheels. */
export function readOdometer(value: number, radix: number): OdometerReading {
  const whole = Math.floor(Math.max(0, value));
  const fullText = toRadixText(whole, radix);
  const displayText = fitToWidth(fullText, DIGIT_COUNT);
  const nextDisplayText = fitToWidth(toRadixText(whole + 1, radix), DIGIT_COUNT);

  const digits: OdometerDigit[] = [];
  for (let i = 0; i < DIGIT_COUNT; i++) {
    const current = displayText[i];
    const next = nextDisplayText[i];
    digits.push({current, next, changing: current !== next});
  }

  return {digits, fullText, displayText, overflow: fullText.length > DIGIT_COUNT};
}

/** The fractional part of a non-negative value, used to animate a wheel rolling from one digit to the next. */
export function fractionalPart(value: number): number {
  const v = Math.max(0, value);
  return v - Math.floor(v);
}

/** The whole part of a non-negative value — what the odometers actually display, floor matching `fractionalPart`. */
export function wholePart(value: number): number {
  return Math.floor(Math.max(0, value));
}
