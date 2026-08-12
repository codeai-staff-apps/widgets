import Alert from '@code-dot-org/component-library/alert';
import Checkbox from '@code-dot-org/component-library/checkbox';
import Typography from '@code-dot-org/component-library/typography';
import {useState} from 'react';

import './app.css';
import './nightingale.css';
import NightingaleCinema from './NightingaleCinema';
import {useAnnounce} from './shared';

const DIRECTIONS =
  'This is a real, working mock webpage, not a screenshot. Turn its CSS off, then back on, and see what changes.';

const FACILITATOR_TIP =
  'Facilitator tip: if someone says "nothing would show without CSS," point at the screen with CSS off — the film title, the ticket text, and every nav item are still sitting right there. What is actually gone is the color, the spacing, and the type: the signals that make a page feel designed instead of just present.';

interface Annotation {
  key: string;
  on: string;
  off: string;
}

const ANNOTATIONS: Annotation[] = [
  {
    key: 'Type',
    on: 'A bold italic marquee face signals "classic revival cinema" before anyone reads a word.',
    off: 'Same words, but the plain serif face gives no hint about tone or brand.',
  },
  {
    key: 'Color',
    on: 'Deep navy and marquee gold set a mood and separate one section from the next at a glance.',
    off: 'Every section looks identical: black text on a white background.',
  },
  {
    key: 'Layout',
    on: 'The nav, hero, and showtimes sit in an intentional grid with real breathing room.',
    off: 'Everything stacks in one long column, top to bottom, in HTML order.',
  },
  {
    key: 'Images',
    on: 'Posters sit in a neat row with matching frames.',
    off: 'The same posters still load — CSS did not create them — but stacked one after another.',
  },
  {
    key: 'Hierarchy',
    on: 'Size, weight, and color tell you what to read first: film title, then time, then details.',
    off: 'Every line carries about the same weight, so nothing tells you what matters most.',
  },
];

export default function App() {
  const [cssOn, setCssOn] = useState(true);
  const announce = useAnnounce();

  const toggleCss = () => {
    const next = !cssOn;
    setCssOn(next);
    announce(
      next
        ? 'CSS turned on. Nightingale Cinema is styled again.'
        : 'CSS turned off. Nightingale Cinema is down to plain HTML.',
    );
  };

  return (
    <main className="page">
      <Typography semanticTag="h1" visualAppearance="heading-lg">
        The CSS Switch
      </Typography>
      <Alert type="info" isImmediateImportance={false} text={DIRECTIONS} />

      <div className="stage">
        <div className="frame">
          <NightingaleCinema styled={cssOn} />
        </div>
        <Checkbox
          name="css-toggle"
          label="Apply CSS to Nightingale Cinema"
          checked={cssOn}
          onChange={toggleCss}
        />
      </div>

      <section className="annotations">
        <Typography semanticTag="h2" visualAppearance="heading-sm">
          What just changed
        </Typography>
        <ul className="ann-list">
          {ANNOTATIONS.map(a => (
            <li key={a.key}>
              <span className="ann-key">{a.key}</span>
              <span>{cssOn ? a.on : a.off}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="discuss">
        <Typography semanticTag="h2" visualAppearance="heading-sm">
          For discussion
        </Typography>
        <ol>
          <li>How does CSS turn a design idea into a real web page?</li>
          <li>What do designers need to communicate clearly when styling a page?</li>
        </ol>
        <Alert type="primary" isImmediateImportance={false} text={FACILITATOR_TIP} />
      </section>
    </main>
  );
}
