import Button from '@code-dot-org/component-library/button';
import Slider from '@code-dot-org/component-library/slider';
import TextField from '@code-dot-org/component-library/textField';
import Typography from '@code-dot-org/component-library/typography';
import {closestCenter, DndContext, type Announcements} from '@dnd-kit/core';
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {useCallback, useState} from 'react';

import {copy} from './copy';
import {fractionalPart, wholePart} from './odometerMath';
import OdometerRow from './OdometerRow';
import './odometer.css';
import {useAnnounce} from './shared';
import {
  SPEED_MAX,
  SPEED_MIN,
  SPEED_STEP,
  useOdometerPlayback,
  VALUE_MIN,
  VALUE_SLIDER_MAX,
  VALUE_SLIDER_STEP,
} from './useOdometerPlayback';
import {useRowOrder, type RowId} from './useRowOrder';

const CUSTOM_BASE_MIN = 2;
const CUSTOM_BASE_MAX = 36;
const DEFAULT_CUSTOM_BASE = 20;

/**
 * Each row's wheel background, so students can tell the five bases apart at a
 * glance in a classroom setting. Colors are app-local (no DS categorical/data-vis
 * token set exists): dark enough for AA contrast under the white digits, and
 * chosen to stay distinguishable from each other under protanopia, deuteranopia
 * and tritanopia (varied in lightness and saturation, not just hue — "custom"
 * is plain gray — and none are a red/green pair).
 */
const ROW_COLORS: Record<RowId, string> = {
  binary: '#0b3d68',
  octal: '#7a4512',
  decimal: '#0f5c6b',
  hexadecimal: '#6a2159',
  custom: '#5c5c5c',
};

/**
 * Silences dnd-kit's own built-in drag announcements: `useRowOrder` already
 * announces reorders through this app's one shared live region (matching how
 * overflow/reset are announced), so dnd-kit's default phrasing would just be
 * a second, differently-worded announcement for the same event.
 */
const SILENT_DRAG_ANNOUNCEMENTS: Announcements = {
  onDragStart: () => '',
  onDragOver: () => '',
  onDragEnd: () => '',
  onDragCancel: () => '',
};

export default function App() {
  const {value, setValue, playing, start, pause, reset, speed, setSpeed} = useOdometerPlayback();
  const [customBase, setCustomBase] = useState(DEFAULT_CUSTOM_BASE);
  const announce = useAnnounce();
  const {order, sensors, onDragEnd} = useRowOrder(id => copy.rowLabels[id]);

  const handleOverflowChange = useCallback(
    (label: string, overflowing: boolean) => {
      announce(overflowing ? copy.overflowAnnounce(label) : copy.overflowClearAnnounce(label));
    },
    [announce],
  );

  const handleReset = () => {
    reset();
    announce(copy.resetAnnounce);
  };

  const frac = fractionalPart(value);
  const radixOf: Record<RowId, number> = {
    binary: 2,
    octal: 8,
    decimal: 10,
    hexadecimal: 16,
    custom: customBase,
  };
  const rows = order.map(id => ({id, label: copy.rowLabels[id], radix: radixOf[id]}));

  return (
    <main className="odoPage">
      <Typography semanticTag="h1" visualAppearance="heading-lg">
        {copy.title}
      </Typography>
      {copy.intro.map(paragraph => (
        <Typography key={paragraph} semanticTag="p" visualAppearance="body-two">
          {paragraph}
        </Typography>
      ))}

      <div className="odoControls">
        <div className="odoButtonRow">
          <Button text={copy.controls.start} type="primary" onClick={start} disabled={playing} />
          <Button
            text={copy.controls.pause}
            type="secondary"
            onClick={pause}
            disabled={!playing}
          />
          <Button
            text={copy.controls.reset}
            type="tertiary"
            color="black"
            onClick={handleReset}
          />
        </div>
        <div className="odoSpeedRow">
          <span aria-hidden="true">{copy.controls.speedSlow}</span>
          <Slider
            name="odo-speed"
            label={copy.controls.speedLabel}
            color="brand"
            hideValue
            minValue={SPEED_MIN}
            maxValue={SPEED_MAX}
            step={SPEED_STEP}
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
          />
          <span aria-hidden="true">{copy.controls.speedFast}</span>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
        accessibility={{announcements: SILENT_DRAG_ANNOUNCEMENTS}}
      >
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <div className="odoRows">
            {rows.map((row, i) => (
              <OdometerRow
                key={row.id}
                id={row.id}
                label={row.label}
                radix={row.radix}
                color={ROW_COLORS[row.id]}
                value={value}
                frac={frac}
                onOverflowChange={handleOverflowChange}
                position={i + 1}
                total={rows.length}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="odoValueControls">
        <TextField
          name="odo-value"
          inputType="number"
          label={copy.controls.valueLabel}
          value={wholePart(value)}
          step={1}
          min={VALUE_MIN}
          onChange={e => {
            const next = parseFloat(e.target.value);
            if (!Number.isNaN(next)) {
              setValue(next);
            }
          }}
        />
        <Slider
          name="odo-value-slider"
          label={copy.controls.valueSliderLabel}
          color="brand"
          hideValue
          minValue={VALUE_MIN}
          maxValue={VALUE_SLIDER_MAX}
          step={VALUE_SLIDER_STEP}
          value={Math.min(value, VALUE_SLIDER_MAX)}
          onChange={e => setValue(Number(e.target.value))}
        />
      </div>

      <div className="odoCustomBase">
        <TextField
          name="odo-custom-base"
          inputType="number"
          label={copy.controls.customBaseLabel}
          value={customBase}
          min={CUSTOM_BASE_MIN}
          max={CUSTOM_BASE_MAX}
          onChange={e => {
            const next = parseInt(e.target.value, 10);
            if (Number.isFinite(next) && next >= CUSTOM_BASE_MIN && next <= CUSTOM_BASE_MAX) {
              setCustomBase(next);
            }
          }}
        />
        <Typography semanticTag="p" visualAppearance="body-three" className="odoHelp">
          {copy.controls.customBaseHelp}
        </Typography>
      </div>
    </main>
  );
}
