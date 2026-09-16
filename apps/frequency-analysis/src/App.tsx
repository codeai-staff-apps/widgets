import SegmentedButtons from '@code-dot-org/component-library/segmentedButtons';
import Typography from '@code-dot-org/component-library/typography';

import Board from './components/Board';
import CaesarControls from './components/CaesarControls';
import DecodedMessage from './components/DecodedMessage';
import MessagePicker from './components/MessagePicker';
import RandomControls from './components/RandomControls';
import './frequencyAnalysis.css';
import {strings} from './strings';
import type {ControlsMode} from './useFrequencyAnalysis';
import {useFrequencyAnalysis} from './useFrequencyAnalysis';

export default function App() {
  const analysis = useFrequencyAnalysis();

  return (
    <main className="freq-page">
      <Typography semanticTag="h1" visualAppearance="heading-lg">
        {strings.heading}
      </Typography>
      <Typography semanticTag="p" visualAppearance="body-two">
        {strings.intro}
      </Typography>

      <div className="freq-layout">
        <div className="freq-message-pane">
          <MessagePicker
            messages={analysis.messages}
            messageIndex={analysis.messageIndex}
            onSelect={analysis.selectMessage}
            onAddCustomMessage={analysis.addCustomMessage}
          />
          <DecodedMessage decoded={analysis.decoded} />
        </div>

        <div className="freq-board-pane">
          <Board analysis={analysis} />

          <div className="freq-mode-row">
            <SegmentedButtons
              selectedButtonValue={analysis.controls}
              onChange={value => analysis.setControls(value as ControlsMode)}
              buttons={[
                {value: 'caesar', label: strings.modeCaesar},
                {value: 'substitution', label: strings.modeRandom},
              ]}
            />
          </div>

          {analysis.controls === 'caesar' ? (
            <CaesarControls analysis={analysis} />
          ) : (
            <RandomControls analysis={analysis} />
          )}
        </div>
      </div>
    </main>
  );
}
