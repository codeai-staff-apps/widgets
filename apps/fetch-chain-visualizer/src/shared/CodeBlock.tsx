import Paper from '@mui/material/Paper';
import classNames from 'classnames';
import type {ReactNode} from 'react';

import {visuallyHidden} from './visuallyHidden';

/** Presentation for each tone. Layer 3 (codeSlab.css) owns the descendant
 * syntax-colour spans; this is only what a `<span>` selector can't reach. */
const TONE_SX = {
  code: {bgcolor: '#1F1976', color: '#E4E2F8', fontSize: '13.5px', lineHeight: 2, p: '16px 18px'},
  result: {bgcolor: '#ffffff', color: '#1F1976', fontSize: '13px', lineHeight: 1.7, p: 2},
} as const;

/**
 * A code sample as real, readable text.
 *
 *   <CodeBlock>{'for (let i = 0; i <= 5; i++) {\n  console.log(i);\n}'}</CodeBlock>
 *
 * Children may also be syntax-highlight `<span>`s — the text stays in the
 * accessibility tree either way. Never wrap code in `role="img"` with a summary
 * `aria-label`: that deletes the code from the accessibility tree and hands a
 * screen-reader user a paraphrase of the very thing the exercise is about.
 * `summary` adds a one-line description *before* the code, never instead of
 * it, and doubles as the accessible name for the scrollable region itself
 * (a `tabIndex={0}` container needs one to not announce as a nameless stop).
 *
 * `tone="code"` is the dark indigo code slab; `tone="result"` (default) is
 * the light result-value surface. `revealed={false}` starts the fade-in
 * transition from hidden — flip it true a beat after mount to play it.
 */
export default function CodeBlock({
  children,
  summary,
  tone = 'result',
  revealed = true,
}: {
  children: ReactNode;
  summary?: string;
  tone?: 'code' | 'result';
  revealed?: boolean;
}) {
  return (
    <Paper
      elevation={0}
      component="pre"
      tabIndex={0}
      role="group"
      aria-label={summary}
      className={classNames(tone === 'code' ? 'codeSlab' : 'resultValue', {visible: revealed})}
      sx={{
        m: 0,
        overflowX: 'auto',
        fontFamily: 'monospace',
        ...TONE_SX[tone],
      }}
    >
      {summary && <span style={visuallyHidden}>{summary}</span>}
      <code>{children}</code>
    </Paper>
  );
}
