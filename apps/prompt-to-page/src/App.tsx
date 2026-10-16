import Alert from '@code-dot-org/component-library/alert';
import Button from '@code-dot-org/component-library/button';
import SegmentedButtons from '@code-dot-org/component-library/segmentedButtons';
import Toggle from '@code-dot-org/component-library/toggle';
import Typography from '@code-dot-org/component-library/typography';
import {useState} from 'react';

import {
  DESTINATIONS,
  SLOTS,
  SLOT_LABEL,
  SLOT_LAYER,
  describePage,
  getDestination,
  promptClauses,
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
  const clauses = promptClauses(destination, selection);
  const filled = SLOTS.filter(slot => on[slot]).map(slot => SLOT_LAYER[slot].toLowerCase());
  const gray = SLOTS.filter(slot => !on[slot]).map(slot => SLOT_LAYER[slot].toLowerCase());
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

  const swapOption = (slot: Slot, value: string) => {
    setChoice(current => ({...current, [slot]: Number(value) as Choice}));
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

      <section className="promptCard" aria-labelledby="prompt-heading">
        <Typography semanticTag="h2" visualAppearance="heading-xs" id="prompt-heading" noMargin>
          Your prompt
        </Typography>
        <p className="promptText">
          {destination.base}
          {clauses.map(clause => (
            // Re-keyed on the option so a newly added or swapped clause flashes.
            <span key={`${clause.slot}-${clause.choice}`} className="clause" data-slot={clause.slot}>
              {' '}
              {clause.text}
            </span>
          ))}
        </p>

        <div role="group" aria-label="Details to add to the prompt" className="chipRow">
          {SLOTS.map(slot => (
            <div key={slot} className="chipCell" data-slot={slot} data-on={on[slot]}>
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
            </div>
          ))}
        </div>

        {filled.length > 0 && (
          <div className="swapGrid">
            {SLOTS.filter(slot => on[slot]).map(slot => (
              <div
                key={slot}
                role="group"
                aria-label={`${SLOT_LABEL[slot]}: pick an option`}
                className="swapRow"
                data-slot={slot}
              >
                <span className="swapLabel">{SLOT_LABEL[slot]}</span>
                <SegmentedButtons
                  size="s"
                  selectedButtonValue={String(choice[slot])}
                  onChange={value => swapOption(slot, value)}
                  buttons={destination[slot].map((option, index) => ({value: String(index), label: option.label}))}
                />
              </div>
            ))}
          </div>
        )}
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
        <p className="caption" role="status">
          Filled in: {filled.join(', ') || 'nothing yet'}. Still gray: {gray.join(', ') || 'nothing'}.
        </p>
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
