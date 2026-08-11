import Alert from '@code-dot-org/component-library/alert';
import Button from '@code-dot-org/component-library/button';
import Typography from '@code-dot-org/component-library/typography';
import {useEffect, useId, useRef, useState} from 'react';

import studentImg from './assets/student_veo.png';
import teacherImg from './assets/teacher_veo.png';
import CharacterBubble from './CharacterBubble';
import type {Check, Chrome} from './content/types';
import Dialogue from './Dialogue';
import {Screen, type ScreenMachine} from './shared';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  const [showReaction, setShowReaction] = useState(false);

  // The original moved focus to Next as soon as an answer was graded; keep
  // that, so the keyboard path never has to hunt for the new control.
  useEffect(() => {
    if (answer !== null && machine.is(id)) {
      nextRef.current?.focus();
    }
  }, [answer, id, machine]);

  // The original's "1200 ms dialogue beat": the teacher's line stays put
  // while the feedback banner appears, then the character area swaps to the
  // student's reaction. Reduced motion skips the wait rather than the swap,
  // so the reaction is never unreachable.
  useEffect(() => {
    if (answer === null) {
      setShowReaction(false);
      return;
    }
    if (reducedMotion()) {
      setShowReaction(true);
      return;
    }
    const timer = window.setTimeout(() => setShowReaction(true), 1200);
    return () => window.clearTimeout(timer);
  }, [answer]);

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
      <div role="region" aria-live="polite" aria-label="Character dialogue">
        {showReaction && reaction ? (
          <CharacterBubble
            variant="student"
            name={chrome.studentName}
            avatarSrc={studentImg}
            avatarAlt={chrome.studentImgAlt}
          >
            {reaction}
          </CharacterBubble>
        ) : (
          <CharacterBubble
            variant="teacher"
            name={chrome.teacherName}
            avatarSrc={teacherImg}
            avatarAlt={chrome.teacherImgAlt}
          >
            {check.teacherLine}
          </CharacterBubble>
        )}
      </div>

      {/* Dead content in the original — every check authored a studentLine,
          but it was never shown, since the character area always rendered
          the teacher. Restored here as the student's opening thought,
          visually distinct from the char area above, and only before
          answering so it never competes with the post-answer reaction. */}
      {answer === null && check.studentLine && (
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
          {/* The original renders both a right and a wrong answer in the
              same indigo: this is a teacher-training simulation, not a quiz,
              and colouring a wrong answer red would reframe it as grading.
              Only the emoji and the wording distinguish the two outcomes. */}
          <Alert
            type="info"
            size="s"
            text={
              <span>
                <span aria-hidden="true">{correct ? '💡 ' : '🔍 '}</span>
                <strong>{correct ? check.correctLabel : check.wrongLabel}</strong>{' '}
                {correct ? check.correctBody : check.wrongBody}
              </span>
            }
          />
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
