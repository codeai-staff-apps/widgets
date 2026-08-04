export interface Chip {
  id: string;
  text: string;
}

export interface Zone {
  id: string;
  /** Answer chip id. Zones are not shuffled: dz-win wants chip `win`. */
  answer: string;
  /** Spoken position in the flowchart. Never names the chip that belongs here. */
  label: string;
}

export const BANK_ID = 'bank';

/** Code-bank order, which is also the tab order of the chips. */
export const CHIPS: Chip[] = [
  {id: 'start', text: '// Start game'},
  {id: 'condition', text: 'if (score > 100)'},
  {id: 'win', text: 'message = "You win!"'},
  {id: 'keep', text: 'message = "Keep trying!"'},
  {id: 'else', text: '} else {'},
  {id: 'end', text: '// End'},
];

/** Flowchart flow order, which is also the tab order of the zones. */
export const ZONES: Zone[] = [
  {id: 'dz-start', answer: 'start', label: 'Drop zone after Playing Game'},
  {id: 'dz-condition', answer: 'condition', label: 'Drop zone after the decision'},
  {id: 'dz-win', answer: 'win', label: 'Drop zone in the Yes branch, before You Win'},
  {id: 'dz-else', answer: 'else', label: 'Drop zone in the No branch, first slot'},
  {id: 'dz-keep', answer: 'keep', label: 'Drop zone in the No branch, before Keep Trying'},
  {id: 'dz-end', answer: 'end', label: 'Final drop zone, after both branches'},
];

export const chipById = Object.fromEntries(CHIPS.map(c => [c.id, c]));
