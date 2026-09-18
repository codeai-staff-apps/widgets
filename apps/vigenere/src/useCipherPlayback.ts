import {useEffect, useRef, useState} from 'react';

/** Matches the legacy widget's slider range (0 = slowest, 1000 = fastest). */
export const SPEED_MIN = 0;
export const SPEED_MAX = 1000;
export const SPEED_STEP = 50;
export const DEFAULT_SPEED = 500;

/** The delay a speed value maps to, in ms between characters — inverted, so higher speed means shorter delay. */
function delayFor(speed: number): number {
  return SPEED_MAX - speed;
}

/**
 * Drives step-by-step reveal of `stepCount` characters: Play auto-advances on
 * a timer (delay set by `speed`), Step advances one and pauses, Fast-forward
 * jumps straight to the end, Restart returns to the start. Mirrors the legacy
 * widget's play/pause/step/fast-forward/restart transport.
 *
 * `resetKey` identifies the current message/keyword/mode combination —
 * editing any of them mid-playback invalidates progress made under the old
 * combination, so a change starts the reveal over rather than continuing to
 * animate steps computed from what's now stale input.
 */
export function useCipherPlayback(stepCount: number, resetKey: string) {
  const [revealed, setRevealed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  // Clamp on every render (not just when resetKey changes) so a revealed
  // count left over from a longer message never renders out-of-range steps
  // for a shorter one, however briefly, before the reset effect below runs.
  const clamped = Math.min(revealed, stepCount);

  const lastResetKey = useRef(resetKey);
  useEffect(() => {
    if (lastResetKey.current !== resetKey) {
      lastResetKey.current = resetKey;
      setRevealed(0);
      setPlaying(false);
    }
  }, [resetKey]);

  useEffect(() => {
    if (!playing) {
      return;
    }
    if (clamped >= stepCount) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setRevealed(r => r + 1), delayFor(speed));
    return () => window.clearTimeout(id);
  }, [playing, clamped, stepCount, speed]);

  return {
    /** How many characters have been revealed so far, 0..stepCount. */
    revealed: clamped,
    playing,
    speed,
    setSpeed,
    play: () => stepCount > 0 && setPlaying(true),
    pause: () => setPlaying(false),
    step: () => {
      setPlaying(false);
      setRevealed(r => Math.min(r + 1, stepCount));
    },
    fastForward: () => {
      setPlaying(false);
      setRevealed(stepCount);
    },
    restart: () => {
      setPlaying(false);
      setRevealed(0);
    },
  };
}
