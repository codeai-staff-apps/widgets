import {assetUrl, FETCH_TIMEOUT_MS, INDEX_PATH} from './config';
import type {Manifest, ReviewIndex} from './types';

/** Where a piece of review data came from. */
export interface Loaded<T> {
  data: T;
  source: 'live' | 'snapshot';
  /** Why live loading failed, when `source` is `snapshot`. */
  liveError?: string;
}

// Raw text, parsed only for the category being viewed (place is 1.2 MB).
const snapshots = import.meta.glob<string>('./snapshot/*.json', {
  query: '?raw',
  import: 'default',
  eager: true,
});

/** `review/v1/place/manifest.json` -> `place`; the index is `index`. */
const snapshotName = (path: string) =>
  path.endsWith('/index.json') ? 'index' : path.split('/').at(-2)!;

async function fetchLive<T>(path: string): Promise<T> {
  const response = await fetch(assetUrl(path), {
    cache: 'no-cache',
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${path}`);
  }
  return response.json();
}

async function load<T>(path: string): Promise<Loaded<T>> {
  try {
    return {data: await fetchLive<T>(path), source: 'live'};
  } catch (liveError) {
    const raw = snapshots[`./snapshot/${snapshotName(path)}.json`];
    if (raw === undefined) {
      throw liveError;
    }
    return {
      data: JSON.parse(raw) as T,
      source: 'snapshot',
      liveError: liveError instanceof Error ? liveError.message : String(liveError),
    };
  }
}

const cache = new Map<string, Promise<Loaded<unknown>>>();

/** Each file is fetched at most once per page load, until `reloadAll`. */
function cached<T>(path: string): Promise<Loaded<T>> {
  let pending = cache.get(path);
  if (!pending) {
    pending = load<T>(path);
    pending.catch(() => cache.delete(path));
    cache.set(path, pending);
  }
  return pending as Promise<Loaded<T>>;
}

export const loadIndex = () => cached<ReviewIndex>(INDEX_PATH);
export const loadManifest = (path: string) => cached<Manifest>(path);
export const reloadAll = () => cache.clear();
