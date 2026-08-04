import Typography from '@code-dot-org/component-library/typography';

import {DEFAULT_DECK, decks} from './decks';
import FlipCard from './FlipCard';
import './flipCard.css';

export default function App() {
  const requested = new URLSearchParams(window.location.search).get('deck');
  const deck = decks[requested ?? DEFAULT_DECK] ?? decks[DEFAULT_DECK];

  return (
    <main style={{padding: '16px 8px'}}>
      <Typography
        semanticTag="h1"
        visualAppearance="heading-sm"
        style={{textAlign: 'center', marginBottom: 16}}
      >
        {deck.title}
      </Typography>
      <div className="cardGrid">
        {deck.cards.map(card => (
          <FlipCard key={card.term} card={card} />
        ))}
      </div>
    </main>
  );
}
