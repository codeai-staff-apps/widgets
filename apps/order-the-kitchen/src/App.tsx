import Typography from '@code-dot-org/component-library/typography';
import Paper from '@mui/material/Paper';

import ChallengePanel from './Challenge';
import {CHALLENGES} from './data';
import './kitchen.css';

export default function App() {
  return (
    <main className="page">
      <Paper
        elevation={0}
        sx={{
          bgcolor: '#fff',
          borderRadius: '16px',
          p: {xs: 3, sm: '24px 28px'},
          mb: '28px',
          boxShadow: '0 2px 10px rgba(31,25,118,0.08)',
        }}
      >
        <Typography semanticTag="h1" visualAppearance="heading-lg" noMargin>
          Order the Kitchen
        </Typography>
        <Typography semanticTag="p" visualAppearance="body-one">
          Drag the order tickets into the sequence you think the chef will actually complete them
          in. Then run the routine and see how your prediction holds up. This pairs the same code
          from the Predict activity with a hands-on prediction you can check instantly.
        </Typography>
      </Paper>

      {CHALLENGES.map(challenge => (
        <ChallengePanel key={challenge.id} challenge={challenge} />
      ))}
    </main>
  );
}
