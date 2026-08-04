import Accordion from '@code-dot-org/component-library/accordion';
import Alert from '@code-dot-org/component-library/alert';
import Button from '@code-dot-org/component-library/button';
import Tags from '@code-dot-org/component-library/tags';
import Typography from '@code-dot-org/component-library/typography';
import LinearProgress from '@mui/material/LinearProgress';
import {useEffect, useRef, useState, type KeyboardEvent} from 'react';

import {runSchedule, timerLabel, timerRows, type Challenge} from './data';
import {useAnnounce, useSelectAndPlace} from './shared';

interface ChallengeProps {
  challenge: Challenge;
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function ChallengePanel({challenge}: ChallengeProps) {
  const announce = useAnnounce();
  const cardById = Object.fromEntries(challenge.cards.map(card => [card.id, card]));
  const board = useSelectAndPlace({
    items: challenge.scrambledOrder.map(id => ({id, label: cardById[id].text})),
    containers: [{id: challenge.id, label: 'your predicted order'}],
    bankId: challenge.id,
  });

  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [animated, setAnimated] = useState(true);
  const [running, setRunning] = useState(false);
  const [marks, setMarks] = useState<Record<string, boolean> | null>(null);

  const timers = useRef<number[]>([]);
  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const order = board.itemsIn(challenge.id);
  const locked = running || marks !== null;

  const move = (cardId: string, delta: number) => {
    if (locked) {
      return;
    }
    board.move(cardId, delta);
  };

  const onCardKeyDown = (event: KeyboardEvent<HTMLLIElement>, cardId: string) => {
    if (!event.altKey || (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')) {
      return;
    }
    event.preventDefault();
    move(cardId, event.key === 'ArrowUp' ? -1 : 1);
  };

  const run = () => {
    clearTimers();
    setLogs([]);
    setMarks(null);
    setRunning(true);
    board.select(null);

    const animate = !reducedMotion();
    setAnimated(animate);
    setProgress({});
    if (animate) {
      timers.current.push(
        window.setTimeout(
          () =>
            setProgress(Object.fromEntries(timerRows(challenge).map(card => [card.id, 100]))),
          0,
        ),
      );
    }

    const schedule = runSchedule(challenge);
    schedule.forEach(({id, at}) => {
      timers.current.push(
        window.setTimeout(() => {
          setLogs(previous => [...previous, cardById[id].text]);
          announce(cardById[id].text);
          if (!animate && cardById[id].delay > 0) {
            setProgress(previous => ({...previous, [id]: 100}));
          }
        }, at),
      );
    });

    const lastAt = Math.max(...schedule.map(event => event.at));
    timers.current.push(
      window.setTimeout(() => {
        const graded = Object.fromEntries(
          order.map((id, index) => [id, id === challenge.correctOrder[index]]),
        );
        const score = Object.values(graded).filter(Boolean).length;
        setMarks(graded);
        setRunning(false);
        announce(`${score} of ${challenge.cards.length} correct.`);
      }, lastAt + challenge.gradeMs),
    );
  };

  const reset = () => {
    clearTimers();
    board.reset();
    setLogs([]);
    setProgress({});
    setMarks(null);
    setRunning(false);
    announce(`${challenge.heading} reset.`);
  };

  const score = marks ? Object.values(marks).filter(Boolean).length : 0;

  return (
    <section className="challenge" aria-labelledby={`${challenge.id}Heading`}>
      <Tags tagsList={[{label: challenge.eyebrow}]} />
      <Typography
        semanticTag="h2"
        visualAppearance="heading-md"
        id={`${challenge.id}Heading`}
        noMargin
      >
        {challenge.heading}
      </Typography>
      <Typography semanticTag="p" visualAppearance="body-two">
        {challenge.desc}
      </Typography>

      <Accordion
        items={[
          {
            id: `${challenge.id}Code`,
            label: 'Show the code',
            content: (
              <pre className="code">
                <code>{challenge.codeSnippet}</code>
              </pre>
            ),
          },
        ]}
      />

      <div className="columns">
        <div>
          <Typography semanticTag="p" visualAppearance="overline-three" noMargin>
            Your predicted order
          </Typography>
          <Typography semanticTag="p" visualAppearance="body-three">
            Use each ticket's up and down buttons, or focus a ticket and press Alt+↑ / Alt+↓.
          </Typography>
          <ol className="deck">
            {order.map((id, index) => (
              <li
                key={id}
                className={[
                  'card',
                  marks && (marks[id] ? 'card--right' : 'card--wrong'),
                ]
                  .filter(Boolean)
                  .join(' ')}
                tabIndex={0}
                aria-label={`Position ${index + 1} of ${order.length}: ${cardById[id].text}`}
                aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown"
                onKeyDown={event => onCardKeyDown(event, id)}
              >
                <span className="cardText">{cardById[id].text}</span>
                {marks && (
                  <span className="mark">
                    <span aria-hidden="true">{marks[id] ? '✓' : '✗'} </span>
                    {marks[id] ? 'Correct' : 'Not quite'}
                  </span>
                )}
                <button
                  type="button"
                  className="moveButton"
                  disabled={locked}
                  aria-label={`Move ${cardById[id].text} up`}
                  onClick={() => move(id, -1)}
                >
                  <span aria-hidden="true">↑</span>
                </button>
                <button
                  type="button"
                  className="moveButton"
                  disabled={locked}
                  aria-label={`Move ${cardById[id].text} down`}
                  onClick={() => move(id, 1)}
                >
                  <span aria-hidden="true">↓</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <Typography semanticTag="p" visualAppearance="overline-three" noMargin>
            Actual run
          </Typography>
          <div className="terminal">
            {logs.map((line, index) => (
              <div className="line" key={index}>
                <span className="prompt" aria-hidden="true">
                  &gt;{' '}
                </span>
                {line}
              </div>
            ))}
          </div>
          {timerRows(challenge).map(card => (
            <div className="timerRow" key={card.id}>
              <Typography semanticTag="p" visualAppearance="body-three" noMargin>
                {timerLabel(card)}
              </Typography>
              <LinearProgress
                aria-hidden="true" // the terminal line below is the real signal
                variant="determinate"
                value={progress[card.id] ?? 0}
                sx={{
                  '& .MuiLinearProgress-bar': {
                    transition: animated
                      ? `transform ${card.delay * challenge.timeScale}ms linear`
                      : 'none',
                  },
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="actions">
        <Button text="Run routine" color="purple" disabled={locked} onClick={run} />
        <Button text="Reset" type="secondary" color="black" onClick={reset} />
      </div>

      {marks && (
        // Advisory only. The shared announcer is this app's one live region.
        <Alert
          isImmediateImportance={false}
          aria-live="off"
          showIcon={false} // the design system's icons need FontAwesome, which the CSP blocks
          type={score === challenge.cards.length ? 'success' : 'warning'}
          text={`${score} of ${challenge.cards.length} in the right spot. ${challenge.resultExplanation}`}
        />
      )}
    </section>
  );
}
