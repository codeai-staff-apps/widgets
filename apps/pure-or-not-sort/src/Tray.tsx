import {METHODS} from './data';
import {useSelectAndPlace} from './shared';

const methodById = Object.fromEntries(METHODS.map(method => [method.id, method]));

interface TrayProps {
  containerId: string;
  /** Visible label. Must be contained in the target button's accessible name. */
  title: string;
  /** Decorative glyph shown before the title. */
  glyph?: string;
  board: ReturnType<typeof useSelectAndPlace>;
  /** Per-method grading, present only after Check answers. */
  results?: Record<string, boolean>;
}

/**
 * A category and the methods sorted into it. The heading doubles as the
 * destination button, so placing a method is a plain button press — no drag
 * required — and the methods stay siblings rather than nested buttons.
 */
export default function Tray({containerId, title, glyph, board, results}: TrayProps) {
  const ids = board.itemsIn(containerId);
  const locked = results !== undefined;
  // 'bank' | 'pure' | 'side' — drives the two-tone zone colouring in sort.css.
  const zone = containerId.startsWith('zone-') ? containerId.slice('zone-'.length) : containerId;

  return (
    <div className="tray" data-zone={zone} data-dragover={board.hoveredTargetId === containerId || undefined}>
      <button
        {...board.getTargetProps(containerId)}
        className={board.selectedId && !locked ? 'trayTarget trayTarget--ready' : 'trayTarget'}
        disabled={locked}
      >
        {glyph && <span aria-hidden="true">{glyph} </span>}
        {title}
      </button>
      <ul className="trayItems">
        {ids.map(id => (
          <li key={id}>
            <button
              {...board.getItemProps(id)}
              className="chip"
              disabled={locked}
              data-grade={results && (results[id] ? 'right' : 'wrong')}
            >
              {methodById[id].label}
            </button>
            {results && (
              <span className={results[id] ? 'mark mark--right' : 'mark mark--wrong'}>
                <span aria-hidden="true">{results[id] ? '✓' : '✗'} </span>
                {results[id] ? 'correct' : 'not quite'}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
