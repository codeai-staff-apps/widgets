import Typography from '@code-dot-org/component-library/typography';

import ChallengePanel from './Challenge';
import {CHALLENGES} from './data';
import './kitchen.css';

export default function App() {
  return (
    <main className="page">
      <Typography semanticTag="h1" visualAppearance="heading-lg" noMargin>
        Order the Kitchen
      </Typography>
      <Typography semanticTag="p" visualAppearance="body-one">
        Put the order tickets into the sequence you think the chef will actually complete them in.
        Then run the routine and see how your prediction holds up. This pairs the same code from the
        Predict activity with a hands-on prediction you can check instantly.
      </Typography>

      {CHALLENGES.map(challenge => (
        <ChallengePanel key={challenge.id} challenge={challenge} />
      ))}
    </main>
  );
}
