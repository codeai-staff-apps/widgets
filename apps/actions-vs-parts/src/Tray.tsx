import {TERMS} from './data';
import {useSelectAndPlace} from './shared';

const termById = Object.fromEntries(TERMS.map(term => [term.id, term]));

interface TrayProps {
  containerId: string;
  /** Visible label. Must be contained in the target button's accessible name. */
  title: string;
  board: ReturnType<typeof useSelectAndPlace>;
  /** Per-term grading, present only after Check answers. */
  results?: Record<string, boolean>;
}

/**
 * A category and the terms sorted into it. The heading doubles as the
 * destination button, so placing a term is a plain button press — no drag
 * required — and the terms stay siblings rather than nested buttons.
 */
export default function Tray({containerId, title, board, results}: TrayProps) {
  const ids = board.itemsIn(containerId);
  const locked = results !== undefined;

  return (
    <div className="tray">
      <button
        {...board.getTargetProps(containerId)}
        className={board.selectedId && !locked ? 'trayTarget trayTarget--ready' : 'trayTarget'}
        disabled={locked}
      >
        {title}
      </button>
      <ul className="trayItems">
        {ids.map(id => (
          <li key={id}>
            <button {...board.getItemProps(id)} className="chip" disabled={locked}>
              {termById[id].label}
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
