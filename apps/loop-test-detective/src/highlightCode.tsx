/**
 * A tiny regex tokenizer for the handful of JS constructs this app's code
 * samples ever contain (a `for` loop header, a `console.log` call, and line
 * comments) — the same "codeSegments + small .c-* classes, no highlighting
 * dependency" approach as order-the-kitchen, but generated from the scenario
 * strings instead of hand-authored, since two scenarios (off-by-one,
 * wrong-range) share the same shape with different numbers/operators.
 */
export interface CodeToken {
  text: string;
  cls?: 'kw' | 'fn' | 'num' | 'op' | 'punc' | 'var' | 'cm';
}

const TOKEN_RE =
  /(\bfor\b|\blet\b)|(\bconsole\b|\blog\b)|(\d+)|(<=|>=|==|!=|\+\+|--)|([=<>])|([(){};.,])|(\s+)|([A-Za-z_]\w*)/g;

export function highlightLine(line: string): CodeToken[] {
  if (line.trim().startsWith('//')) {
    return [{text: line, cls: 'cm'}];
  }
  if (line === '') {
    return [{text: ' '}];
  }

  const tokens: CodeToken[] = [];
  let lastIndex = 0;
  for (const match of line.matchAll(TOKEN_RE)) {
    if (match.index! > lastIndex) {
      tokens.push({text: line.slice(lastIndex, match.index)});
    }
    const [, kw, fn, num, opMulti, opSingle, punc, ws, ident] = match;
    if (kw) tokens.push({text: kw, cls: 'kw'});
    else if (fn) tokens.push({text: fn, cls: 'fn'});
    else if (num) tokens.push({text: num, cls: 'num'});
    else if (opMulti) tokens.push({text: opMulti, cls: 'op'});
    else if (opSingle) tokens.push({text: opSingle, cls: 'op'});
    else if (punc) tokens.push({text: punc, cls: 'punc'});
    else if (ws) tokens.push({text: ws});
    else if (ident) tokens.push({text: ident, cls: 'var'});
    lastIndex = match.index! + match[0].length;
  }
  if (lastIndex < line.length) {
    tokens.push({text: line.slice(lastIndex)});
  }
  return tokens;
}

/**
 * Renders a line's tokens as spans, for use as JSX children.
 *
 * The tokens are wrapped in one `white-space: pre` element rather than
 * returned loose: several callers place them in a flex row, and a flex
 * container discards whitespace-only anonymous items — which silently ate the
 * indentation and every space between tokens (`for (let i = 0;` rendered as
 * `for(leti=0;`).
 */
export function renderLine(line: string, keyPrefix: string) {
  return (
    <span className="codeText">
      {highlightLine(line).map((token, i) =>
        token.cls ? (
          <span key={`${keyPrefix}-${i}`} className={token.cls}>
            {token.text}
          </span>
        ) : (
          token.text
        ),
      )}
    </span>
  );
}
