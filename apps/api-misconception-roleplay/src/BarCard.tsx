import Typography from '@code-dot-org/component-library/typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type {ReactNode} from 'react';

/** A card introduced by a small label and a title, as the original's dark strip did. */
export default function BarCard({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Card variant="outlined">
      <CardContent component={Stack} gap={1.5}>
        <div>
          <Typography semanticTag="p" visualAppearance="overline-three" noMargin>
            {label}
          </Typography>
          <Typography semanticTag="p" visualAppearance="heading-xs" noMargin>
            {title}
          </Typography>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
