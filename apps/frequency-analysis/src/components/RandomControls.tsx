import Button from '@code-dot-org/component-library/button';
import SegmentedButtons from '@code-dot-org/component-library/segmentedButtons';

import {strings} from '../strings';
import type {ColumnOrder, FrequencyAnalysis} from '../useFrequencyAnalysis';

export interface RandomControlsProps {
  analysis: FrequencyAnalysis;
}

/** Sort the chart's columns and the letter bank; assign or clear every guess at once. */
export default function RandomControls({analysis}: RandomControlsProps) {
  return (
    <div className="freq-controls">
      <fieldset className="freq-fieldset">
        <legend>{strings.sortOriginalsLabel}</legend>
        <SegmentedButtons
          selectedButtonValue={analysis.columnOrder}
          onChange={value => analysis.sortColumns(value as ColumnOrder)}
          buttons={[
            {value: 'alphabetic', label: strings.sortAlphabetic},
            {value: 'frequency', label: strings.sortByFrequency},
          ]}
        />
      </fieldset>
      <fieldset className="freq-fieldset">
        <legend>{strings.sortSubstitutionsLabel}</legend>
        <div className="freq-button-row">
          <Button text={strings.sortRandom} onClick={() => analysis.sortBank('random')} />
          <Button text={strings.sortAlphabetic} onClick={() => analysis.sortBank('alphabetic')} />
          <Button text={strings.sortByFrequency} onClick={() => analysis.sortBank('frequency')} />
          <Button text={strings.assignAll} type="secondary" onClick={analysis.assignAll} />
          <Button text={strings.reset} type="secondary" onClick={analysis.resetAssignments} />
        </div>
      </fieldset>
    </div>
  );
}
