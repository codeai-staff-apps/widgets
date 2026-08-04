/**
 * The five method demos, in page order. `code` marks the highlighted token
 * with `**…**`; the result of each run is fixed data, never computed against a
 * previous run's output.
 */

export type ItemState = 'plain' | 'same' | 'new' | 'changed' | 'removed';

export interface ArrayItem {
  text: string;
  state: ItemState;
}

export interface ArrayCard {
  badge: string;
  title: string;
  items: ArrayItem[];
}

export interface Example {
  id: string;
  heading: string;
  /** One-line description of the snippet, read before the code, never instead of it. */
  codeSummary: string;
  code: string;
  cards: [ArrayCard, ArrayCard];
  verdict: {mutates: boolean; badge: string; text: string};
  announcement: string;
}

const BASE = ['tutoring', 'mentoring', 'coding', 'art', 'music'];

const items = (texts: readonly string[], state: ItemState): ArrayItem[] =>
  texts.map(text => ({text, state}));

const UPPERCASED = BASE.map(role => role.toUpperCase());

export const directions = {
  heading: 'How to use this visualizer:',
  steps: [
    'Look at the code — notice the original array and the method being used.',
    'Try to predict: will the original array change, or stay the same?',
    'Press Run this code and compare the original array to the result.',
  ],
};

export const examples: Example[] = [
  {
    id: 'filter',
    heading: '.filter()',
    codeSummary: 'Code example using .filter() to remove art from the opportunities array',
    code: `const opportunities = ["tutoring","mentoring","coding","art","music"];

const result = opportunities.**filter**(role => role !== "art");

console.log(opportunities); // ?
console.log(result);       // ?`,
    cards: [
      {badge: 'original', title: 'opportunities', items: items(BASE, 'same')},
      {
        badge: 'result',
        title: 'result',
        items: items(['tutoring', 'mentoring', 'coding', 'music'], 'new'),
      },
    ],
    verdict: {
      mutates: false,
      badge: 'Pure method',
      text: 'Original array unchanged — .filter() returned a brand new array.',
    },
    announcement:
      '.filter() ran. Original array is unchanged: tutoring, mentoring, coding, art, music. Result is a new array: tutoring, mentoring, coding, music. This is a pure method.',
  },
  {
    id: 'map',
    heading: '.map()',
    codeSummary: 'Code example using .map() to uppercase each item in the opportunities array',
    code: `const opportunities = ["tutoring","mentoring","coding","art","music"];

const result = opportunities.**map**(role => role.toUpperCase());

console.log(opportunities); // ?
console.log(result);       // ?`,
    cards: [
      {badge: 'original', title: 'opportunities', items: items(BASE, 'same')},
      {badge: 'result', title: 'result', items: items(UPPERCASED, 'new')},
    ],
    verdict: {
      mutates: false,
      badge: 'Pure method',
      text: 'Original array unchanged — .map() transformed each item into a brand new array.',
    },
    announcement:
      '.map() ran. Original array is unchanged: tutoring, mentoring, coding, art, music. Result is a new array: TUTORING, MENTORING, CODING, ART, MUSIC. This is a pure method.',
  },
  {
    id: 'forEach',
    heading: '.forEach()',
    codeSummary:
      'Code example using .forEach() to uppercase items, modifying the original array',
    code: `const opportunities = ["tutoring","mentoring","coding","art","music"];

opportunities.**forEach**((role, i) => {
  opportunities[i] = role.toUpperCase();
});

console.log(opportunities); // ?`,
    cards: [
      {badge: 'original', title: 'opportunities (before)', items: items(BASE, 'plain')},
      {badge: 'mutated', title: 'opportunities (after)', items: items(UPPERCASED, 'changed')},
    ],
    verdict: {
      mutates: true,
      badge: 'Side effect',
      text: 'Original array was changed! .forEach() has no return value — any modification inside it is a side effect on the original data.',
    },
    announcement:
      '.forEach() ran. The original array was mutated. After: TUTORING, MENTORING, CODING, ART, MUSIC. This is a side effect.',
  },
  {
    id: 'forloop',
    heading: 'for loop',
    codeSummary:
      'Code example using a for loop to overwrite each item in the opportunities array',
    code: `const opportunities = ["tutoring","mentoring","coding","art","music"];

for (let i = 0; i < opportunities.length; i++) {
  **opportunities[i]** = opportunities[i].toUpperCase();
}

console.log(opportunities); // ?`,
    cards: [
      {badge: 'original', title: 'opportunities (before)', items: items(BASE, 'plain')},
      {badge: 'mutated', title: 'opportunities (after)', items: items(UPPERCASED, 'changed')},
    ],
    verdict: {
      mutates: true,
      badge: 'Side effect',
      text: 'Original array was changed! The for loop wrote directly into opportunities[i], overwriting each item in place.',
    },
    announcement:
      'The for loop ran. The original array was mutated. After: TUTORING, MENTORING, CODING, ART, MUSIC. This is a side effect.',
  },
  {
    id: 'shift',
    heading: '.shift()',
    codeSummary: 'Code example using .shift() to remove the first item from the opportunities array',
    code: `const opportunities = ["tutoring","mentoring","coding","art","music"];

const first = opportunities.**shift**();

console.log(opportunities); // ?
console.log(first);        // ?`,
    cards: [
      {
        badge: 'original',
        title: 'opportunities (before)',
        items: [
          {text: 'tutoring', state: 'removed'},
          ...items(BASE.slice(1), 'plain'),
        ],
      },
      {
        badge: 'mutated',
        title: 'opportunities (after)',
        items: items(BASE.slice(1), 'changed'),
      },
    ],
    verdict: {
      mutates: true,
      badge: 'Side effect',
      text: 'Original array was changed! .shift() removed "tutoring" from the front and returned it — the original is now shorter.',
    },
    announcement:
      '.shift() ran. The first item, tutoring, was removed from the original array. Remaining items: mentoring, coding, art, music. This is a side effect.',
  },
];

export const resetAnnouncement = 'Visualizer reset. All examples ready to run again.';
export const emptyMessage = 'not run yet';
