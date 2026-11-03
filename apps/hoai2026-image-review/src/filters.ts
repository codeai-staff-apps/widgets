import type {Filling, Manifest, Slot} from './types';

/** Word id for an empty optional slot. */
export const EMPTY_WORD = '_';

export type StatusFilter = 'all' | 'published' | 'rejections' | 'rejected-only' | 'unpublished';

export const STATUS_FILTERS: {value: StatusFilter; label: string}[] = [
  {value: 'all', label: 'All'},
  {value: 'published', label: 'Published'},
  {value: 'rejections', label: 'Has rejections'},
  {value: 'rejected-only', label: 'Rejected only'},
  {value: 'unpublished', label: 'No published image'},
];

export interface Filters {
  /** Word id of the noun, or '' for all nouns. */
  noun: string;
  /** Selected word ids per non-noun slot id. Everything selected means no filter. */
  slots: Record<string, string[]>;
  status: StatusFilter;
}

/** A filling with the display data the grid needs, computed once per manifest. */
export interface FillingView {
  filling: Filling;
  key: string;
  /** Word text per slot, in slot order; '' for an empty slot. */
  words: string[];
  title: string;
  published: number;
  rejected: number;
  neverDrawn: boolean;
}

/** The noun is the first required slot (thing, place, material, creature). */
export const nounSlotIndex = (slots: Slot[]) => Math.max(0, slots.findIndex(s => s.required));

export const slotOptions = (slot: Slot) => [
  ...(slot.required ? [] : [{value: EMPTY_WORD, label: `No ${slot.label}`}]),
  ...slot.words.map(w => ({value: w.id, label: w.text})),
];

export const initialFilters = (manifest: Manifest): Filters => {
  const noun = nounSlotIndex(manifest.slots);
  return {
    noun: '',
    slots: Object.fromEntries(
      manifest.slots
        .filter((_, i) => i !== noun)
        .map(slot => [slot.id, slotOptions(slot).map(o => o.value)]),
    ),
    status: 'all',
  };
};

/** Fillings ordered by noun, then by the other slots in slot order. */
export function describeFillings({slots, fillings}: Manifest): FillingView[] {
  const noun = nounSlotIndex(slots);
  const text = slots.map(slot => new Map(slot.words.map(w => [w.id, w.text])));
  const views = fillings.map(filling => {
    const words = filling.wordIds.map((id, i) => text[i].get(id) ?? (id === EMPTY_WORD ? '' : id));
    const published = filling.variants.filter(v => v.current?.published).length;
    return {
      filling,
      key: filling.wordIds.join('/'),
      words,
      title: words.filter(Boolean).join(' · '),
      published,
      rejected: filling.variants.reduce((n, v) => n + v.rejected.length, 0),
      neverDrawn: filling.variants.every(v => v.status === 'not drawn'),
    };
  });
  const order = [noun, ...slots.map((_, i) => i).filter(i => i !== noun)];
  return views.sort((a, b) => {
    for (const i of order) {
      const diff = a.words[i].localeCompare(b.words[i]);
      if (diff) {
        return diff;
      }
    }
    return 0;
  });
}

const STATUS_TESTS: Record<StatusFilter, (v: FillingView) => boolean> = {
  all: () => true,
  published: v => v.published > 0,
  rejections: v => v.rejected > 0,
  'rejected-only': v => v.published === 0 && v.rejected > 0,
  unpublished: v => v.published === 0,
};

export function applyFilters(views: FillingView[], manifest: Manifest, filters: Filters) {
  const noun = nounSlotIndex(manifest.slots);
  const checked = manifest.slots.flatMap((slot, i) => {
    const selected = filters.slots[slot.id];
    return selected && selected.length < slotOptions(slot).length ? [{i, selected}] : [];
  });
  return views.filter(
    v =>
      STATUS_TESTS[filters.status](v) &&
      (!filters.noun || v.filling.wordIds[noun] === filters.noun) &&
      checked.every(({i, selected}) => selected.includes(v.filling.wordIds[i])),
  );
}

export function summarize(views: FillingView[]) {
  return {
    fillings: views.length,
    published: views.reduce((n, v) => n + v.published, 0),
    rejected: views.reduce((n, v) => n + v.rejected, 0),
    unpublished: views.filter(v => v.published === 0).length,
  };
}
