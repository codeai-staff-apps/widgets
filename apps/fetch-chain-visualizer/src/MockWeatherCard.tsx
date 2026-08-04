import Typography from '@code-dot-org/component-library/typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';

import {mockUi} from './steps';

/** An illustration of the finished UI, not a working weather widget. */
export default function MockWeatherCard() {
  return (
    <Card variant="outlined" sx={{background: 'var(--background-brand-purple-extra-light)'}}>
      <CardContent component={Stack} gap={1}>
        <Typography semanticTag="p" visualAppearance="overline-three" noMargin>
          {mockUi.eyebrow}
        </Typography>
        <Stack direction="row" gap={2} alignItems="center">
          <span aria-hidden="true" style={{fontSize: '2rem'}}>
            ⛅
          </span>
          <div>
            <Typography semanticTag="p" visualAppearance="heading-sm" noMargin>
              {mockUi.city}
            </Typography>
            <Typography semanticTag="p" visualAppearance="body-two" noMargin>
              {mockUi.temperature} · {mockUi.conditions}
            </Typography>
          </div>
        </Stack>
        <Typography semanticTag="p" visualAppearance="body-four" noMargin>
          {mockUi.sideNote}
        </Typography>
      </CardContent>
    </Card>
  );
}
