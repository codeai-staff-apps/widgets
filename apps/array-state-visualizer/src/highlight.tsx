import {Fragment, type ReactNode} from 'react';

/**
 * Splits `…**token**…` into text and `<mark>` runs. `<mark>` rather than a
 * styled `<span>` so the emphasis survives for assistive tech, which is the
 * defect the original's colour-only highlight had.
 */
export function highlight(code: string): ReactNode {
  return code.split('**').map((part, i) =>
    i % 2 ? <mark key={i}>{part}</mark> : <Fragment key={i}>{part}</Fragment>,
  );
}
