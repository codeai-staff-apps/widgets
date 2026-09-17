import type {Segment} from './compression';
import {copy} from './copy';

/**
 * Renders the compressed text, with each substituted symbol wrapped in a
 * `<mark>` whose `aria-label` names the pattern it replaced (e.g. "Symbol 2,
 * short for 'the'") — a screen reader gets the mapping at the point it
 * matters, rather than only a visual color cue tying it to the dictionary
 * list. Plain text segments render as-is: the real characters (including the
 * underscores standing in for spaces) stay in the accessibility tree, never
 * replaced by a summary.
 */
export default function CompressedText({segments}: {segments: Segment[]}) {
  return (
    <p className="tcCompressedText">
      {segments.map((segment, i) =>
        segment.entryIndex === undefined ? (
          segment.text
        ) : (
          <mark key={i} aria-label={copy.compressed.symbolAria(segment.entryIndex + 1, segment.pattern!)}>
            {segment.text}
          </mark>
        ),
      )}
    </p>
  );
}
