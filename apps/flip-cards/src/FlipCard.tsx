import Typography from '@code-dot-org/component-library/typography';
import {useState} from 'react';

import {Card, Segment} from './decks';

/*
 * Accessibility contract (fixes the original's answer-leak defect): the
 * button's accessible name is the term plus flip state only — never the
 * definition. The hidden face is aria-hidden, so a screen reader cannot
 * read the answer before flipping.
 */

function renderSegments(segments: Segment[]) {
  return segments.map((s, i) => {
    if (s.bold) {
      return <strong key={i}>{s.text}</strong>;
    }
    if (s.italic) {
      return <em key={i}>{s.text}</em>;
    }
    return <span key={i}>{s.text}</span>;
  });
}

export default function FlipCard({card}: {card: Card}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      className="flipCard"
      aria-pressed={flipped}
      aria-label={`${card.term} — ${flipped ? 'showing definition, press to show term' : 'press to reveal definition'}`}
      onClick={() => setFlipped(f => !f)}
    >
      <div className="flipInner">
        <div className="flipFace flipFront" aria-hidden={flipped}>
          <div className="emoji" aria-hidden="true">
            {card.emoji}
          </div>
          <Typography
            semanticTag="span"
            visualAppearance="heading-md"
            style={{color: 'inherit'}} // front face is brand purple; keep white
          >
            {card.term}
          </Typography>
          <span className="hint">Flip for definition</span>
        </div>
        <div className="flipFace flipBack" aria-hidden={!flipped}>
          <span className="backLabel">{card.term}</span>
          <Typography semanticTag="p" visualAppearance="body-two">
            {renderSegments(card.definition)}
          </Typography>
        </div>
      </div>
    </button>
  );
}
