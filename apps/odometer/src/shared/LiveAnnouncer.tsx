import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import {visuallyHidden} from './visuallyHidden';

/**
 * Screen-reader announcements. `AppShell` mounts the provider, so an app only
 * ever calls `useAnnounce()`.
 *
 *   const announce = useAnnounce();
 *   announce('3 out of 6 correct.');
 *
 * The region is polite: it is read after whatever the user is doing now. For a
 * message that must interrupt, render a visible `role="alert"` banner instead —
 * that is what the originals do and it keeps the interruption on screen too.
 */

/** Delay between clearing and setting the region, so repeats of the same string are re-read. */
const CLEAR_THEN_SET_MS = 60;
/**
 * Minimum time a message stays up before the next queued one can replace it —
 * long enough for a screen reader to get through a short sentence. Without a
 * queue, two `announce()` calls close together (e.g. Reset firing its own
 * message the same tick a row's overflow clears) raced: the second's
 * clear-then-set silently cancelled the first's pending set, and only the
 * last call was ever heard.
 */
const MIN_DISPLAY_MS = 1200;

const AnnounceContext = createContext<((message: string) => void) | null>(null);

/** Mounts the app's one polite live region. Nesting is a no-op: the outer region wins. */
export function LiveAnnouncerProvider({children}: {children: ReactNode}) {
  const outer = useContext(AnnounceContext);
  const [message, setMessage] = useState('');
  const queue = useRef<string[]>([]);
  const playing = useRef(false);
  const timer = useRef<number>();

  const playNext = useCallback(() => {
    const next = queue.current.shift();
    if (next === undefined) {
      playing.current = false;
      return;
    }
    playing.current = true;
    window.clearTimeout(timer.current);
    setMessage('');
    timer.current = window.setTimeout(() => {
      setMessage(next);
      timer.current = window.setTimeout(playNext, MIN_DISPLAY_MS);
    }, CLEAR_THEN_SET_MS);
  }, []);

  const announce = useCallback(
    (next: string) => {
      queue.current.push(next);
      if (!playing.current) {
        playNext();
      }
    },
    [playNext],
  );

  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (outer) {
    return <>{children}</>;
  }

  return (
    <AnnounceContext.Provider value={announce}>
      {children}
      <div style={visuallyHidden} role="status" aria-live="polite" aria-atomic="true">
        {message}
      </div>
    </AnnounceContext.Provider>
  );
}

/** Returns `announce(message)`. Throws if no `LiveAnnouncerProvider` is mounted. */
export function useAnnounce() {
  const announce = useContext(AnnounceContext);
  if (!announce) {
    throw new Error('useAnnounce() requires a <LiveAnnouncerProvider> (AppShell mounts one).');
  }
  return announce;
}
