import Alert from '@code-dot-org/component-library/alert';
import Image from '@code-dot-org/component-library/image';
import Tags from '@code-dot-org/component-library/tags';
import Typography from '@code-dot-org/component-library/typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {useState} from 'react';

import {labels, scenarios, type Choice, type Scenario} from './scenarios';

import './walkthrough.css';

/** Fisher–Yates. Deliberately unseeded: re-runs must not reward memorising positions. */
function shuffle<T>(list: readonly T[]): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function ProgressDots({index}: {index: number}) {
  return (
    <div className="progressDots" aria-hidden="true">
      {scenarios.map((scenario, i) => (
        <span
          key={scenario.id}
          className={`dot ${i < index ? 'done' : ''} ${i === index ? 'active' : ''}`}
        />
      ))}
    </div>
  );
}

export default function ScenarioScreen({
  scenario,
  index,
  onNext,
}: {
  scenario: Scenario;
  index: number;
  onNext: () => void;
}) {
  const [choices] = useState(() => shuffle(scenario.choices));
  const [wrongPicks, setWrongPicks] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);

  const lastWrong = wrongPicks[wrongPicks.length - 1];
  const feedback = choices.find(choice => choice.text === lastWrong)?.feedback;

  // A wrong pick locks only itself: the learner keeps trying until they find
  // the move that works. That retry loop is the exercise.
  const pick = (choice: Choice) => {
    if (choice.correct) {
      setSolved(true);
    } else if (!wrongPicks.includes(choice.text)) {
      setWrongPicks(previous => [...previous, choice.text]);
    }
  };

  const isLocked = (choice: Choice) => solved || wrongPicks.includes(choice.text);

  return (
    <Stack gap={2}>
      <Tags tagsList={[{label: scenario.tag}]} />
      <Stack direction="row" gap={2} alignItems="center">
        <Typography semanticTag="p" visualAppearance="overline-three" noMargin>
          {labels.progress(index)}
        </Typography>
        <ProgressDots index={index} />
      </Stack>

      <Image className="photo" src={scenario.beforeImage} altText="" loading="eager" />

      <Typography semanticTag="p" visualAppearance="body-two" noMargin>
        {scenario.text}
      </Typography>

      {choices.map(choice => (
        <Button
          key={choice.text}
          fullWidth
          // aria-disabled, not disabled: a locked choice stays readable and
          // reachable instead of dropping to MUI's low-contrast grey.
          aria-disabled={isLocked(choice)}
          // Wrong picks stay marked so the learner can see what they ruled
          // out; the feedback alert only ever shows the most recent one.
          variant={solved && choice.correct ? 'contained' : 'outlined'}
          color={wrongPicks.includes(choice.text) ? 'error' : 'primary'}
          onClick={() => !isLocked(choice) && pick(choice)}
          sx={{justifyContent: 'flex-start', textAlign: 'left', textTransform: 'none'}}
        >
          {choice.text}
        </Button>
      ))}

      {!solved && feedback && (
        <Alert
          key={lastWrong}
          type="warning"
          showIcon={false}
          text={
            <>
              <strong>{labels.wrongPrefix}</strong>
              {feedback}
            </>
          }
        />
      )}

      {solved && (
        <>
          <Alert
            type="success"
            showIcon={false}
            text={
              <>
                <strong>{scenario.quote}</strong> {scenario.explain}
              </>
            }
          />
          <Image className="photo" src={scenario.afterImage} altText="" loading="eager" />
          <div>
            <Button variant="contained" onClick={onNext}>
              {labels.nextButtonLabel}
            </Button>
          </div>
        </>
      )}
    </Stack>
  );
}
