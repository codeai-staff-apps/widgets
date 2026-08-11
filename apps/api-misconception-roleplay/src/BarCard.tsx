import Typography from '@code-dot-org/component-library/typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type {ReactNode} from 'react';

/** A card introduced by a dark title strip, as the original's "dossier" bar did. */
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
    <Card variant="outlined" sx={{borderColor: '#E4E2F8', borderWidth: '1.5px', borderRadius: '14px'}}>
      <Box sx={{bgcolor: '#1F1976', p: '9px 16px'}}>
        <Typography
          semanticTag="p"
          visualAppearance="overline-three"
          noMargin
          style={{color: 'rgba(255, 255, 255, 0.75)'}}
        >
          {label}
        </Typography>
        <Typography semanticTag="p" visualAppearance="heading-xs" noMargin style={{color: '#ffffff'}}>
          {title}
        </Typography>
      </Box>
      <CardContent component={Stack} gap={1.5}>
        {children}
      </CardContent>
    </Card>
  );
}
