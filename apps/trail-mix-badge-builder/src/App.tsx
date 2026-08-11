import Alert from '@code-dot-org/component-library/alert';
import Typography from '@code-dot-org/component-library/typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import {useState} from 'react';

import './app.css';
import {announcementFor, awardBadge, type BadgeVariant, INGREDIENTS, mixSummary} from './rules';
import {useAnnounce} from './shared';

/**
 * The five badge palettes, one per rule outcome. This is a deliberate step
 * down the DSCO > MUI > bespoke ladder: DSCO `Tags` has no per-tag colour
 * API, and the colour is a pedagogical signal (which rule fired), not
 * decoration. Protein/Sweet borrow the DS success/warning registers
 * (repointed for this app's palette in theme.css); Empty/Balanced/Mixed have
 * no matching DS category, so they use the original's literal hex.
 */
const BADGE_STYLES: Record<BadgeVariant, {bg: string; color: string; border: string}> = {
  empty: {bg: '#EDE6D6', color: '#5C3D2E', border: '#C9A876'},
  protein: {
    bg: 'var(--background-success-light)',
    color: 'var(--text-success-primary)',
    border: 'var(--border-success-primary)',
  },
  sweet: {
    bg: 'var(--background-warning-light)',
    color: 'var(--text-warning-primary)',
    border: 'var(--border-warning-primary)',
  },
  balanced: {bg: '#E4D9C2', color: '#5C3D2E', border: '#8B5E3C'},
  mixed: {bg: '#EAE0C4', color: '#6B4226', border: '#A9835B'},
};

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
    <Card
      component="main"
      variant="outlined"
      className="page"
      sx={{
        bgcolor: '#FFFDF6',
        border: '2px solid #C9A876',
        borderRadius: '16px',
        boxShadow: '6px 6px 0 rgba(92,61,46,0.15)',
      }}
    >
      <CardContent>
        <Typography semanticTag="h1" visualAppearance="heading-lg">
          Build Your Trail Mix
        </Typography>
        <Alert
          type="info"
          role={undefined}
          showIcon={false}
          className="directions"
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

        <Card
          variant="outlined"
          className="result"
          sx={{
            bgcolor: '#FAF3E3',
            border: '2px solid #C9A876',
            borderRadius: '12px',
            boxShadow: '3px 3px 0 rgba(92,61,46,0.18)',
          }}
        >
          <CardContent>
            <Typography
              semanticTag="h2"
              visualAppearance="overline-two"
              style={{color: 'var(--text-neutral-tertiary)'}}
            >
              Your Badge
            </Typography>
            <Chip
              label={verdict.badge}
              variant="outlined"
              sx={{
                height: 'auto',
                borderRadius: '20px',
                borderWidth: '2px',
                bgcolor: BADGE_STYLES[verdict.variant].bg,
                borderColor: BADGE_STYLES[verdict.variant].border,
                color: BADGE_STYLES[verdict.variant].color,
                fontFamily: 'var(--font-family-heading)',
                fontSize: '1.125rem',
                '& .MuiChip-label': {padding: '8px 16px'},
              }}
            />
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
