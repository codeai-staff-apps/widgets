import Button from '@code-dot-org/component-library/button';
import Chips from '@code-dot-org/component-library/chips';
import SimpleDropdown from '@code-dot-org/component-library/dropdown/simpleDropdown';
import SegmentedButtons from '@code-dot-org/component-library/segmentedButtons';
import Typography from '@code-dot-org/component-library/typography';
import Pagination from '@mui/material/Pagination';
import {useEffect, useMemo, useRef, useState} from 'react';

import DetailDialog from './DetailDialog';
import FillingCard, {type ImageDetail} from './FillingCard';
import {
  applyFilters,
  describeFillings,
  initialFilters,
  nounSlotIndex,
  slotOptions,
  STATUS_FILTERS,
  summarize,
  type Filters,
  type StatusFilter,
} from './filters';
import {capitalize, plural} from './format';
import {loadManifest} from './data';
import {LoadError, LoadingGrid, SnapshotNotice} from './SourceNotices';
import {useAnnounce} from './shared';
import type {Manifest, ReviewIndexEntry} from './types';
import {useLoaded} from './useLoaded';

const PAGE_SIZE = 24;

interface CategoryReviewProps {
  entry: ReviewIndexEntry;
  /** Set when the index itself came from the snapshot, which already shows a notice. */
  indexIsSnapshot: boolean;
  epoch: number;
  onReload: () => void;
}

/** Loads one category's manifest on demand, then hands it to the browser. */
export default function CategoryReview({entry, indexIsSnapshot, epoch, onReload}: CategoryReviewProps) {
  const state = useLoaded(() => loadManifest(entry.manifest), [entry.manifest, epoch]);

  if (state.status === 'loading') {
    return <LoadingGrid label={`Loading ${entry.sentenceId} images…`} />;
  }
  if (state.status === 'error') {
    return <LoadError message={state.message} onRetry={onReload} />;
  }
  const {data, source, liveError} = state.loaded;
  return (
    <>
      {source === 'snapshot' && !indexIsSnapshot && (
        <SnapshotNotice generatedAt={data.generatedAt} reason={liveError} onRetry={onReload} />
      )}
      <ManifestBrowser entry={entry} manifest={data} />
    </>
  );
}

function ManifestBrowser({entry, manifest}: {entry: ReviewIndexEntry; manifest: Manifest}) {
  const announce = useAnnounce();
  const [filters, setFilters] = useState(() => initialFilters(manifest));
  const [frame, setFrame] = useState('base');
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<ImageDetail | null>(null);
  const resultsTop = useRef<HTMLDivElement>(null);

  const {slots, animated} = manifest;
  const nounIndex = nounSlotIndex(slots);
  const noun = slots[nounIndex];
  const frames = manifest.fillings[0]?.frames ?? [];
  // Images that are not animated have one frame, named `single`.
  const shownFrame = animated ? frame : (frames[0] ?? 'single');

  const views = useMemo(() => describeFillings(manifest), [manifest]);
  const matches = useMemo(() => applyFilters(views, manifest, filters), [views, manifest, filters]);
  const totals = summarize(matches);
  const pageCount = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const visible = matches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const summary = `${totals.fillings} of ${plural(views.length, 'filling')} · ${plural(totals.published, 'published image')} · ${plural(totals.rejected, 'rejected attempt')} · ${plural(totals.unpublished, 'filling')} with no published image`;
  useEffect(() => announce(summary), [announce, summary]);

  const update = (next: Partial<Filters>) => {
    setFilters(current => ({...current, ...next}));
    setPage(1);
  };
  const reset = () => {
    setFilters(initialFilters(manifest));
    setPage(1);
  };

  return (
    <div className="browser">
      <Typography semanticTag="h2" visualAppearance="heading-md" noMargin>
        {capitalize(entry.sentenceId)}
      </Typography>
      <Typography semanticTag="p" visualAppearance="body-two" noMargin>
        {plural(entry.fillings, 'filling')}. Variants:{' '}
        {Object.entries(entry.variants)
          .map(([status, count]) => `${count} ${status}`)
          .join(', ')}
        . {plural(entry.rejected, 'rejected attempt')}.
      </Typography>

      <div className="filters">
        <SimpleDropdown
          name="noun"
          labelText={capitalize(noun.label)}
          selectedValue={filters.noun}
          onChange={event => update({noun: event.target.value})}
          items={[
            {value: '', text: `All ${noun.label}s`},
            ...noun.words.map(w => ({value: w.id, text: w.text})),
          ]}
        />
        {slots.map(
          (slot, i) =>
            i !== nounIndex && (
              <Chips
                key={slot.id}
                name={slot.id}
                label={capitalize(slot.label)}
                options={slotOptions(slot)}
                values={filters.slots[slot.id]}
                setValues={values => update({slots: {...filters.slots, [slot.id]: values}})}
                size="s"
              />
            ),
        )}
        {animated && (
          <div role="group" aria-labelledby="frame-label" className="segmented">
            <Typography semanticTag="span" visualAppearance="body-three" id="frame-label" noMargin>
              Animation frame
            </Typography>
            <SegmentedButtons
              size="s"
              selectedButtonValue={frame}
              onChange={setFrame}
              buttons={frames.map(f => ({value: f, label: capitalize(f)}))}
            />
          </div>
        )}
        <div role="group" aria-labelledby="status-label" className="segmented">
          <Typography semanticTag="span" visualAppearance="body-three" id="status-label" noMargin>
            Show
          </Typography>
          <SegmentedButtons
            size="s"
            selectedButtonValue={filters.status}
            onChange={status => update({status: status as StatusFilter})}
            buttons={STATUS_FILTERS}
          />
        </div>
        <div>
          <Button text="Reset filters" type="tertiary" size="s" onClick={reset} />
        </div>
      </div>

      <div ref={resultsTop} className="summary">
        <Typography semanticTag="p" visualAppearance="body-two" noMargin>
          {summary}
        </Typography>
      </div>

      {visible.length === 0 ? (
        <Typography semanticTag="p" visualAppearance="body-two">
          No fillings match these filters.
        </Typography>
      ) : (
        <ul className="grid">
          {visible.map(view => (
            <FillingCard key={view.key} view={view} frame={shownFrame} onOpen={setDetail} />
          ))}
        </ul>
      )}

      {pageCount > 1 && (
        <Pagination
          className="pagination"
          count={pageCount}
          page={page}
          onChange={(_, next) => {
            setPage(next);
            resultsTop.current?.scrollIntoView({block: 'start'});
          }}
        />
      )}

      {detail && <DetailDialog detail={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}
