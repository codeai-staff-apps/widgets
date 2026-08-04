import {COLLECTION, type Artwork} from './collection';

/**
 * A museum API, simulated. The point of the exercise is the two-step shape —
 * search returns ids, then each id is looked up separately, and both steps
 * take time — so both steps keep their artificial latency even though the
 * data is bundled. Nothing here touches the network.
 */

const SEARCH_DELAY = () => 350 + Math.random() * 300;
const LOOKUP_DELAY = () => 150 + Math.random() * 150;

const after = <T>(ms: number, value: T) =>
  new Promise<T>(resolve => window.setTimeout(() => resolve(value), ms));

/**
 * Step one: a case-insensitive substring match over title, artist, culture,
 * object name, classification, department and keywords. Dates, medium,
 * dimensions, period, dynasty and geography are deliberately not searched —
 * "1889" finds nothing even though the detail view shows it.
 */
export function searchObjectIds(query: string): Promise<number[]> {
  const normalized = query.trim().toLowerCase();
  const ids = COLLECTION.filter(object => {
    const haystack = [
      object.title,
      object.artistDisplayName,
      object.culture,
      object.objectName,
      object.classification,
      object.department,
      ...object.keywords,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalized);
  }).map(object => object.objectID);

  return after(SEARCH_DELAY(), ids);
}

/** Step two: one lookup per id, run in parallel by the caller. */
export function fetchObject(objectID: number): Promise<Artwork> {
  const object = COLLECTION.find(candidate => candidate.objectID === objectID);
  if (!object) {
    return Promise.reject(new Error(`No object ${objectID}`));
  }
  return after(LOOKUP_DELAY(), object);
}

/** Fisher-Yates: the gallery is in a different order on every load. */
export function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
