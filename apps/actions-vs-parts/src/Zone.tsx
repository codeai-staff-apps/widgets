import Alert from '@code-dot-org/component-library/alert';

import {TERMS, ZONE_HINT} from './data';
import {useSelectAndPlace} from './shared';

const termById = Object.fromEntries(TERMS.map(term => [term.id, term]));

interface ZoneProps {
  containerId: string;
  /** Visible label. Contained in the target's accessible name. */
  title: string;
  board: ReturnType<typeof useSelectAndPlace>;
  /** Whether this category holds a misplaced term. Undefined until Check answers. */
  graded?: 'correct' | 'incorrect';
}

/**
 * A category and the terms sorted into it. As in the original, the whole box is
 * the destination and a placed term is inert — it can only be moved by Reset —
 * so the terms render as plain spans and the box itself is the one button. That
 * keeps the whole-box target of the original without nesting interactives.
 */
export default function Zone({containerId, title, board, graded}: ZoneProps) {
  const ids = board.itemsIn(containerId);

  return (
    <div className="zone">
      <button
        {...board.getTargetProps(containerId)}
        className={[
          'zoneTarget',
          board.selectedId && 'zoneTarget--ready',
          graded && `zoneTarget--${graded}`,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="zoneLabel">{title}</span>
        <span className="zoneTerms">
          {ids.map(id => (
            <span key={id} className="chip">
              {termById[id].label}
            </span>
          ))}
        </span>
      </button>
      {graded === 'incorrect' && (
        <Alert isImmediateImportance={false} aria-live="off" showIcon={false} type="warning" text={ZONE_HINT} />
      )}
    </div>
  );
}
