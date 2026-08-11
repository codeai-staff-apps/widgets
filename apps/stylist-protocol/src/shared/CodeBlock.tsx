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
 *
 * `surface` picks which of the app's two dark code panels this is — the
 * editor or the console — rather than forking the component per colour.
 */
export default function CodeBlock({
  children,
  summary,
  surface = 'editor',
}: {
  children: ReactNode;
  summary?: string;
  surface?: 'editor' | 'console';
}) {
  const isConsole = surface === 'console';

  return (
    <Paper
      variant="outlined"
      component="pre"
      // tabIndex: a horizontally scrollable region must be keyboard-reachable.
      tabIndex={0}
      sx={{
        m: 0,
        p: 2,
        overflowX: 'auto',
        fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
        bgcolor: isConsole ? '#11111b' : '#1e1e2e',
        borderColor: '#2d2d42',
        color: isConsole ? '#a6e3a1' : 'var(--text-neutral-primary)',
      }}
    >
      {summary && <span style={visuallyHidden}>{summary}</span>}
      <code>{children}</code>
    </Paper>
  );
}
