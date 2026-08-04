import Typography from '@code-dot-org/component-library/typography';

import {bodyText, Card, DEFAULT_DECK, decks} from './decks';
import FlipCard from './FlipCard';
import {useAnnounce} from './shared';
import './flipCard.css';

/** Matches the flip transition in flipCard.css, so the read lands after the turn. */
const FLIP_DURATION_MS = 550;

function resolveDeckId(requested: string | null) {
  if (requested === null) {
    return DEFAULT_DECK;
  }
  if (!(requested in decks)) {
    // A bad ?deck= is an authoring error: render a working deck and say so.
    console.warn(`Unknown deck "${requested}"; falling back to "${DEFAULT_DECK}".`);
    return DEFAULT_DECK;
  }
  return requested;
}

export default function App() {
  const announce = useAnnounce();
  const deck =
    decks[resolveDeckId(new URLSearchParams(window.location.search).get('deck'))];

  const announceFlip = (card: Card, flipping: boolean) => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const message = flipping
      ? `${card.term}. Definition: ${bodyText(card.body)}`
      : `${card.term}. Showing term side.`;
    window.setTimeout(
      () => announce(message),
      reduceMotion ? 0 : FLIP_DURATION_MS,
    );
  };

  return (
    <main style={{padding: '16px 8px'}}>
      <Typography
        semanticTag="h1"
        visualAppearance="heading-sm"
        style={{textAlign: 'center', marginBottom: 16}}
      >
        {deck.title}
      </Typography>
      <ul className="cardGrid">
        {deck.cards.map(card => (
          <li key={card.term}>
            <FlipCard card={card} onFlip={announceFlip} />
          </li>
        ))}
      </ul>
    </main>
  );
}
