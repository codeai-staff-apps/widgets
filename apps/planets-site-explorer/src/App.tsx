import Alert from '@code-dot-org/component-library/alert';
import Typography from '@code-dot-org/component-library/typography';
import classNames from 'classnames';
import {useState} from 'react';

import './app.css';
import SampleSite from './SampleSite';
import {COMPLETION_NOTE, DETAIL_PLACEHOLDER, DIRECTIONS, SECTIONS, type Section} from './sections';
import {useAnnounce} from './shared';

export default function App() {
  const [explored, setExplored] = useState<ReadonlySet<string>>(new Set());
  const [current, setCurrent] = useState<Section | null>(null);
  const announce = useAnnounce();

  const activate = (section: Section) => {
    const next = new Set(explored).add(section.key);
    setExplored(next);
    setCurrent(section);
    announce(`${section.title}: ${section.text} ${next.size} of ${SECTIONS.length} sections explored.`);
  };

  return (
    <main className="page">
      <Typography semanticTag="h1" visualAppearance="heading-lg" className="worksheet-heading heading-ink">
        Explore the Parts of a Web Page
      </Typography>
      <Typography semanticTag="p" visualAppearance="body-two">
        {DIRECTIONS}
      </Typography>

      <div className="progress-row">
        {SECTIONS.map(section => {
          const isExplored = explored.has(section.key);
          return (
            <span key={section.key} className={classNames('progress-chip', {explored: isExplored})}>
              <span className="check">✓</span>
              {section.label}
            </span>
          );
        })}
      </div>
      <Typography semanticTag="p" visualAppearance="body-three">
        {explored.size} of {SECTIONS.length} sections explored
      </Typography>

      <SampleSite explored={explored} activeKey={current?.key ?? null} onActivate={activate} />

      <section aria-labelledby="detail-heading">
        <Typography
          semanticTag="h2"
          visualAppearance="heading-sm"
          id="detail-heading"
          className="worksheet-heading heading-ink"
        >
          What this part does
        </Typography>
        {current ? (
          <Alert
            type="info"
            role={undefined}
            className="detail-alert"
            text={
              <>
                <strong className="worksheet-heading">{current.title}</strong> — {current.text}
              </>
            }
          />
        ) : (
          <Typography semanticTag="p" visualAppearance="body-two" className="detail-placeholder">
            <em>{DETAIL_PLACEHOLDER}</em>
          </Typography>
        )}

        {explored.size === SECTIONS.length && (
          <Alert type="success" role={undefined} className="completion-alert" text={COMPLETION_NOTE} />
        )}
      </section>
    </main>
  );
}
