export interface Segment {
  text: string;
  strong?: true;
  code?: true;
}

export interface Step {
  id: string;
  /** 1-indexed position in the real timeline, not the position shown on load. */
  correctOrder: number;
  segments: Segment[];
}

export const STEPS_ID = 'steps';

/** Load order. Reset restores exactly this scramble, as in the original. */
export const STEPS: Step[] = [
  {
    id: 'second-then',
    correctOrder: 4,
    segments: [
      {text: 'The '},
      {text: 'second', strong: true},
      {text: ' '},
      {text: '.then()', code: true},
      {text: ' runs with data'},
    ],
  },
  {
    id: 'pending',
    correctOrder: 2,
    segments: [{text: 'fetch()', code: true}, {text: ' returns a pending Promise'}],
  },
  {
    id: 'click',
    correctOrder: 1,
    segments: [{text: 'Button click starts the request'}],
  },
  {
    id: 'catch',
    correctOrder: 5,
    segments: [{text: '.catch()', code: true}, {text: " runs if there's an error"}],
  },
  {
    id: 'first-then',
    correctOrder: 3,
    segments: [
      {text: 'The '},
      {text: 'first', strong: true},
      {text: ' '},
      {text: '.then()', code: true},
      {text: ' runs with a Response'},
    ],
  },
];

export const plainText = (step: Step) => step.segments.map(segment => segment.text).join('');

export const ALL_CORRECT =
  'Correct! Button click → fetch returns Promise → first .then() gets Response → second .then() gets data → .catch() runs if error.';

/*
 * The original said "green-edged" and "red-edged", which only helps a reader
 * who can see the border colours. Each step now carries a worded marker, so
 * the retry copy points at the marker instead.
 */
export const NOT_YET =
  'Not quite yet. Steps marked correct are in the right spot. Move the ones marked "needs to move" and check again.';
