import {Fragment, type ReactNode} from 'react';

/**
 * Splits an example's source into highlighted runs:
 *  - `**token**` becomes `<mark>` — a real element, not a styled `<span>`, so
 *    the emphasis survives for assistive tech.
 *  - the `const opportunities = …` declaration line, and any trailing
 *    `// …` comment, become a `.comment` span (italic lavender in the code
 *    block, styled in page.css).
 * Everything else, including newlines, passes through unchanged so `<pre>`
 * renders the snippet exactly as written.
 */
const TOKEN_RE = /\*\*[^*]+\*\*|^const opportunities.*$|\/\/.*$/gm;

export function highlight(code: string): ReactNode {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of code.matchAll(TOKEN_RE)) {
    const token = match[0];
    const start = match.index ?? 0;
    if (start > lastIndex) {
      nodes.push(<Fragment key={key++}>{code.slice(lastIndex, start)}</Fragment>);
    }
    if (token.startsWith('**')) {
      nodes.push(<mark key={key++}>{token.slice(2, -2)}</mark>);
    } else {
      nodes.push(
        <span className="comment" key={key++}>
          {token}
        </span>,
      );
    }
    lastIndex = start + token.length;
  }

  if (lastIndex < code.length) {
    nodes.push(<Fragment key={key++}>{code.slice(lastIndex)}</Fragment>);
  }

  return nodes;
}
