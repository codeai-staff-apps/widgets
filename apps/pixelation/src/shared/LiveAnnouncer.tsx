import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
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

const AnnounceContext = createContext<((message: string) => void) | null>(null);

/**
 * The visually-hidden technique alone still leaves this div wherever it falls
 * in normal flow — and because it's the last thing `AppShell` renders, that's
 * the very bottom of the page. A slider's onChange never touches focus or
 * scroll itself, but some browser/screen-reader combinations bring a changed
 * `aria-live` region into view when they announce it, which — with no anchor
 * here — meant every slider move on a page with any real height silently
 * scrolled the viewport all the way down to this node (right past the
 * encoding textarea, which is what made it look like *that* had stolen
 * focus). Pinning the region to the viewport's own top-left corner keeps it
 * "in view" at every scroll position, so there's nothing to scroll to.
 */
const liveRegionStyle: CSSProperties = {
  ...visuallyHidden,
  position: 'fixed',
  top: 0,
  left: 0,
};

/** Mounts the app's one polite live region. Nesting is a no-op: the outer region wins. */
export function LiveAnnouncerProvider({children}: {children: ReactNode}) {
  const outer = useContext(AnnounceContext);
  const [message, setMessage] = useState('');
  const timer = useRef<number>();

  const announce = useCallback((next: string) => {
    window.clearTimeout(timer.current);
    setMessage('');
    timer.current = window.setTimeout(() => setMessage(next), CLEAR_THEN_SET_MS);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (outer) {
    return <>{children}</>;
  }

  return (
    <AnnounceContext.Provider value={announce}>
      {children}
      <div style={liveRegionStyle} role="status" aria-live="polite" aria-atomic="true">
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
