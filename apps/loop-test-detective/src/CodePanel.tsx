import Typography from '@code-dot-org/component-library/typography';
import {useId} from 'react';

import type {Chrome, HighlightId, Scenario} from './content/types';
import {CodeBlock} from './shared';

/**
 * The loop under test plus its console. The original drew a fake editor —
 * line numbers, tab bar, window chrome — around the same eight lines; only
 * the code, the highlighted line, and the revealed output carry meaning, so
 * only those are rebuilt.
 */
export default function CodePanel({
  scenario,
  chrome,
  highlight,
  revealed,
}: {
  scenario: Scenario;
  chrome: Chrome;
  highlight?: HighlightId;
  revealed: boolean;
}) {
  const {code} = scenario;
  const consoleHeadingId = useId();

  const lines: {text: string; id?: HighlightId}[] = [
    {text: code.comment},
    {text: ''},
    {text: code.loop, id: 'loop'},
    {text: code.body},
    {text: code.close},
    {text: ''},
    {text: code.expected},
    {text: revealed ? code.actualRevealed : code.actualUnknown, id: 'actual'},
  ];

  const consoleText = revealed
    ? [...scenario.consoleOutput, scenario.consoleWarning].join('\n')
    : chrome.consoleInitial;

  return (
    <div className="codeColumn">
      <CodeBlock>
        {lines.map((line, i) => (
          <span
            key={i}
            className={line.id && line.id === highlight ? 'codeLine isHighlighted' : 'codeLine'}
          >
            {line.text}
            {'\n'}
          </span>
        ))}
      </CodeBlock>

      <section aria-labelledby={consoleHeadingId}>
        <Typography
          semanticTag="h2"
          visualAppearance="overline-two"
          id={consoleHeadingId}
          noMargin
        >
          {chrome.consoleLabel}
        </Typography>
        <CodeBlock>{consoleText}</CodeBlock>
      </section>
    </div>
  );
}
