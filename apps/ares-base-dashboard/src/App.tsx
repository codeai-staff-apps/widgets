import Button from '@code-dot-org/component-library/button';
import Checkbox from '@code-dot-org/component-library/checkbox';
import RadioButton from '@code-dot-org/component-library/radioButton';
import Typography from '@code-dot-org/component-library/typography';
import LinearProgress from '@mui/material/LinearProgress';
import {useEffect, useRef, useState} from 'react';

import {CHECKLIST, HABITATS, nextLaunchDate, remainingUntil} from './mission';
import type {Remaining} from './mission';
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
        <Typography semanticTag="p" visualAppearance="overline-two">
          Ares Base · Crew Dashboard
        </Typography>
        <Typography semanticTag="h1" visualAppearance="heading-lg">
          Mission to Mars
        </Typography>
        <Typography semanticTag="p" visualAppearance="body-two">
          Everything your crew needs before launch, in one place.
        </Typography>
        <div role="status" aria-live="polite">
          <Typography semanticTag="p" visualAppearance="body-two">
            {ready ? 'Ready for launch' : 'Preparing for launch'}
          </Typography>
        </div>
      </header>

      <main>
        <section aria-labelledby="countdown-heading">
          <Typography
            semanticTag="h2"
            visualAppearance="heading-sm"
            id="countdown-heading"
          >
            Launch countdown
          </Typography>
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
          <p className="srOnly">
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
          <ul className="checklist">
            {CHECKLIST.map((item, i) => (
              <li key={item}>
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
          <LinearProgress
            variant="determinate"
            value={(completed / CHECKLIST.length) * 100}
            aria-label={`Crew readiness: ${completed} of ${CHECKLIST.length} complete`}
          />
        </section>

        <section aria-labelledby="habitat-heading">
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
              />
            ))}
          </fieldset>
          <div role="status" aria-live="polite">
            <Typography semanticTag="p" visualAppearance="body-two">
              {habitat ? habitat.detail : 'Select a habitat to see details.'}
            </Typography>
          </div>
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
