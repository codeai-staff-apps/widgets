import Alert from '@code-dot-org/component-library/alert';
import Button from '@code-dot-org/component-library/button';
import RadioButton from '@code-dot-org/component-library/radioButton';
import Typography from '@code-dot-org/component-library/typography';
import {useId, useMemo, useState, type ReactNode} from 'react';

import './app.css';
import './mockups.css';
import {MOCKUPS} from './Mockups';
import {useAnnounce} from './shared';
import {Screen, useScreenMachine} from './shared';
import {BRIDGE_NOTE, DIRECTIONS, shuffle, STOPS, TRY_AGAIN_NOTE, type Option, type Stop} from './stops';

export default function App() {
  const announce = useAnnounce();
  const machine = useScreenMachine(STOPS.map((_, index) => String(index)), {
    onEnter: id => {
      const stop = STOPS[Number(id)];
      announce(`${stop.era}. ${stop.question}`);
    },
  });
  // Shuffled once per page load, so an option never moves under the learner
  // when they navigate back to a stop they already saw.
  const optionOrder = useMemo(() => STOPS.map(stop => shuffle(stop.options)), []);

  return (
    <main className="page">
      <Typography semanticTag="h1" visualAppearance="heading-lg">
        The Evolution of Web Design
      </Typography>
      <Alert type="info" role={undefined} text={DIRECTIONS} />

      {/* Position meter for the four stops; the heading already carries the same
          information in text, so this row is decorative. */}
      <div className="dots" aria-hidden="true">
        {STOPS.map((stop, index) => (
          <span
            key={stop.era}
            className={`dot${index === machine.index ? ' active' : index < machine.index ? ' done' : ''}`}
          />
        ))}
      </div>

      {STOPS.map((stop, index) => (
        <Screen
          key={stop.era}
          machine={machine}
          id={String(index)}
          heading={`Stop ${index + 1} of ${STOPS.length}: ${stop.era}`}
        >
          <StopView
            stop={stop}
            options={optionOrder[index]}
            mockup={MOCKUPS[index]}
            isFirst={index === 0}
            isLast={index === STOPS.length - 1}
            onBack={machine.back}
            onNext={machine.next}
          />
        </Screen>
      ))}
    </main>
  );
}

interface StopViewProps {
  stop: Stop;
  options: readonly Option[];
  mockup: ReactNode;
  isFirst: boolean;
  isLast: boolean;
  onBack: () => void;
  onNext: () => void;
}

/**
 * One stop. State lives here so that leaving the stop clears the answer —
 * the original re-renders every stop blank in both directions.
 */
function StopView({stop, options, mockup, isFirst, isLast, onBack, onNext}: StopViewProps) {
  const [chosen, setChosen] = useState<Option | null>(null);
  const announce = useAnnounce();
  const groupName = useId();

  const choose = (option: Option) => {
    setChosen(option);
    announce(option.feedback);
  };

  return (
    <>
      <Typography semanticTag="p" visualAppearance="overline-two" className="era-label" noMargin>
        {stop.era}
      </Typography>
      {/* Decorative: the era label and the question already say what it shows. */}
      <div className="mockup-frame" aria-hidden="true">
        {mockup}
      </div>

      <fieldset className="options">
        <legend>{stop.question}</legend>
        {options.map(option => {
          const isChosen = chosen === option;
          return (
            <RadioButton
              key={option.text}
              name={groupName}
              value={option.text}
              label={option.text}
              checked={isChosen}
              onChange={() => choose(option)}
              // Layer 1b: re-scope the DS's text/accent tokens on the chosen
              // option only, so it turns green for the primary fit and amber
              // otherwise — the original's fastest feedback signal.
              className={
                isChosen ? `option chosen${option.primary ? ' primary-fit' : ''}` : 'option'
              }
            />
          );
        })}
      </fieldset>

      {chosen && (
        <>
          <Alert type="info" role={undefined} text={chosen.feedback} />
          <Typography semanticTag="p" visualAppearance="body-three">
            {TRY_AGAIN_NOTE}
          </Typography>
          {isLast && <Alert type="primary" role={undefined} text={BRIDGE_NOTE} />}
        </>
      )}

      <div className="nav-row">
        <Button type="secondary" color="black" text="Back" disabled={isFirst} onClick={onBack} />
        {!isLast && <Button text="Next" disabled={!chosen} onClick={onNext} />}
      </div>
    </>
  );
}
