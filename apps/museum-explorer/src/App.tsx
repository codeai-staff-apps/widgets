import Button from '@code-dot-org/component-library/button';
import TextField from '@code-dot-org/component-library/textField';
import Typography from '@code-dot-org/component-library/typography';
import {useCallback, useEffect, useRef, useState, type FormEvent} from 'react';

import {fetchObject, searchObjectIds, shuffle} from './api';
import './app.css';
import type {Artwork} from './collection';
import Detail from './Detail';
import Gallery, {EmptyState, Skeletons} from './Gallery';
import {useAnnounce} from './shared';

type Phase =
  | {kind: 'loading'; message: string}
  | {kind: 'results'; query: string; artworks: readonly Artwork[]}
  | {kind: 'error'};

const GENERIC_ERROR = 'Something went wrong loading the collection. Please try again.';

/** What the status region says. Never cleared: the outcome is the announcement. */
function statusText(phase: Phase): string {
  if (phase.kind === 'loading') {
    return phase.message;
  }
  if (phase.kind === 'error') {
    return GENERIC_ERROR;
  }
  const {query, artworks} = phase;
  if (!query) {
    return `Showing all ${artworks.length} pieces in the collection.`;
  }
  if (artworks.length === 0) {
    return `No results for “${query}”.`;
  }
  return `${artworks.length} result${artworks.length === 1 ? '' : 's'} for “${query}”.`;
}

export default function App() {
  const [query, setQuery] = useState('');
  const [phase, setPhase] = useState<Phase>({kind: 'loading', message: 'Loading the collection…'});
  const [openArtwork, setOpenArtwork] = useState<Artwork | null>(null);
  const [restoreFocusTo, setRestoreFocusTo] = useState<number | null>(null);
  const announce = useAnnounce();
  // Ignores a search that finishes after a newer one has started.
  const latestSearch = useRef(0);

  const runSearch = useCallback(async (searchTerm: string) => {
    const token = ++latestSearch.current;
    setPhase({
      kind: 'loading',
      message: searchTerm ? `Searching for “${searchTerm}”…` : 'Loading the collection…',
    });
    try {
      const ids = await searchObjectIds(searchTerm);
      const artworks = await Promise.all(shuffle(ids).map(fetchObject));
      if (token === latestSearch.current) {
        setPhase({kind: 'results', query: searchTerm, artworks});
      }
    } catch {
      if (token === latestSearch.current) {
        setPhase({kind: 'error'});
      }
    }
  }, []);

  useEffect(() => {
    runSearch('');
  }, [runSearch]);

  useEffect(() => {
    if (openArtwork || restoreFocusTo === null) {
      return;
    }
    document.querySelector<HTMLElement>(`[data-object-id="${restoreFocusTo}"]`)?.focus();
    setRestoreFocusTo(null);
  }, [openArtwork, restoreFocusTo]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      runSearch(trimmed);
    }
  };

  const openDetail = (artwork: Artwork) => {
    setOpenArtwork(artwork);
    announce(`Showing details for ${artwork.title}.`);
  };

  const closeDetail = () => {
    setRestoreFocusTo(openArtwork?.objectID ?? null);
    setOpenArtwork(null);
  };

  return (
    <>
      <header className="hero">
        <Typography semanticTag="h1" visualAppearance="heading-lg">
          My Decent Docent
        </Typography>
        <Typography semanticTag="p" visualAppearance="body-one">
          Museum Explorer App
        </Typography>
      </header>

      <main className="page">
        <form role="search" className="search" onSubmit={onSubmit}>
          <TextField
            name="search"
            label="Search artwork, artist, or era"
            placeholder="Search artwork, artist, era…"
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
          <Button text="Search" buttonTagTypeAttribute="submit" onClick={() => {}} />
        </form>

        <div role="status" aria-live="polite" className="search-status">
          <Typography semanticTag="p" visualAppearance="body-two">
            {statusText(phase)}
          </Typography>
        </div>

        {openArtwork ? (
          <Detail artwork={openArtwork} onClose={closeDetail} />
        ) : (
          <>
            {phase.kind === 'loading' && <Skeletons />}
            {phase.kind === 'results' &&
              (phase.artworks.length === 0 ? (
                <EmptyState />
              ) : (
                <Gallery artworks={phase.artworks} onOpen={openDetail} />
              ))}
          </>
        )}
      </main>

      <footer className="credit">
        <Typography semanticTag="p" visualAppearance="body-three">
          Artwork data and images from The Metropolitan Museum of Art&apos;s Open Access
          collection.
        </Typography>
      </footer>
    </>
  );
}
