import Alert from '@code-dot-org/component-library/alert';
import Tags from '@code-dot-org/component-library/tags';
import Typography from '@code-dot-org/component-library/typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {useState} from 'react';

import './app.css';
import {announcementFor, awardBadge, INGREDIENTS, mixSummary} from './rules';
import {useAnnounce} from './shared';

export default function App() {
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const announce = useAnnounce();

  const verdict = awardBadge(selected);

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (!next.delete(id)) {
      next.add(id);
    }
    setSelected(next);
    announce(announcementFor(awardBadge(next).badge));
  };

  return (
    <Card component="main" variant="outlined" className="page">
      <CardContent>
        <Typography semanticTag="h1" visualAppearance="heading-lg">
          Build Your Trail Mix
        </Typography>
        <Alert
          type="info"
          role={undefined}
          text="Click ingredients to add or remove them from your mix. Watch the badge update below based on what you pick."
        />

        <ul className="ingredients" aria-label="Trail mix ingredients">
          {INGREDIENTS.map(ingredient => {
            const isSelected = selected.has(ingredient.id);
            return (
              <li key={ingredient.id}>
                <button
                  type="button"
                  className="ingredient"
                  aria-pressed={isSelected}
                  aria-label={ingredient.name}
                  data-contributing={verdict.contributing.includes(ingredient.id)}
                  onClick={() => toggle(ingredient.id)}
                >
                  <span className="emoji" aria-hidden="true">
                    {ingredient.emoji}
                  </span>
                  <span className="name">{ingredient.name}</span>
                  <span className="hint">
                    {isSelected ? '✓ Added — tap to remove' : 'Tap to add'}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <Card variant="outlined" className="result">
          <CardContent>
            <Typography semanticTag="h2" visualAppearance="heading-sm">
              Your Badge
            </Typography>
            <Tags size="l" tagsList={[{label: verdict.badge}]} />
            <Typography semanticTag="p" visualAppearance="body-two">
              {mixSummary(selected)}
            </Typography>
            {verdict.contributing.length > 0 && (
              <Typography semanticTag="p" visualAppearance="body-three">
                Highlighted ingredients are the ones this badge&apos;s rule matched on.
              </Typography>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
