import Alert from '@code-dot-org/component-library/alert';
import Button from '@code-dot-org/component-library/button';
import RadioButton from '@code-dot-org/component-library/radioButton';
import Typography from '@code-dot-org/component-library/typography';
import Stack from '@mui/material/Stack';
import {useMemo, useState} from 'react';

import ArrayTrack from './ArrayTrack';
import {computeSteps, explainStep, generateExample, type CompareStep, type SearchExample, type StepOutcome} from './search';
import {useAnnounce} from './shared';

import './page.css';

const CHOICES: readonly StepOutcome[] = ['left', 'found', 'right'];

function choiceLabel(choice: StepOutcome): string {
  switch (choice) {
    case 'left':
      return 'Search the left half';
    case 'right':
      return 'Search the right half';
    case 'found':
      return 'Found it — target equals the midpoint';
  }
}

/**
 * The announcement read out for a given position in the trace. Sighted
 * students get the same range/mid/eliminated information from the array
 * visualization itself, so this text exists only for the screen-reader
 * live region, not as on-screen copy.
 */
function describeStep(index: number, steps: CompareStep[], target: number): string {
  if (index >= steps.length) {
    const last = steps[steps.length - 1];
    return last.outcome === 'found'
      ? `Search complete. Found ${target} at index ${last.mid}.`
      : `Search complete. ${target} is not in the list.`;
  }
  const step = steps[index];
  const count = step.high - step.low + 1;
  return `Comparison ${index + 1}. Range is index ${step.low} to ${step.high} (${count} value${count === 1 ? '' : 's'} left). Midpoint is index ${step.mid}, value ${step.midValue}.`;
}

interface Answer {
  choice: StepOutcome;
  correct: boolean;
}

