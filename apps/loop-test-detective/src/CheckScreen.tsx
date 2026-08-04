import Alert from '@code-dot-org/component-library/alert';
import Button from '@code-dot-org/component-library/button';
import Typography from '@code-dot-org/component-library/typography';
import {useEffect, useId, useRef} from 'react';

import type {Check, Chrome} from './content/types';
import Dialogue from './Dialogue';
import {Screen, type ScreenMachine} from './shared';

/**
 * One check of the verification routine. Answering is one-shot, as in the
 * original: the buttons are replaced by the graded feedback, which is what
 * makes the summary's score honest.
 */
export default function CheckScreen({
  machine,
  id,
  check,
  chrome,
  answer,
  onAnswer,
  onNext,
  isLast,
}: {
  machine: ScreenMachine;
  id: string;
  check: Check;
  chrome: Chrome;
  /** What the learner said: true for "has an issue", null until answered. */
  answer: boolean | null;
  onAnswer: (saidIssue: boolean) => void;
  onNext: () => void;
  isLast: boolean;
}) {
  const questionId = useId();
  const nextRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  // The original moved focus to Next as soon as an answer was graded; keep
  // that, so the keyboard path never has to hunt for the new control.
  useEffect(() => {
    if (answer !== null && machine.is(id)) {
      nextRef.current?.focus();
    }
  }, [answer, id, machine]);

  const correct = answer === check.correctIsIssue;
  const reaction = correct ? check.reactionCorrect : check.reactionIncorrect;

  return (
    <Screen
      machine={machine}
      id={id}
      heading={check.title}
      headingTag="h1"
      headingAppearance="heading-md"
    >
      <Dialogue speaker={chrome.teacherName}>{check.teacherLine}</Dialogue>
      {check.studentLine && (
        <Dialogue speaker={chrome.studentName}>{check.studentLine}</Dialogue>
      )}

      <Typography semanticTag="p" visualAppearance="body-one" id={questionId}>
        {check.question}
      </Typography>

      {answer === null ? (
        <div className="answerButtons" role="group" aria-labelledby={questionId}>
          <Button
            type="secondary"
            color="black"
            text={chrome.btnPasses}
            onClick={() => onAnswer(false)}
          />
          <Button
            type="secondary"
            color="black"
            text={chrome.btnIssue}
            onClick={() => onAnswer(true)}
          />
        </div>
      ) : (
        <>
          <Alert
            type={correct ? 'success' : 'danger'}
            size="s"
            text={
              <span>
                <strong>{correct ? check.correctLabel : check.wrongLabel}</strong>{' '}
                {correct ? check.correctBody : check.wrongBody}
              </span>
            }
          />
          {reaction && <Dialogue speaker={chrome.studentName}>{reaction}</Dialogue>}
          {check.hint && (
            <Typography semanticTag="p" visualAppearance="body-two">
              {check.hint}
            </Typography>
          )}
          <div>
            <Button
              ref={nextRef}
              type="primary"
              color="purple"
              text={isLast ? chrome.btnResults : chrome.btnNext}
              onClick={onNext}
            />
          </div>
        </>
      )}
    </Screen>
  );
}
