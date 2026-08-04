import Alert from '@code-dot-org/component-library/alert';
import Tags from '@code-dot-org/component-library/tags';
import Typography from '@code-dot-org/component-library/typography';
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
      <Typography semanticTag="h1" visualAppearance="heading-lg">
        Explore the Parts of a Web Page
      </Typography>
      <Alert type="info" role={undefined} text={DIRECTIONS} />

      <SampleSite explored={explored} activeKey={current?.key ?? null} onActivate={activate} />

      <section aria-labelledby="detail-heading">
        <Typography semanticTag="h2" visualAppearance="heading-sm" id="detail-heading">
          What this part does
        </Typography>
        {current ? (
          <Alert
            type="info"
            role={undefined}
            text={
              <>
                <strong>{current.title}</strong> — {current.text}
              </>
            }
          />
        ) : (
          <Typography semanticTag="p" visualAppearance="body-two">
            <em>{DETAIL_PLACEHOLDER}</em>
          </Typography>
        )}

        <Typography semanticTag="p" visualAppearance="body-three">
          {explored.size} of {SECTIONS.length} sections explored
        </Typography>
        <Tags
          tagsList={SECTIONS.map(section => {
            const isExplored = explored.has(section.key);
            return {
              label: isExplored ? `✓ ${section.label}` : section.label,
              ariaLabel: `${section.label}, ${isExplored ? 'explored' : 'not yet explored'}`,
            };
          })}
        />

        {explored.size === SECTIONS.length && (
          <Alert type="success" role={undefined} text={COMPLETION_NOTE} />
        )}
      </section>
    </main>
  );
}
