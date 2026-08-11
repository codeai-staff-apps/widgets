/** Colour groups chips by construct: `if (score > 100)` and `} else {` share
 * a tone because they are the same construct. The tone drives both the
 * chip's own colour and the colour it carries onto its drop zone. */
export type ChipTone = 'start' | 'if-else' | 'win' | 'keep' | 'end';

export interface Chip {
  id: string;
  text: string;
  tone: ChipTone;
}

/** Pre-grading branch tint: the Yes zone reads as a "win" outcome, the No
 * zones as a "keep trying" outcome, before any chip is even placed. */
export type ZoneTint = 'yes' | 'no';

export interface Zone {
  id: string;
  /** Answer chip id. Zones are not shuffled: dz-win wants chip `win`. */
  answer: string;
  /** Spoken position in the flowchart. Never names the chip that belongs here. */
  label: string;
  tint?: ZoneTint;
}

export const BANK_ID = 'bank';

/** Code-bank order, which is also the tab order of the chips. */
export const CHIPS: Chip[] = [
  {id: 'start', text: '// Start game', tone: 'start'},
  {id: 'condition', text: 'if (score > 100)', tone: 'if-else'},
  {id: 'win', text: 'message = "You win!"', tone: 'win'},
  {id: 'keep', text: 'message = "Keep trying!"', tone: 'keep'},
  {id: 'else', text: '} else {', tone: 'if-else'},
  {id: 'end', text: '// End', tone: 'end'},
];

/** Flowchart flow order, which is also the tab order of the zones. */
export const ZONES: Zone[] = [
  {id: 'dz-start', answer: 'start', label: 'Drop zone after Playing Game'},
  {id: 'dz-condition', answer: 'condition', label: 'Drop zone after the decision'},
  {id: 'dz-win', answer: 'win', label: 'Drop zone in the Yes branch, before You Win', tint: 'yes'},
  {id: 'dz-else', answer: 'else', label: 'Drop zone in the No branch, first slot', tint: 'no'},
  {id: 'dz-keep', answer: 'keep', label: 'Drop zone in the No branch, before Keep Trying', tint: 'no'},
  {id: 'dz-end', answer: 'end', label: 'Final drop zone, after both branches'},
];

export const chipById = Object.fromEntries(CHIPS.map(c => [c.id, c]));