export default function App() {
  const announce = useAnnounce();
  const [example, setExample] = useState<SearchExample>(() => generateExample());
  const [stepIndex, setStepIndex] = useState(0);
  const [revealed, setRevealed] = useState<Record<number, Answer>>({});
  // The radio selection for the *current* step, not yet checked. Kept apart
  // from `revealed` so picking an option only previews it — it takes an
  // explicit "Check answer" to grade it.
  const [pendingChoice, setPendingChoice] = useState<StepOutcome | null>(null);

  const steps = useMemo(() => computeSteps(example.values, example.target), [example]);
  const isSummary = stepIndex >= steps.length;
  const currentStep = isSummary ? undefined : steps[stepIndex];
  const lastStep = steps[steps.length - 1];
  const answer = revealed[stepIndex];
  // Stale once the student picks a different option after checking — the
  // feedback below re-hides itself until they check the new pick.
  const answerMatchesPending = answer !== undefined && answer.choice === pendingChoice;

  const goTo = (
    index: number,
    newSteps: CompareStep[],
    target: number,
    nextRevealed: Record<number, Answer>,
  ) => {
    setStepIndex(index);
    setPendingChoice(nextRevealed[index]?.choice ?? null);
    announce(describeStep(index, newSteps, target));
  };

  const onReset = () => {
    setRevealed({});
    goTo(0, steps, example.target, {});
  };

  const onNewExample = () => {
    const next = generateExample();
    const nextSteps = computeSteps(next.values, next.target);
    setExample(next);
    setRevealed({});
    setStepIndex(0);
    setPendingChoice(null);
    announce(`New example. ${describeStep(0, nextSteps, next.target)}`);
  };

  const onSelectChoice = (choice: StepOutcome) => setPendingChoice(choice);

  const onCheckAnswer = () => {
    if (!currentStep || pendingChoice === null) {
      return;
    }
    const correct = pendingChoice === currentStep.outcome;
    setRevealed(previous => ({...previous, [stepIndex]: {choice: pendingChoice, correct}}));
    announce(`${correct ? 'Correct.' : 'Not quite.'} ${explainStep(currentStep, example.target)}`);
  };

  const onStepForward = () => goTo(Math.min(stepIndex + 1, steps.length), steps, example.target, revealed);
  const onStepBackward = () => goTo(Math.max(stepIndex - 1, 0), steps, example.target, revealed);

  const foundIndex = isSummary
    ? lastStep.outcome === 'found'
      ? lastStep.mid
      : undefined
    : answer && currentStep?.outcome === 'found'
      ? currentStep.mid
      : undefined;
  // An empty range once the search is over and the target wasn't found:
  // `low > high` makes every cell read as eliminated.
  const trackRange = isSummary ? {low: 1, high: 0} : {low: currentStep!.low, high: currentStep!.high};

  // A highlight of the student's current prediction — which cells it would
  // keep. It stays up through "Check answer" (checking only adds the Alert
  // below; it doesn't touch this), and only moves or clears when the
  // prediction itself changes, on Reset, or on Step forward/backward.
  let previewRange: {low: number; high: number} | undefined;
  if (currentStep && pendingChoice !== null) {
    if (pendingChoice === 'left') {
      previewRange = {low: currentStep.low, high: currentStep.mid - 1};
    } else if (pendingChoice === 'right') {
      previewRange = {low: currentStep.mid + 1, high: currentStep.high};
    } else {
      previewRange = {low: currentStep.mid, high: currentStep.mid};
    }
  }

  return (
    <Stack component="main" className="page" gap={3} sx={{maxWidth: 760, mx: 'auto', px: 2, pt: 2, pb: 6}}>
      <div>
        <Typography semanticTag="h1" visualAppearance="heading-lg">
          Binary Search Visualizer
        </Typography>
        <Alert
          type="info"
          role="note"
          text="Binary search finds a value in a sorted list by checking the middle item, then throwing out the half that can't contain the target. At each step, predict what happens next, then check your answer."
        />
      </div>

      <Stack direction="row" gap={1} flexWrap="wrap">
        <Button type="tertiary" color="black" text="Reset" onClick={onReset} />
        <Button type="tertiary" color="black" text="New example" onClick={onNewExample} />
      </Stack>

      <Typography semanticTag="p" visualAppearance="body-one" noMargin>
        Target: <span className="targetValue">{example.target}</span>
      </Typography>

      <ArrayTrack
        values={example.values}
        low={trackRange.low}
        high={trackRange.high}
        mid={currentStep?.mid}
        foundIndex={foundIndex}
        previewLow={previewRange?.low}
        previewHigh={previewRange?.high}
      />

      {currentStep && (
        <fieldset className="predictFieldset">
          <legend>What should binary search do next?</legend>
          <Stack gap={1}>
            {CHOICES.map(choice => (
              <RadioButton
                key={choice}
                name={`step-${stepIndex}`}
                value={choice}
                label={choiceLabel(choice)}
                checked={pendingChoice === choice}
                onChange={() => onSelectChoice(choice)}
              />
            ))}
          </Stack>
          <div className="checkAnswerRow">
            <Button text="Check answer" onClick={onCheckAnswer} disabled={pendingChoice === null} />
          </div>
        </fieldset>
      )}

      {currentStep && answer && answerMatchesPending && (
        <Alert
          type={answer.correct ? 'success' : 'warning'}
          role={undefined}
          text={`${answer.correct ? 'Correct! ' : 'Not quite. '}${explainStep(currentStep, example.target)}`}
        />
      )}

      {isSummary && (
        <Alert
          type={lastStep.outcome === 'found' ? 'success' : 'info'}
          role={undefined}
          text={
            lastStep.outcome === 'found'
              ? `Found ${example.target} at index ${lastStep.mid} after ${steps.length} comparison${steps.length === 1 ? '' : 's'}.`
              : `${example.target} is not in the list — the search range became empty after ${steps.length} comparison${steps.length === 1 ? '' : 's'}.`
          }
        />
      )}

      <Stack direction="row" gap={1}>
        <Button
          type="secondary"
          color="black"
          text="Step backward"
          onClick={onStepBackward}
          disabled={stepIndex === 0}
        />
        {currentStep && (
          <Button text="Step forward" onClick={onStepForward} disabled={!answer} />
        )}
      </Stack>
    </Stack>
  );
}
