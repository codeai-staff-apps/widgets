import Button from '@code-dot-org/component-library/button';
import TextField from '@code-dot-org/component-library/textField';
import Typography from '@code-dot-org/component-library/typography';
import type {ChangeEvent} from 'react';

import {strings} from '../strings';
import type {FrequencyAnalysis} from '../useFrequencyAnalysis';

export interface CaesarControlsProps {
  analysis: FrequencyAnalysis;
}

/** Shift the whole alphabet left or right; every letter is always fully (and identically) mapped. */
export default function CaesarControls({analysis}: CaesarControlsProps) {
  const handleShiftChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    if (Number.isFinite(next)) {
      analysis.setShiftAmount(Math.trunc(next));
    }
  };

  return (
    <div className="freq-controls">
      <Typography semanticTag="p" visualAppearance="body-two">
        {strings.shiftLabel}
      </Typography>
      <div className="freq-shift-row">
        <Button
          text={strings.shiftLeft}
          iconLeft={{iconName: 'arrow-left', iconStyle: 'solid'}}
          type="secondary"
          onClick={() => analysis.shiftBy(-1)}
        />
        <TextField
          name="shift-amount"
          inputType="number"
          label={strings.shiftFieldLabel}
          value={analysis.shift}
          onChange={handleShiftChange}
          className="freq-shift-field"
        />
        <Button
          text={strings.shiftRight}
          iconRight={{iconName: 'arrow-right', iconStyle: 'solid'}}
          type="secondary"
          onClick={() => analysis.shiftBy(1)}
        />
        <Button text={strings.reset} type="secondary" onClick={analysis.resetShift} />
      </div>
    </div>
  );
}
