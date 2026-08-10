export interface Term {
  id: string;
  label: string;
  /** Correct category. */
  zone: string;
}

export const BANK_ID = 'bank';
export const ACTION_ID = 'zone-action';
export const PART_ID = 'zone-part';

export const ZONE_NAMES: Record<string, string> = {
  // Matches each tray's visible label, so the target's accessible name contains it.
  [BANK_ID]: 'Unsorted terms',
  [ACTION_ID]: 'Actions (Events)',
  [PART_ID]: 'Parts of the Page (Elements)',
};

export const TERMS: Term[] = [
  {id: 'click', label: 'Click', zone: ACTION_ID},
  {id: 'button', label: 'Button', zone: PART_ID},
  {id: 'type', label: 'Type', zone: ACTION_ID},
  {id: 'image', label: 'Image', zone: PART_ID},
  {id: 'scroll', label: 'Scroll', zone: ACTION_ID},
  {id: 'text', label: 'Text', zone: PART_ID},
  {id: 'hover', label: 'Hover', zone: ACTION_ID},
  {id: 'heading', label: 'Heading', zone: PART_ID},
];

/** Shown once per category that contains a misplaced term. */
export const ZONE_HINT =
  'One or more of these belongs in the other category. Ask: is this something a user does, or something that sits on the page?';

/** The takeaway that links the sort to the next lesson, revealed on a perfect score. */
export const BRIDGE_NOTE =
  "Elements and Events are exactly what the DOM keeps track of. Next, you'll see how that actually works under the hood.";
