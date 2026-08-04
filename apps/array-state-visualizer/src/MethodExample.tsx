import Alert from '@code-dot-org/component-library/alert';
import Tags from '@code-dot-org/component-library/tags';
import Typography from '@code-dot-org/component-library/typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import {useId} from 'react';

import {emptyMessage, type ArrayCard, type Example} from './examples';
import {highlight} from './highlight';
import {CodeBlock, visuallyHidden} from './shared';

import './arrayItems.css';

function ArrayPanel({card, run}: {card: ArrayCard; run: boolean}) {
  const titleId = useId();
  return (
    <Card variant="outlined" sx={{flex: '1 1 240px'}}>
      <CardContent component={Stack} gap={1}>
        <Tags tagsList={[{label: card.badge}]} size="s" />
        <Typography semanticTag="h3" visualAppearance="heading-xs" id={titleId} noMargin>
          {card.title}
        </Typography>
        {run ? (
          <ul className="arrayItems" aria-labelledby={titleId}>
            {card.items.map((item, i) => (
              <li key={i} className={`item ${item.state}`}>
                {item.text}
                {item.state === 'removed' && <span style={visuallyHidden}> (removed)</span>}
              </li>
            ))}
          </ul>
        ) : (
          <Typography semanticTag="p" visualAppearance="body-three" noMargin>
            <em style={{color: 'var(--text-neutral-secondary)'}}>{emptyMessage}</em>
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default function MethodExample({
  example,
  run,
  onRun,
}: {
  example: Example;
  run: boolean;
  onRun: () => void;
}) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId}>
      <Typography semanticTag="h2" visualAppearance="heading-md" id={headingId}>
        {example.heading}
      </Typography>
      <Stack gap={2}>
        <CodeBlock summary={example.codeSummary}>{highlight(example.code)}</CodeBlock>
        <div>
          <Button variant="contained" onClick={onRun}>
            Run this code
          </Button>
        </div>
        <Stack direction="row" gap={2} flexWrap="wrap">
          {example.cards.map(card => (
            <ArrayPanel key={card.badge + card.title} card={card} run={run} />
          ))}
        </Stack>
        {run && (
          <Alert
            type={example.verdict.mutates ? 'warning' : 'success'}
            // Not a live region: the run is already announced once, in full,
            // through useAnnounce(). Two channels would describe one click twice.
            role="note"
            // The runtime vendors no icon font, so DS icons render as blank boxes.
            showIcon={false}
            text={`${example.verdict.badge}: ${example.verdict.text}`}
          />
        )}
      </Stack>
    </section>
  );
}
