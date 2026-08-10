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
 * A category and the terms sorted into it. The heading is the destination
 * button, but its hit area is stretched over the whole box (see `.trayTarget`
 * in sort.css), so a term can be placed by clicking anywhere in the category —
 * while the box still holds exactly one button rather than nesting them. The
 * container repeats `data-sap-target` so a pointer drag dropped onto a term
 * already in the box resolves to the category too.
 */
export default function Tray({containerId, title, board, results}: TrayProps) {
  const ids = board.itemsIn(containerId);
  const locked = results !== undefined;
  const ready = Boolean(board.selectedId) && !locked;

  return (
    <div className={ready ? 'tray tray--ready' : 'tray'} data-sap-target={containerId}>
      <button {...board.getTargetProps(containerId)} className="trayTarget" disabled={locked}>
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
