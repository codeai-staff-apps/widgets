import Button from '@code-dot-org/component-library/button';
import Checkbox from '@code-dot-org/component-library/checkbox';
import RadioButton from '@code-dot-org/component-library/radioButton';
import Typography from '@code-dot-org/component-library/typography';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import classNames from 'classnames';
import {useEffect, useRef, useState} from 'react';

import {CHECKLIST, HABITATS, nextLaunchDate, remainingUntil} from './mission';
import type {Remaining} from './mission';
import {visuallyHidden} from './shared';
import './dashboard.css';

const PLACEHOLDER = '--';

const pad = (n: number) => String(n).padStart(2, '0');

export default function App() {
  const launchDate = useRef(nextLaunchDate()).current;
  const [remaining, setRemaining] = useState<Remaining | null>(null);
  const [ticking, setTicking] = useState(true);
  const [done, setDone] = useState<boolean[]>(() => CHECKLIST.map(() => false));
  const [habitatId, setHabitatId] = useState<string | null>(null);

  useEffect(() => {
    if (!ticking) {
      return;
    }
    const tick = () => setRemaining(remainingUntil(launchDate));
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [launchDate, ticking]);

  const completed = done.filter(Boolean).length;
  const ready = completed === CHECKLIST.length;
  const habitat = HABITATS.find(h => h.id === habitatId);

  const fields: [string, string][] = [
    ['Days', remaining ? String(remaining.days) : PLACEHOLDER],
    ['Hours', remaining ? pad(remaining.hours) : PLACEHOLDER],
    ['Mins', remaining ? pad(remaining.mins) : PLACEHOLDER],
    ['Secs', remaining ? pad(remaining.secs) : PLACEHOLDER],
  ];

  return (
    <div className="page">
      <header>
        <Typography semanticTag="p" visualAppearance="overline-two" className="tag">
          Ares Base · Crew Dashboard
        </Typography>
        <Typography semanticTag="h1" visualAppearance="heading-lg" className="title">
          Mission to Mars
        </Typography>
        <Typography semanticTag="p" visualAppearance="body-two">
          Everything your crew needs before launch, in one place.
        </Typography>
        <div className={classNames('status', {ready})} role="status" aria-live="polite">
          <span className="dot" aria-hidden="true" />
          <Typography semanticTag="p" visualAppearance="body-two">
            {ready ? 'Ready for launch' : 'Preparing for launch'}
          </Typography>
        </div>
      </header>

      <main>
        <section aria-labelledby="countdown-heading">
          {/* The original has no visible heading here — the tiles speak for
              themselves — but the section still needs an accessible name. */}
          <h2 id="countdown-heading" style={visuallyHidden}>
            Launch countdown
          </h2>
          {/*
            The seconds-by-seconds value is hidden from assistive tech — read
            aloud every tick it would be unusable. The coarse equivalent below
            carries the same information, and the toggle satisfies the
            pause-or-stop requirement for auto-updating content.
          */}
          <ul className="countdown" aria-hidden="true">
            {fields.map(([label, value]) => (
              <li key={label}>
                <Typography semanticTag="span" visualAppearance="heading-md">
                  {value}
                </Typography>
                <Typography semanticTag="span" visualAppearance="body-three">
                  {label}
                </Typography>
              </li>
            ))}
          </ul>
          <p style={visuallyHidden}>
            {remaining
              ? `Launch in ${remaining.days} days, ${remaining.hours} hours.`
              : 'Launch time not yet calculated.'}
          </p>
          <Button
            type="tertiary"
            color="black"
            text={ticking ? 'Pause countdown' : 'Resume countdown'}
            aria-pressed={!ticking}
            onClick={() => setTicking(t => !t)}
          />
        </section>

        <section aria-labelledby="crew-heading">
          <Paper variant="outlined" sx={{p: '20px 22px', borderRadius: '16px'}}>
            <Typography
              semanticTag="h2"
              visualAppearance="heading-sm"
              id="crew-heading"
            >
              <span aria-hidden="true">🚀 </span>Crew Readiness
            </Typography>
            <Typography semanticTag="p" visualAppearance="body-two">
              Tap each item as your crew completes it.
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(completed / CHECKLIST.length) * 100}
              aria-label={`Crew readiness: ${completed} of ${CHECKLIST.length} complete`}
              sx={{mb: 2}}
            />
            <ul className="checklist">
              {CHECKLIST.map((item, i) => (
                <li key={item} className={classNames({done: done[i]})}>
                  <Checkbox
                    name={`crew-${i}`}
                    label={item}
                    checked={done[i]}
                    onChange={() =>
                      setDone(prev => prev.map((v, j) => (j === i ? !v : v)))
                    }
                  />
                </li>
              ))}
            </ul>
          </Paper>
        </section>

        <section aria-labelledby="habitat-heading">
          <Paper variant="outlined" sx={{p: '20px 22px', borderRadius: '16px'}}>
            <Typography
              semanticTag="h2"
              visualAppearance="heading-sm"
              id="habitat-heading"
            >
              <span aria-hidden="true">🏠 </span>Habitat Selection
            </Typography>
            <fieldset className="habitats">
              <legend>Choose where your crew will live on the surface.</legend>
              {HABITATS.map(option => (
                <RadioButton
                  key={option.id}
                  name="habitat"
                  value={option.id}
                  label={option.name}
                  checked={habitatId === option.id}
                  onChange={() => setHabitatId(option.id)}
                  className="habitatCard"
                >
                  <span className="habitatIcon" aria-hidden="true">
                    {option.icon}
                  </span>
                </RadioButton>
              ))}
            </fieldset>
            <Paper
              variant="outlined"
              sx={{p: '14px 16px', borderRadius: '10px', mt: 2}}
              role="status"
              aria-live="polite"
            >
              <Typography semanticTag="p" visualAppearance="body-two">
                {habitat ? habitat.detail : 'Select a habitat to see details.'}
              </Typography>
            </Paper>
          </Paper>
        </section>
      </main>

      <footer>
        <Typography semanticTag="p" visualAppearance="body-three">
          Ares Base Dashboard — Crew Simulation
        </Typography>
      </footer>
    </div>
  );
}
