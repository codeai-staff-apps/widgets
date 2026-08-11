import Typography from '@code-dot-org/component-library/typography';
import type {SemanticTag, VisualAppearance} from '@code-dot-org/component-library/typography';
import {useCallback, useEffect, useId, useRef, useState, type ReactNode} from 'react';

/**
 * intro → steps → summary, with focus moved to the new screen's heading.
 *
 *   const machine = useScreenMachine(['intro', 'choices', 'summary'], {
 *     onEnter: id => announce(id === 'summary' ? 'Teaching takeaway is now visible.' : ''),
 *   });
 *   <main>
 *     <Screen machine={machine} id="intro" heading="Meet Jordan">…</Screen>
 *     <Screen machine={machine} id="choices" heading="How do you respond?">…</Screen>
 *   </main>
 *
 * Inactive screens are not rendered, so exactly one heading and one screen's
 * content are in the accessibility tree at a time. Keep the screens inside one
 * persistent `<main>`; do not give each screen its own `main` landmark.
 */

export interface ScreenMachine {
  current: string;
  /** 0-based position of `current` in the id list — use for "Step 3 of 6". */
  index: number;
  total: number;
  is: (id: string) => boolean;
  goTo: (id: string) => void;
  next: () => void;
  back: () => void;
}

export interface ScreenMachineOptions {
  /** Defaults to the first id. */
  initial?: string;
  /** Runs on every transition, never on the initial screen. Announce from here. */
  onEnter?: (id: string, previous: string) => void;
}

export function useScreenMachine(
  screenIds: readonly string[],
  options: ScreenMachineOptions = {},
): ScreenMachine {
  const [current, setCurrent] = useState(options.initial ?? screenIds[0]);

  const onEnter = useRef(options.onEnter);
  onEnter.current = options.onEnter;

  // `onEnter` fires here rather than in the state updater or an effect, both of
  // which React runs twice under StrictMode and would announce twice.
  const currentRef = useRef(current);
  currentRef.current = current;
  const goTo = useCallback((id: string) => {
    const previous = currentRef.current;
    if (previous === id) {
      return;
    }
    currentRef.current = id;
    setCurrent(id);
    onEnter.current?.(id, previous);
  }, []);

  const index = screenIds.indexOf(current);
  const step = (delta: number) => {
    const target = screenIds[index + delta];
    if (target) {
      goTo(target);
    }
  };

  return {
    current,
    index,
    total: screenIds.length,
    is: (id: string) => id === current,
    goTo,
    next: () => step(1),
    back: () => step(-1),
  };
}

const DEFAULT_APPEARANCE: Record<string, VisualAppearance> = {
  h1: 'heading-lg',
  h2: 'heading-md',
  h3: 'heading-sm',
};

export interface ScreenProps {
  machine: ScreenMachine;
  id: string;
  heading: ReactNode;
  /** Pick the level that fits the page's outline; the first screen is usually the `h1`. */
  headingTag?: Extract<SemanticTag, 'h1' | 'h2' | 'h3'>;
  headingAppearance?: VisualAppearance;
  /**
   * Wraps the rendered heading element — e.g. to place it inside a coloured
   * hero band with an eyebrow above and a subtitle below — without disturbing
   * the focus-management below, which targets the heading by id regardless
   * of where in the tree it ends up.
   */
  headingWrapper?: (heading: ReactNode) => ReactNode;
  children: ReactNode;
}

/** One screen. Renders nothing unless active; on activation its heading takes focus. */
export function Screen({
  machine,
  id,
  heading,
  headingTag = 'h2',
  headingAppearance,
  headingWrapper,
  children,
}: ScreenProps) {
  const active = machine.is(id);
  const headingId = useId();
  const wasActive = useRef(active);

  useEffect(() => {
    if (active && !wasActive.current) {
      const el = document.getElementById(headingId);
      el?.setAttribute('tabindex', '-1');
      el?.focus();
    }
    wasActive.current = active;
  }, [active, headingId]);

  if (!active) {
    return null;
  }

  const headingEl = (
    <Typography
      semanticTag={headingTag}
      visualAppearance={headingAppearance ?? DEFAULT_APPEARANCE[headingTag]}
      id={headingId}
    >
      {heading}
    </Typography>
  );

  return (
    <section aria-labelledby={headingId}>
      {headingWrapper ? headingWrapper(headingEl) : headingEl}
      {children}
    </section>
  );
}
