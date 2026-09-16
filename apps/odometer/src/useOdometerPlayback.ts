import {useEffect, useState} from 'react';

/** Matches the legacy widget's interval period. */
const TICK_MS = 20;

export const SPEED_MIN = 0.005;
export const SPEED_MAX = 0.15;
export const SPEED_STEP = 0.005;
export const DEFAULT_SPEED = 0.03;
/** Dragging the speed slider all the way to SPEED_MAX snaps the tick to this instead — a "fast" endpoint past the slider's own range. */
const FAST_TICK = 1;

export const VALUE_MIN = 0;
export const VALUE_SLIDER_MAX = 1023;
export const VALUE_SLIDER_STEP = 0.1;

/**
 * Owns the shared value that drives every odometer row, plus Start/Pause/Reset
 * and the speed that controls how fast auto-play ticks it up.
 */
export function useOdometerPlayback() {
  const [value, setValue] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);

  useEffect(() => {
    if (!playing) {
      return;
    }
    const tick = speed >= SPEED_MAX ? FAST_TICK : speed;
    const id = window.setInterval(() => {
      setValue(v => Math.max(VALUE_MIN, v + tick));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [playing, speed]);

  return {
    value,
    /** Sets the value directly — used by the value slider and number input. */
    setValue: (next: number) => setValue(Math.max(VALUE_MIN, next)),
    playing,
    start: () => setPlaying(true),
    pause: () => setPlaying(false),
    reset: () => {
      setPlaying(false);
      setValue(0);
    },
    speed,
    setSpeed,
  };
}
