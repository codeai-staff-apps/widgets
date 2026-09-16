import Button from '@code-dot-org/component-library/button';
import Slider from '@code-dot-org/component-library/slider';
import TextField from '@code-dot-org/component-library/textField';
import Typography from '@code-dot-org/component-library/typography';
import {useCallback, useState} from 'react';

import {copy} from './copy';
import {fractionalPart} from './odometerMath';
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

const CUSTOM_BASE_MIN = 2;
const CUSTOM_BASE_MAX = 36;
const DEFAULT_CUSTOM_BASE = 20;

/** Decimal places kept when echoing the shared value into the number field — auto-play accumulates float noise past this. */
const VALUE_DISPLAY_PRECISION = 3;

function round(n: number, precision: number): number {
  const factor = 10 ** precision;
  return Math.round(n * factor) / factor;
}

export default function App() {
  const {value, setValue, playing, start, pause, reset, speed, setSpeed} = useOdometerPlayback();
  const [customBase, setCustomBase] = useState(DEFAULT_CUSTOM_BASE);
  const announce = useAnnounce();

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
  const rows = [
    {label: copy.rowLabels.binary, radix: 2},
    {label: copy.rowLabels.octal, radix: 8},
    {label: copy.rowLabels.decimal, radix: 10},
    {label: copy.rowLabels.hexadecimal, radix: 16},
    {label: copy.rowLabels.custom, radix: customBase},
  ];

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

      <div className="odoRows">
        {rows.map(row => (
          <OdometerRow
            key={row.label}
            label={row.label}
            radix={row.radix}
            value={value}
            frac={frac}
            onOverflowChange={handleOverflowChange}
          />
        ))}
      </div>

      <div className="odoValueControls">
        <TextField
          name="odo-value"
          inputType="number"
          label={copy.controls.valueLabel}
          value={round(value, VALUE_DISPLAY_PRECISION)}
          step={VALUE_SLIDER_STEP}
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
          hideValue
          minValue={VALUE_MIN}
          maxValue={VALUE_SLIDER_MAX}
          step={VALUE_SLIDER_STEP}
          value={Math.min(value, VALUE_SLIDER_MAX)}
          onChange={e => setValue(Number(e.target.value))}
        />
        <Typography semanticTag="p" visualAppearance="body-three" className="odoHelp">
          {copy.controls.valueSliderHelp}
        </Typography>
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
