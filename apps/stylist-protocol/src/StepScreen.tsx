import Alert from '@code-dot-org/component-library/alert';
import Button from '@code-dot-org/component-library/button';
import Typography from '@code-dot-org/component-library/typography';
import {useEffect, useId, useRef} from 'react';

import {CHROME} from './content/content';
import type {Step} from './content/types';
import Dialogue from './Dialogue';
import {Concept, PromptChoice, Sequence, TestConfirm} from './Interactions';
import PhoneFeed from './PhoneFeed';
import {Screen, type ScreenMachine} from './shared';

/** One protocol step: the dialogue, the interaction, the grade, and Next. */
export default function StepScreen({
  machine,
  id,
  step,
  result,
  onAnswer,
  onNext,
  isLast,
  phoneHasNewPost,
}: {
  machine: ScreenMachine;
  id: string;
  step: Step;
  /** Null until the learner answers. */
  result: boolean | null;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
  isLast: boolean;
  phoneHasNewPost: boolean;
}) {
  const instructionId = useId();
  const nextRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const answered = result !== null;

  useEffect(() => {
    if (answered && machine.is(id)) {
      nextRef.current?.focus();
    }
  }, [answered, id, machine]);

  const {interaction} = step;

  return (
    <Screen
      machine={machine}
      id={id}
      heading={`${step.icon} ${step.title}`}
      headingTag="h1"
      headingAppearance="heading-md"
    >
      <Typography semanticTag="p" visualAppearance="body-two" id={instructionId}>
        {step.instruction}
      </Typography>

      <Dialogue speaker={CHROME.teacherName}>{step.teacherLine}</Dialogue>
      <Dialogue speaker={CHROME.studentName}>{step.studentLine}</Dialogue>

      {interaction.type === 'concept' && (
        <Concept interaction={interaction} answered={answered} onAnswer={onAnswer} />
      )}
      {interaction.type === 'clickline' && (
        <Typography semanticTag="p" visualAppearance="body-two">
          {interaction.hint}
        </Typography>
      )}
      {interaction.type === 'sequence' && (
        <Sequence interaction={interaction} answered={answered} onAnswer={onAnswer} />
      )}
      {interaction.type === 'promptchoice' && (
        <PromptChoice
          interaction={interaction}
          answered={answered}
          onAnswer={onAnswer}
          instructionId={instructionId}
        />
      )}
      {interaction.type === 'testconfirm' && (
        <>
          <PhoneFeed withNewPost={phoneHasNewPost} />
          <TestConfirm interaction={interaction} answered={answered} onAnswer={onAnswer} />
        </>
      )}

      {answered && (
        <>
          <Alert
            type={result ? 'success' : 'danger'}
            size="s"
            text={result ? step.passResult : step.failResult}
          />
          <Dialogue speaker={CHROME.studentName}>{step.studentReaction}</Dialogue>
          <div>
            <Button
              ref={nextRef}
              type="primary"
              color="purple"
              text={isLast ? CHROME.btnFinish : CHROME.btnNext}
              onClick={onNext}
            />
          </div>
        </>
      )}
    </Screen>
  );
}
