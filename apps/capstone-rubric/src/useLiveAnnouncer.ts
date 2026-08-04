import {useCallback, useEffect, useRef, useState} from 'react';

const CLEAR_DELAY_MS = 60;

/*
 * Clear-then-set so assistive tech re-reads a message identical to the last
 * one (re-selecting the same cell must still announce). Render the returned
 * message into a visually hidden aria-live="polite" element.
 */
export default function useLiveAnnouncer() {
  const [message, setMessage] = useState('');
  const timer = useRef<number | undefined>(undefined);

  const announce = useCallback((text: string) => {
    window.clearTimeout(timer.current);
    setMessage('');
    timer.current = window.setTimeout(() => setMessage(text), CLEAR_DELAY_MS);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return {message, announce};
}
