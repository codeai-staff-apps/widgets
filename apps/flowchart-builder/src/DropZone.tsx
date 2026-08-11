import Button from '@code-dot-org/component-library/button';

import {chipById, type Zone} from './data';
import {useSelectAndPlace} from './shared';

export type Mark = 'correct' | 'wrong';

interface DropZoneProps {
  zone: Zone;
  board: ReturnType<typeof useSelectAndPlace>;
  mark?: Mark;
}

/*
 * The remove control is a sibling of the zone button, not a child: a button
 * inside a button is invalid and breaks the accessibility tree. Both stay
 * independently focusable, and the zone button doubles as a remove control
 * when it is clicked with nothing selected.
 */
export default function DropZone({zone, board, mark}: DropZoneProps) {
  const [itemId] = board.itemsIn(zone.id);
  const chip = itemId ? chipById[itemId] : undefined;
  const pulsing = board.selectedId !== null && !chip;

  return (
    <div className="zoneWrap">
      <button
        {...board.getTargetProps(zone.id)}
        className={[
          'zone',
          zone.tint && !mark && `zone--${zone.tint}`,
          mark && `zone--${mark}`,
          pulsing && 'zone--pulse',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {chip ? (
          <span className={`zoneCode zoneCode--${chip.tone}`}>{chip.text}</span>
        ) : (
          <span className="zonePlaceholder">drop code here</span>
        )}
      </button>
      {chip && (
        <Button
          isIconOnly
          icon={{iconName: 'xmark', iconStyle: 'solid'}}
          type="secondary"
          color="black"
          size="l"
          ariaLabel={`Remove ${chip.text} from ${zone.label}`}
          onClick={() => board.remove(chip.id)}
        />
      )}
    </div>
  );
}
