import {visuallyHidden} from './shared';

import './arrayTrack.css';

type CellState = 'eliminated' | 'in-range' | 'mid' | 'found';

export interface ArrayTrackProps {
  values: number[];
  /** Lowest index still in the search range. */
  low: number;
  /** Highest index still in the search range. Pass `low - 1` for an empty range. */
  high: number;
  /** Index being compared this step. Omit once the step is past comparing. */
  mid?: number;
  /** Index confirmed as the target, once found. */
  foundIndex?: number;
  /** Lowest index in the student's not-yet-checked prediction, if any. */
  previewLow?: number;
  /** Highest index in the student's not-yet-checked prediction, if any. */
  previewHigh?: number;
}

/**
 * The sorted list as a row of index/value cells — the one visualization
 * custom to this app. Eliminated values stay in the DOM and in the tab/reading
 * order, just visually muted, so the shrinking search range is always
 * visible. State is never colour-only: each cell also carries a text role
 * ("low"/"mid"/"high") or a strikethrough, and screen readers get the same
 * "eliminated"/"found" words sighted users see as strikethrough/highlight.
 * The student's current prediction gets a soft amber background only — never
 * a success/error colour, since it's a preview, not a verdict — and a
 * screen-reader-only word, since the highlight itself is colour-only.
 */
export default function ArrayTrack({
  values,
  low,
  high,
  mid,
  foundIndex,
  previewLow,
  previewHigh,
}: ArrayTrackProps) {
  return (
    <div>
      {/* One label for the whole row instead of repeating "index" on every
          cell — each cell's number is still announced as an index to screen
          readers via the visually-hidden prefix below. */}
      <p className="arrayTrack-legend">Index</p>
      <ol className="arrayTrack">
        {values.map((value, index) => {
          const state: CellState =
            index === foundIndex
              ? 'found'
              : index === mid
                ? 'mid'
                : index >= low && index <= high
                  ? 'in-range'
                  : 'eliminated';

          // "low"/"high" mark the range boundary; the mid/found role
          // replaces "mid" with "found" once the target is confirmed, so
          // the label always names what the cell currently means. All of
          // this is plain visible text, read by a screen reader like any
          // other content.
          const roles = [
            low <= high && index === low ? 'low' : null,
            state === 'found' ? 'found' : state === 'mid' ? 'mid' : null,
            low <= high && index === high ? 'high' : null,
          ].filter((role): role is string => role !== null);

          // The preview is a background tint only, so it never fights the
          // LOW/MID/HIGH captions — and it steps aside once a cell is truly
          // confirmed found, so the amber preview never competes with the
          // green "found" reveal for the same cell.
          const isPreview =
            state !== 'found' &&
            previewLow !== undefined &&
            previewHigh !== undefined &&
            index >= previewLow &&
            index <= previewHigh;

          return (
            <li
              key={index}
              className="arrayTrack-cell"
              data-state={state}
              data-preview={isPreview || undefined}
            >
              <span className="arrayTrack-role">{roles.join(' · ')}</span>
              <span className="arrayTrack-value">
                {value}
                {/* Eliminated cells have no visible text role — pair the
                    strikethrough/opacity with a word for screen readers. */}
                {state === 'eliminated' && <span style={visuallyHidden}> (eliminated)</span>}
                {/* The preview highlight is colour-only — pair it with a word. */}
                {isPreview && <span style={visuallyHidden}> (your prediction)</span>}
              </span>
              <span className="arrayTrack-index">
                <span style={visuallyHidden}>Index </span>
                {index}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
