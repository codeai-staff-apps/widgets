import type {Chrome, HighlightId, Scenario} from './content/types';
import {renderLine} from './highlightCode';

/**
 * The loop under test, dressed as the original's dark editor: traffic
 * lights, a tab bar, right-aligned line numbers, Catppuccin-Mocha syntax
 * colours, the moving highlight wash, the BUG pill, and a colour-split
 * console. All of it but the code text itself is `aria-hidden` — the code,
 * the highlighted line and the revealed output are what carry meaning, and
 * they stay real, readable text.
 */
export default function CodePanel({
  scenario,
  chrome,
  highlight,
  checkIndex,
  revealed,
}: {
  scenario: Scenario;
  chrome: Chrome;
  highlight?: HighlightId;
  /** 0-based index of the check currently on screen. */
  checkIndex: number;
  revealed: boolean;
}) {
  const {code} = scenario;

  // At the reveal check, the original highlights the loop line AND the
  // actual-output line together; every other check highlights only its own
  // line, and the extra wash disappears as soon as you move on.
  const showBugTag = revealed && checkIndex === scenario.revealAt;
  const highlighted = new Set<HighlightId>();
  if (highlight) highlighted.add(highlight);
  if (showBugTag) highlighted.add('actual');

  const lines: {text: string; id?: HighlightId; bug?: boolean}[] = [
    {text: code.comment},
    {text: ''},
    {text: code.loop, id: 'loop', bug: showBugTag},
    {text: code.body},
    {text: code.close},
    {text: ''},
    {text: code.expected},
    {text: revealed ? code.actualRevealed : code.actualUnknown, id: 'actual'},
  ];

  return (
    <div className="codeColumn">
      <div className="ide">
        <div className="ideTopbar" aria-hidden="true">
          <div className="ideDots">
            <span className="ideDot ideDotR" />
            <span className="ideDot ideDotY" />
            <span className="ideDot ideDotG" />
          </div>
          <div className="ideTabs">
            <span className="ideTab ideTabActive">
              <span className="ideTabDot" />
              script.js
            </span>
            <span className="ideTab">index.html</span>
          </div>
        </div>
        <div className="ideBody" role="group" aria-label="Alex's loop code" tabIndex={0}>
          {lines.map((line, i) => (
            <div
              key={i}
              className={
                line.id && highlighted.has(line.id) ? 'codeLine isHighlighted' : 'codeLine'
              }
            >
              <span className="lineNum" aria-hidden="true">
                {i + 1}
              </span>
              <span className="lineCode">{renderLine(line.text, `line-${i}`)}</span>
              {line.bug && (
                <span className="bugTag" aria-hidden="true">
                  {chrome.bugTagLabel}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="ideConsole" role="region" aria-live="polite" aria-label="Console output">
          <div className="consoleLabel" aria-hidden="true">
            {chrome.consoleLabel}
          </div>
          <div className="consoleOut">
            {revealed ? (
              <>
                <span className="revealed">{scenario.consoleOutput.join('\n')}</span>
                {'\n'}
                <span className="warn">{scenario.consoleWarning}</span>
              </>
            ) : (
              chrome.consoleInitial
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
