/**
 * Splits a leading decorative glyph (emoji, dingbat, arrow) off a content
 * string so it can be rendered in an `aria-hidden` span. A screen reader
 * announcing "black right-pointing small triangle, Console" or "party
 * popper, Protocol Complete!" is noise the sighted reading doesn't have —
 * the glyph stays visible, it just stops polluting the accessible name.
 */
const LEADING_GLYPH = /^([\p{Extended_Pictographic}\p{S}])️?\s*/u;

export function splitLeadingGlyph(text: string): {icon: string | null; rest: string} {
  const match = LEADING_GLYPH.exec(text);
  if (!match) {
    return {icon: null, rest: text};
  }
  return {icon: match[1], rest: text.slice(match[0].length)};
}
