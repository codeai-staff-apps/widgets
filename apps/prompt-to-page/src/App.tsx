import Alert from '@code-dot-org/component-library/alert';
import Button from '@code-dot-org/component-library/button';
import SegmentedButtons from '@code-dot-org/component-library/segmentedButtons';
import Toggle from '@code-dot-org/component-library/toggle';
import Typography from '@code-dot-org/component-library/typography';
import {useState} from 'react';

import {
  DESTINATIONS,
  SLOTS,
  SLOT_BLANK,
  SLOT_LABEL,
  SLOT_LAYER,
  SLOT_LETTER,
  describePage,
  getDestination,
  promptText,
  type Choice,
  type DestinationId,
  type Selection,
  type Slot,
} from './destinations';
import {playPop} from './pop';
import SamplePage from './SamplePage';

import './page.css';

/** Three complete versions to choose from at the end: the first options, the second options, and a mix. */
const VERSIONS: readonly {name: string; selection: Selection}[] = [
  {name: 'Version A', selection: {audience: 0, feel: 0, parts: 0, content: 0}},
  {name: 'Version B', selection: {audience: 1, feel: 1, parts: 1, content: 1}},
  {name: 'Version C', selection: {audience: 0, feel: 1, parts: 0, content: 1}},
];

/** The letter badge that ties a switch, its prompt line and its page layer together. */
function Badge({slot}: {slot: Slot}) {
  return (
    <b className="badge" aria-hidden="true">
      {SLOT_LETTER[slot]}
    </b>
  );
}

