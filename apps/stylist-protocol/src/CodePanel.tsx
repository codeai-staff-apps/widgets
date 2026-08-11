import Typography from '@code-dot-org/component-library/typography';
import {useId} from 'react';

import {CALL_REVEALED_SEGMENTS, CHROME, CODE_LINES} from './content/content';
import type {CodeSegment} from './content/types';
import {CodeBlock, splitLeadingGlyph} from './shared';

function CodeLineText({segments}: {segments: CodeSegment[]}) {
  return (
    <>
      {segments.map((segment, i) =>
        segment.tok ? (
          <span key={i} className={`tok-${segment.tok}`}>
            {segment.text}
          </span>
        ) : (
          segment.text
        ),
      )}
    </>
  );
}

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
  clickTarget,
}: {
  highlight: string[];
  /** True once the AI's helper function has been added to the file. */
  revealed: boolean;
  consoleText: string;
  /** Set only while step 2 is asking the learner to find a line. */
  onLineClick?: (id: string | undefined) => void;
  selectedLine?: string;
  /** The one right line for step 2's click target, so a wrong pick reads as "look here", not "found it". */
  clickTarget?: string;
}) {
  const codeHeadingId = useId();
  const consoleHeadingId = useId();
  const console_ = splitLeadingGlyph(CHROME.consoleLabel);

  const lines = CODE_LINES.filter(line =>
    line.visibility === undefined
      ? true
      : revealed
        ? line.visibility === 'afterReveal'
        : line.visibility === 'beforeReveal',
  );

  return (
    <div className="codeColumn">
      <section aria-labelledby={codeHeadingId}>
        <Typography semanticTag="h2" visualAppearance="overline-two" id={codeHeadingId} noMargin>
          script.js
        </Typography>
        <CodeBlock summary={CHROME.codeSummary}>
          {lines.map((line, i) => {
            const number = i + 1;
            const revealCall = revealed && line.id === 'line-call';
            const segments = revealCall ? CALL_REVEALED_SEGMENTS : line.segments;
            const text = segments.map(segment => segment.text).join('');
            const classes = ['codeLine'];
            if (line.id && highlight.includes(line.id)) {
              classes.push('isHighlighted');
            }
            if (line.visibility === 'afterReveal' || revealCall) {
              classes.push('isAdded');
            }
            if (line.id && line.id === selectedLine) {
              classes.push(line.id === clickTarget ? 'isSelected' : 'isHighlighted');
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
                    <CodeLineText segments={segments} />
                  </button>
                ) : (
                  <CodeLineText segments={segments} />
                )}
                {line.id === 'line-todo' && selectedLine === 'line-todo' && (
                  <span className="todoBadge" aria-hidden="true">
                    TODO
                  </span>
                )}
                {'\n'}
              </span>
            );
          })}
        </CodeBlock>
      </section>

      <section aria-labelledby={consoleHeadingId}>
        <Typography semanticTag="h2" visualAppearance="overline-two" id={consoleHeadingId} noMargin>
          {console_.icon && <span aria-hidden="true">{console_.icon} </span>}
          {console_.rest}
        </Typography>
        <CodeBlock summary={CHROME.consoleSummary} surface="console">
          {consoleText}
        </CodeBlock>
      </section>
    </div>
  );
}
