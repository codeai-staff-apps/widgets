import Paper from '@mui/material/Paper';
import type {ReactNode} from 'react';

import {visuallyHidden} from './visuallyHidden';

/**
 * A code sample as real, readable text.
 *
 *   <CodeBlock>{'for (let i = 0; i <= 5; i++) {\n  console.log(i);\n}'}</CodeBlock>
 *
 * Children may also be syntax-highlight `<span>`s — the text stays in the
 * accessibility tree either way. Never wrap code in `role="img"` with a summary
 * `aria-label`: that deletes the code from the accessibility tree and hands a
 * screen-reader user a paraphrase of the very thing the exercise is about.
 * `summary` adds a one-line description *before* the code, never instead of it.
 */
export default function CodeBlock({
  children,
  summary,
}: {
  children: ReactNode;
  summary?: string;
}) {
  return (
    <Paper
      variant="outlined"
      component="pre"
      // tabIndex: a horizontally scrollable region must be keyboard-reachable.
      // role/aria-label: a keyboard-reachable region needs an accessible name.
      tabIndex={0}
      role={summary ? 'group' : undefined}
      aria-label={summary}
      sx={{
        m: 0,
        p: 2,
        overflowX: 'auto',
        fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
        color: 'var(--text-neutral-primary)',
      }}
    >
      {summary && <span style={visuallyHidden}>{summary}</span>}
      <code>{children}</code>
    </Paper>
  );
}
