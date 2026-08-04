import Typography from '@code-dot-org/component-library/typography';
import {useId} from 'react';

import {CALL_REVEALED, CHROME, CODE_LINES} from './content/content';
import {CodeBlock} from './shared';

/**
 * script.js, its line numbers, and the console. Line numbers are real
 * positions rather than the source's hand-typed labels, so the console's
 * "TODO found on line 25" points at the line it names.
 *
 * During step 2 every non-empty line is a button. In the original only the
 * right answer was clickable, which made the authored wrong-answer feedback
 * unreachable — the learner could not miss.
 */
export default function CodePanel({
  highlight,
  revealed,
  consoleText,
  onLineClick,
  selectedLine,
}: {
  highlight: string[];
  /** True once the AI's helper function has been added to the file. */
  revealed: boolean;
  consoleText: string;
  /** Set only while step 2 is asking the learner to find a line. */
  onLineClick?: (id: string | undefined) => void;
  selectedLine?: string;
}) {
  const consoleHeadingId = useId();

  const lines = CODE_LINES.filter(line =>
    line.visibility === undefined
      ? true
      : revealed
        ? line.visibility === 'afterReveal'
        : line.visibility === 'beforeReveal',
  );

  return (
    <div className="codeColumn">
      <CodeBlock summary={CHROME.codeSummary}>
        {lines.map((line, i) => {
          const number = i + 1;
          const text = revealed && line.id === 'line-call' ? CALL_REVEALED : line.text;
          const classes = ['codeLine'];
          if (line.id && highlight.includes(line.id)) {
            classes.push('isHighlighted');
          }
          if (line.isTodo) {
            classes.push('isTodo');
          }
          if (line.visibility === 'afterReveal') {
            classes.push('isAdded');
          }
          if (line.id && line.id === selectedLine) {
            classes.push('isSelected');
          }

          return (
            <span key={number} className={classes.join(' ')}>
              <span className="lineNumber" aria-hidden="true">
                {String(number).padStart(2, ' ')}
              </span>
              {onLineClick && text.trim() ? (
                <button
                  type="button"
                  className="codeLineButton"
                  aria-label={`Line ${number}: ${text.trim()}`}
                  onClick={() => onLineClick(line.id)}
                >
                  {text}
                </button>
              ) : (
                text
              )}
              {'\n'}
            </span>
          );
        })}
      </CodeBlock>

      <section aria-labelledby={consoleHeadingId}>
        <Typography semanticTag="h2" visualAppearance="overline-two" id={consoleHeadingId} noMargin>
          {CHROME.consoleLabel}
        </Typography>
        <CodeBlock summary={CHROME.consoleSummary}>{consoleText}</CodeBlock>
      </section>
    </div>
  );
}
