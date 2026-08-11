import Button from '@code-dot-org/component-library/button';
import Typography from '@code-dot-org/component-library/typography';
import {useId, useState} from 'react';

import {CHROME} from './content/content';
import type {
  ConceptInteraction,
  PromptInteraction,
  SequenceInteraction,
  TestInteraction,
} from './content/types';
import Dialogue from './Dialogue';

/**
 * The four interactions that live in the step card. Step 2's control is the
 * code panel itself, so it has no component here — only the hint line the
 * step card prints.
 *
 * Each one reports a single boolean to the step card, which owns the graded
 * feedback, the console, and the Next button.
 */

/** Fisher-Yates, unlike the source's biased `sort(() => Math.random() - 0.5)`. */
function shuffle<T>(input: readonly T[]): T[] {
  const out = [...input];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

interface Answerable {
  answered: boolean;
  onAnswer: (correct: boolean) => void;
}

export function Concept({
  interaction,
  answered,
  onAnswer,
}: Answerable & {interaction: ConceptInteraction}) {
  const [chosen, setChosen] = useState<number | null>(null);
  const questionId = useId();

  return (
    <>
      <Typography semanticTag="p" visualAppearance="body-one" id={questionId}>
        {interaction.question}
      </Typography>
      <div className="optionList" role="group" aria-labelledby={questionId}>
        {interaction.options.map((option, i) => (
          <Button
            key={option.text}
            type="secondary"
            color="black"
            className={chosen === i ? 'optionChosen' : undefined}
            text={option.text}
            ariaLabel={chosen === i ? `${option.text} — your answer` : undefined}
            disabled={answered}
            onClick={() => {
              setChosen(i);
              onAnswer(option.correct);
            }}
          />
        ))}
      </div>
    </>
  );
}

export function Sequence({
  interaction,
  answered,
  onAnswer,
}: Answerable & {interaction: SequenceInteraction}) {
  const [order, setOrder] = useState<string[]>([]);
  // Shuffled once per mount, as in the original, so the authored array order
  // is never the answer.
  const [items] = useState(() => shuffle(interaction.items));

  const place = (id: string) => {
    const next = [...order, id];
    setOrder(next);
    if (next.length === interaction.items.length) {
      onAnswer(
        next.every((placedId, i) => {
          const item = interaction.items.find(candidate => candidate.id === placedId)!;
          return item.correct === i + 1;
        }),
      );
    }
  };

  return (
    <ul className="sequenceList" aria-label="Plan steps — click each one to place it in order">
      {items.map(item => {
        const position = order.indexOf(item.id) + 1;
        return (
          <li key={item.id}>
            <button
              type="button"
              className={position ? 'sequenceItem isPlaced' : 'sequenceItem'}
              disabled={answered || position > 0}
              aria-label={position ? `Position ${position}: ${item.text}` : item.text}
              onClick={() => place(item.id)}
            >
              <span className="sequenceBadge" aria-hidden="true">
                {position || '?'}
              </span>
              {item.text}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function PromptChoice({
  interaction,
  answered,
  onAnswer,
  instructionId,
}: Answerable & {interaction: PromptInteraction; instructionId: string}) {
  const [chosen, setChosen] = useState<number | null>(null);
  const option = chosen === null ? null : interaction.options[chosen];

  return (
    <>
      <div className="promptChoices" role="group" aria-labelledby={instructionId}>
        {interaction.options.map((prompt, i) => (
          <button
            key={prompt.label}
            type="button"
            className={chosen === i ? 'promptCard isChosen' : 'promptCard'}
            disabled={answered}
            aria-label={
              chosen === i ? `${prompt.label}: ${prompt.text} — your answer` : undefined
            }
            onClick={() => {
              setChosen(i);
              onAnswer(prompt.isGood);
            }}
          >
            <span className="promptLabel">{prompt.label}</span>
            <span>“{prompt.text}”</span>
          </button>
        ))}
      </div>
      {option && (
        <>
          <Dialogue speaker={CHROME.teacherName} variant="teacher">
            {option.teacherBranch}
          </Dialogue>
          <Dialogue speaker={CHROME.studentName} variant="student">
            {option.studentBranch}
          </Dialogue>
        </>
      )}
    </>
  );
}

export function TestConfirm({
  interaction,
  answered,
  onAnswer,
}: Answerable & {interaction: TestInteraction}) {
  const questionId = useId();

  return (
    <>
      <Typography semanticTag="p" visualAppearance="body-one" id={questionId}>
        {interaction.question}
      </Typography>
      <div className="answerButtons" role="group" aria-labelledby={questionId}>
        <Button
          type="secondary"
          color="black"
          text={interaction.yesLabel}
          disabled={answered}
          onClick={() => onAnswer(true)}
        />
        <Button
          type="secondary"
          color="black"
          text={interaction.noLabel}
          disabled={answered}
          onClick={() => onAnswer(false)}
        />
      </div>
    </>
  );
}
