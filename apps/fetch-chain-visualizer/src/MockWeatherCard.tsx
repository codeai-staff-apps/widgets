import Typography from '@code-dot-org/component-library/typography';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

import {mockUi} from './steps';

/** An illustration of the finished UI, not a working weather widget. */
export default function MockWeatherCard() {
  return (
    <Card elevation={0} sx={{bgcolor: '#1F1976', p: 2, borderRadius: '10px'}}>
      <Stack gap={1.25}>
        <Typography
          semanticTag="p"
          visualAppearance="overline-three"
          noMargin
          style={{color: '#ACA8EA'}}
        >
          {mockUi.eyebrow}
        </Typography>
        <Card elevation={0} sx={{bgcolor: '#ffffff', borderRadius: '8px', p: '14px 16px'}}>
          <Stack direction="row" gap={2} alignItems="center">
            <span aria-hidden="true" style={{fontSize: '2rem'}}>
              ⛅
            </span>
            <div>
              <Typography
                semanticTag="p"
                visualAppearance="heading-sm"
                noMargin
                style={{color: '#1F1976', fontFamily: 'var(--font-family-heading)'}}
              >
                {mockUi.city}
              </Typography>
              <Typography
                semanticTag="p"
                visualAppearance="heading-md"
                noMargin
                style={{color: '#1a1a1a'}}
              >
                {mockUi.temperature}
              </Typography>
              <Typography
                semanticTag="p"
                visualAppearance="body-two"
                noMargin
                style={{color: '#555555'}}
              >
                {mockUi.conditions}
              </Typography>
            </div>
            <Typography
              semanticTag="p"
              visualAppearance="body-four"
              noMargin
              style={{marginLeft: 'auto', textAlign: 'right', fontStyle: 'italic', color: '#6A659E'}}
            >
              {mockUi.sideNote}
            </Typography>
          </Stack>
        </Card>
      </Stack>
    </Card>
  );
}