export default function App() {
  const [destinationId, setDestinationId] = useState<DestinationId>('wheel');
  // A switch being off is separate from which option it holds, so turning a
  // switch off and on again remembers the option you had picked.
  const [on, setOn] = useState<Record<Slot, boolean>>({audience: false, feel: false, parts: false, content: false});
  const [choice, setChoice] = useState<Record<Slot, Choice>>({audience: 0, feel: 0, parts: 0, content: 0});
  const [tried, setTried] = useState<ReadonlySet<Slot>>(new Set());
  const [pulse, setPulse] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [pickedVersion, setPickedVersion] = useState<number | null>(null);

  const destination = getDestination(destinationId);
  const selection = Object.fromEntries(SLOTS.map(slot => [slot, on[slot] ? choice[slot] : null])) as Selection;
  const explored = tried.size === SLOTS.length;
  const picked = pickedVersion === null ? null : VERSIONS[pickedVersion];

  /** Every change to the prompt sends a spark to the page, with a soft pop. */
  const sendSpark = () => {
    setPulse(count => count + 1);
    if (soundOn) {
      playPop();
    }
  };

  const toggleSlot = (slot: Slot) => {
    setOn(current => ({...current, [slot]: !current[slot]}));
    if (!on[slot]) {
      setTried(current => new Set(current).add(slot));
    }
    sendSpark();
  };

  const swapOption = (slot: Slot) => {
    setChoice(current => ({...current, [slot]: current[slot] === 0 ? 1 : 0}));
    sendSpark();
  };

  const changeDestination = (id: string) => {
    setDestinationId(id as DestinationId);
    setPickedVersion(null);
    sendSpark();
  };

  return (
    <main className="page">
      <header className="pageHeader">
        <div>
          <Typography semanticTag="h1" visualAppearance="heading-lg">
            Prompt to Page
          </Typography>
          <ol className="steps">
            <li>Flip a switch.</li>
            <li>Watch your prompt grow.</li>
            <li>See the page change.</li>
          </ol>
          <Typography semanticTag="p" visualAppearance="body-one" noMargin>
            Then tap the page you would want.
          </Typography>
        </div>
        <Toggle
          name="sound"
          label="Pop sound"
          size="s"
          checked={soundOn}
          onChange={event => setSoundOn(event.target.checked)}
        />
      </header>

      <div role="group" aria-label="Which page are you prompting for?" className="destinations">
        <SegmentedButtons
          size="m"
          className="destinationButtons"
          selectedButtonValue={destinationId}
          onChange={changeDestination}
          buttons={DESTINATIONS.map(item => ({value: item.id, label: item.label}))}
        />
      </div>

      <section className="promptCard" aria-label="Switches and prompt">
        <div role="group" aria-label="Switches" className="chipRow">
          {SLOTS.map(slot => {
            const other = destination[slot][on[slot] ? (choice[slot] === 0 ? 1 : 0) : 0];
            return (
              <div key={slot} role="group" aria-label={SLOT_LABEL[slot]} className="chipCell" data-slot={slot} data-on={on[slot]}>
                <Badge slot={slot} />
                <Button
                  className="chip"
                  size="l"
                  type={on[slot] ? 'primary' : 'secondary'}
                  color={on[slot] ? 'purple' : 'black'}
                  text={SLOT_LABEL[slot]}
                  iconLeft={{iconName: on[slot] ? 'check' : 'plus', iconStyle: 'solid'}}
                  aria-pressed={on[slot]}
                  onClick={() => toggleSlot(slot)}
                />
                <div className="swap">
                  {on[slot] && (
                    <Button
                      type="tertiary"
                      color="black"
                      size="s"
                      text={`Try: ${other.label}`}
                      onClick={() => swapOption(slot)}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="promptBox">
          <Typography semanticTag="h2" visualAppearance="heading-xs" noMargin>
            Your prompt
          </Typography>
          <p className="promptBase">{destination.base}</p>
          {SLOTS.map(slot => {
            const value = selection[slot];
            return value === null ? (
              // Faded blank: this is where the switch's sentence will land.
              <p key={`${slot}-blank`} className="slotLine slotBlank" data-slot={slot} aria-hidden="true">
                <Badge slot={slot} />
                {SLOT_BLANK[slot]}
              </p>
            ) : (
              // Re-keyed on the option so a newly filled or swapped line flashes.
              <p key={`${slot}-${value}`} className="slotLine slotFilled" data-slot={slot}>
                <Badge slot={slot} />
                {destination[slot][value].clause}
              </p>
            );
          })}
        </div>
      </section>

      <div className="spark">
        <span className="sparkLine" aria-hidden="true" />
        <span key={pulse} className={pulse > 0 ? 'sparkDot sparkDotPulse' : 'sparkDot'} aria-hidden="true" />
        <span className="sparkText">Your prompt builds the page</span>
        <span className="sparkLine" aria-hidden="true" />
      </div>

      <section aria-label="Sample page">
        <div role="img" aria-label={describePage(destination, selection)}>
          <SamplePage destinationId={destinationId} selection={selection} />
        </div>
        <ul className="layers" role="status" aria-atomic="true">
          {SLOTS.map(slot => (
            <li key={slot} data-slot={slot} data-on={on[slot]}>
              <Badge slot={slot} />
              {SLOT_LAYER[slot]}: {on[slot] ? 'filled in' : 'still gray'}
            </li>
          ))}
        </ul>
      </section>

      <section className="finale" aria-labelledby="finale-heading">
        <Typography semanticTag="h2" visualAppearance="heading-md" id="finale-heading">
          Which page would you want?
        </Typography>
        {explored ? (
          <>
            <Typography semanticTag="p" visualAppearance="body-one" noMargin>
              Tap your pick. There is no right answer.
            </Typography>
            <div role="group" aria-label="Page versions" className="versions">
              {VERSIONS.map((version, index) => (
                <button
                  key={version.name}
                  type="button"
                  className="version"
                  aria-pressed={pickedVersion === index}
                  aria-label={`${version.name}: ${SLOTS.map(slot => destination[slot][version.selection[slot]!].label).join(', ')}`}
                  onClick={() => {
                    setPickedVersion(index);
                    sendSpark();
                  }}
                >
                  <span className="versionThumb" aria-hidden="true">
                    <span className="versionPage">
                      <SamplePage destinationId={destinationId} selection={version.selection} />
                    </span>
                  </span>
                  <span className="versionName">{version.name}</span>
                </button>
              ))}
            </div>
            {picked && (
              <div className="reflection">
                <Alert
                  type="success"
                  isImmediateImportance={false}
                  text={`Nice pick! ${picked.name} is the page you would want.`}
                />
                <Typography semanticTag="p" visualAppearance="body-two" noMargin>
                  <strong>The prompt behind it:</strong> {promptText(destination, picked.selection)}
                </Typography>
                <Typography semanticTag="p" visualAppearance="body-one" noMargin>
                  Which switch changed the page the most? What would you swap next?
                </Typography>
              </div>
            )}
          </>
        ) : (
          <Alert
            type="info"
            isImmediateImportance={false}
            text={`Flip all four switches to unlock this. You have flipped ${tried.size} of ${SLOTS.length}.`}
          />
        )}
      </section>
    </main>
  );
}
