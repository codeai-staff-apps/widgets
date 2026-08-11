import {Fragment, type ReactNode} from 'react';

const split = (text: string, delimiter: string, wrap: (part: string) => ReactNode) =>
  text
    .split(delimiter)
    .map((part, i) => <Fragment key={i}>{i % 2 ? wrap(part) : part}</Fragment>);

/**
 * A tiny inline markup language for this app's own static copy (never for
 * untrusted text):
 *   `**token**`  → `<mark>`             — the highlight pill
 *   `|cls:text|` → `<span class="cls">` — syntax colour: `fn`/`op`/`comment`
 *                                          on the code slab, `key`/`valS`/
 *                                          `valN`/`brace`/`dim`/`hint` on
 *                                          result values (see codeSlab.css)
 */
export const highlight = (code: string): ReactNode => {
  const token = /\*\*([^*]+)\*\*|\|(\w+):([^|]*)\|/g;
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let match: RegExpExecArray | null;
  while ((match = token.exec(code))) {
    if (match.index > last) {
      nodes.push(code.slice(last, match.index));
    }
    nodes.push(
      match[1] !== undefined ? (
        <mark key={key++}>{match[1]}</mark>
      ) : (
        <span key={key++} className={match[2]}>
          {match[3]}
        </span>
      ),
    );
    last = match.index + match[0].length;
  }
  if (last < code.length) {
    nodes.push(code.slice(last));
  }
  return nodes;
};

/** ``…`expr`…`` becomes an inline `<code>` run. */
export const inlineCode = (text: string): ReactNode =>
  split(text, '`', part => <code>{part}</code>);
