import Tabs from '@code-dot-org/component-library/tabs';
import Typography from '@code-dot-org/component-library/typography';
import Skeleton from '@mui/material/Skeleton';
import {useState} from 'react';

import CategoryReview from './CategoryReview';
import {loadIndex, reloadAll} from './data';
import {capitalize} from './format';
import {LoadError, LoadingGrid, SnapshotNotice} from './SourceNotices';
import type {ReviewIndex} from './types';
import {useLoaded} from './useLoaded';

export default function App() {
  // Bumped by Retry to load everything again.
  const [epoch, setEpoch] = useState(0);
  const [selected, setSelected] = useState('');
  const index = useLoaded(loadIndex, [epoch]);

  const reload = () => {
    reloadAll();
    setEpoch(n => n + 1);
  };

  return (
    <main className="page">
      <header className="header">
        <Typography semanticTag="h1" visualAppearance="heading-lg" noMargin>
          Hour of AI 2026 image review
        </Typography>
        <Typography semanticTag="p" visualAppearance="body-two" noMargin>
          Images generated for the Sprite Lab sentences. Published images are what learners see;
          rejected attempts are kept for review.
        </Typography>
      </header>

      {index.status === 'loading' && (
        <>
          <Skeleton variant="rectangular" height={48} />
          <LoadingGrid label="Loading the review index…" />
        </>
      )}
      {index.status === 'error' && <LoadError message={index.message} onRetry={reload} />}
      {index.status === 'ready' && (
        <>
          {index.loaded.source === 'snapshot' && (
            <SnapshotNotice
              generatedAt={index.loaded.data.generatedAt}
              reason={index.loaded.liveError}
              onRetry={reload}
            />
          )}
          <Categories
            index={index.loaded.data}
            indexIsSnapshot={index.loaded.source === 'snapshot'}
            selected={selected}
            onSelect={setSelected}
            epoch={epoch}
            onReload={reload}
          />
        </>
      )}
    </main>
  );
}

interface CategoriesProps {
  index: ReviewIndex;
  indexIsSnapshot: boolean;
  selected: string;
  onSelect: (id: string) => void;
  epoch: number;
  onReload: () => void;
}

function Categories({index, indexIsSnapshot, selected, onSelect, epoch, onReload}: CategoriesProps) {
  const current = index.sentences.find(s => s.sentenceId === selected) ?? index.sentences[0];
  return (
    <>
      <Typography semanticTag="p" visualAppearance="body-three" noMargin>
        Tab counts are published images / rejected attempts.
      </Typography>
      <Tabs
        name="category"
        size="m"
        scrollable
        defaultSelectedTabValue={current.sentenceId}
        onChange={onSelect}
        tabs={index.sentences.map(entry => ({
          value: entry.sentenceId,
          text: `${capitalize(entry.sentenceId)} (${entry.variants.published ?? 0} / ${entry.rejected})`,
          tabContent:
            entry.sentenceId === current.sentenceId ? (
              <CategoryReview
                key={entry.sentenceId}
                entry={entry}
                indexIsSnapshot={indexIsSnapshot}
                epoch={epoch}
                onReload={onReload}
              />
            ) : null,
        }))}
      />
    </>
  );
}
