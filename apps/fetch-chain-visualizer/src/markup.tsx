import {Fragment, type ReactNode} from 'react';

const split = (text: string, delimiter: string, wrap: (part: string) => ReactNode) =>
  text
    .split(delimiter)
    .map((part, i) => <Fragment key={i}>{i % 2 ? wrap(part) : part}</Fragment>);

/**
 * `…**token**…` becomes a `<mark>` run. `<mark>` rather than a styled span so
 * the emphasis reaches assistive tech, not only the eye.
 */
export const highlight = (code: string): ReactNode =>
  split(code, '**', part => <mark>{part}</mark>);

/** ``…`expr`…`` becomes an inline `<code>` run. */
export const inlineCode = (text: string): ReactNode =>
  split(text, '`', part => <code>{part}</code>);
