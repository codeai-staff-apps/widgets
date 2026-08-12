import Alert from '@code-dot-org/component-library/alert';
import Toggle from '@code-dot-org/component-library/toggle';
import Typography from '@code-dot-org/component-library/typography';
import {useState} from 'react';

import './app.css';
import './demoSite.css';
import DemoSite from './DemoSite';
import {useAnnounce} from './shared';

const OBSERVATIONS = [
  'Text still shows — it just falls back to plain black, left-aligned, one column.',
  'The three cards stack top to bottom; nothing sits side by side anymore.',
  "The button looks like a plain button — nothing marks it as Fern & Co.'s.",
  'No brand color, spacing rhythm, or type scale — no sense of whose page this is.',
];

export default function App() {
  const [cssOn, setCssOn] = useState(true);
  const announce = useAnnounce();

  const handleToggle = () => {
    const next = !cssOn;
    setCssOn(next);
    announce(
      next
        ? 'CSS switched on. Fern & Co.’s colors, layout, and type are back.'
        : 'CSS switched off. Only default browser styling is left — see the notes below the preview.',
    );
  };

  return (
    <main className="page">
      <Typography semanticTag="h1" visualAppearance="heading-lg">
        CSS Toggle
      </Typography>
      <Alert
        type="info"
        role={undefined}
        showIcon={false}
        text="Fern & Co.'s page below is built from the same HTML either way. Flip the switch to add or remove its CSS, and watch what actually depends on it."
      />

      <div className="toggleRow">
        <Toggle
          id="css-enabled"
          name="css-enabled"
          checked={cssOn}
          onChange={handleToggle}
          label="Apply CSS"
        />
      </div>

      <DemoSite cssOn={cssOn} />

      {!cssOn && (
        <div className="observations">
          <Typography semanticTag="h2" visualAppearance="heading-sm">
            What changed
          </Typography>
          <ul>
            {OBSERVATIONS.map(observation => (
              <li key={observation}>{observation}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="discussionRow">
        <Alert
          type="primary"
          role={undefined}
          showIcon={false}
          text="Ask your class: how does CSS turn a design idea into a real web page — and what do designers need to communicate clearly when styling one?"
        />
      </div>
    </main>
  );
}
