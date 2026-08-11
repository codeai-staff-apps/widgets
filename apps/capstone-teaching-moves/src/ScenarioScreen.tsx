import Alert from '@code-dot-org/component-library/alert';
import DsButton from '@code-dot-org/component-library/button';
import Image from '@code-dot-org/component-library/image';
import Tags from '@code-dot-org/component-library/tags';
import Typography from '@code-dot-org/component-library/typography';
// MUI Button only for the choice list: see the comment on those buttons below.
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import {useId, useState} from 'react';

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
  const promptId = useId();

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

  // Amber for a ruled-out wrong pick, green for the found move; once solved,
  // every unchosen option dims to mark the round as over.
  const choiceSx = (choice: Choice) => ({
    justifyContent: 'flex-start',
    textAlign: 'left',
    textTransform: 'none',
    ...(solved && choice.correct
      ? {bgcolor: '#ccf1d0', borderColor: '#5cb86b', color: '#211c3d'}
      : wrongPicks.includes(choice.text)
        ? {bgcolor: '#ffe3ce', borderColor: '#e8965c', color: '#211c3d'}
        : {}),
    ...(solved && !choice.correct ? {opacity: 0.45} : {}),
  });

  return (
    <Stack gap={2}>
      <Tags tagsList={[{label: scenario.tag}]} />
      <Stack direction="row" gap={2} alignItems="center">
        <Typography semanticTag="p" visualAppearance="overline-three" noMargin>
          {labels.progress(index)}
        </Typography>
        <ProgressDots index={index} />
      </Stack>

      <Image
        className="photo"
        src={scenario.beforeImage}
        altText={scenario.beforeAlt}
        loading="eager"
      />

      <Typography semanticTag="p" visualAppearance="body-two" noMargin>
        {scenario.text}
      </Typography>

      <Typography
        semanticTag="p"
        visualAppearance="body-two"
        noMargin
        id={promptId}
        style={{fontFamily: 'var(--font-family-heading)', fontWeight: 600, color: '#211c3d'}}
      >
        {labels.prompt}
      </Typography>

      {/* Stays MUI: the design system's Button has no full-width or text-align
          API, so a block-shaped answer option would need override CSS reaching
          into the component's internals. */}
      <Stack gap={1} role="group" aria-labelledby={promptId}>
        {choices.map(choice => (
          <Button
            key={choice.text}
            fullWidth
            variant="outlined"
            // aria-disabled, not disabled: a locked choice stays readable and
            // reachable instead of dropping to MUI's low-contrast grey.
            aria-disabled={isLocked(choice)}
            // Wrong picks stay marked so the learner can see what they ruled
            // out; the feedback alert only ever shows the most recent one.
            onClick={() => !isLocked(choice) && pick(choice)}
            sx={choiceSx(choice)}
          >
            {choice.text}
          </Button>
        ))}
      </Stack>

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
          <Divider sx={{borderStyle: 'dashed', borderColor: '#E4E2F8', mt: '10px'}} />
          <Typography
            semanticTag="p"
            visualAppearance="overline-three"
            noMargin
            style={{color: '#3a9e4d', fontFamily: 'var(--font-family-heading)'}}
          >
            {labels.afterLabel}
          </Typography>
          <Alert
            type="success"
            showIcon={false}
            text={
              <>
                <strong>{scenario.quote}</strong> {scenario.explain}
              </>
            }
          />
          <Image
            className="photo"
            src={scenario.afterImage}
            altText={scenario.afterAlt}
            loading="eager"
          />
          <div>
            <DsButton text={labels.nextButtonLabel} onClick={onNext} />
          </div>
        </>
      )}
    </Stack>
  );
}
