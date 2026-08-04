/*
 * Deck content transcribed from the original vibe apps. One flip-cards app
 * serves every deck; levels select one via ?deck=<deckId>. Back faces come in
 * two shapes — a prose definition or a bullet list — so `body` is a union.
 * Prose is a list of segments so emphasis survives without HTML-in-data.
 */

export type Segment = {text: string; bold?: boolean; italic?: boolean};

export type Body =
  | {kind: 'prose'; segments: Segment[]}
  | {kind: 'bullets'; items: string[]};

export type Card = {emoji: string; term: string; body: Body};

export type Deck = {title: string; cards: Card[]};

const prose = (segments: Segment[]): Body => ({kind: 'prose', segments});

export const decks: Record<string, Deck> = {
  'unit4-vocab': {
    title: 'Vocabulary Flip Cards',
    cards: [
      {
        emoji: '🔧',
        term: 'Active filter',
        body: prose([
          {text: 'The current set of rules being applied to a set of data and '},
          {text: 'clearly shown to the user', bold: true},
          {text: '. It explains how the data is being limited '},
          {text: 'right now', italic: true},
          {text: '.'},
        ]),
      },
      {
        emoji: '🫧',
        term: 'Filter bubble',
        body: prose([
          {
            text: 'When algorithms mostly show you content that matches what you already like or agree with, and hide other viewpoints or topics, often ',
          },
          {text: 'without you noticing', bold: true},
          {text: '.'},
        ]),
      },
    ],
  },

  'undo-reset': {
    title: 'Undo vs Reset Flip Cards',
    cards: [
      {
        emoji: '↩️',
        term: 'Undo',
        body: {
          kind: 'bullets',
          items: [
            'Reverses the most recent change',
            'Useful for small mistakes',
            'Often repeatable (undo multiple steps)',
          ],
        },
      },
      {
        emoji: '🔄',
        term: 'Reset',
        body: {
          kind: 'bullets',
          items: [
            'Restores the original starting point',
            'Useful when users want a "clean slate"',
            'Fast recovery from major changes',
          ],
        },
      },
    ],
  },

  'threshold-fallback': {
    title: 'Threshold and Fallback Value Flip Cards',
    cards: [
      {
        emoji: '🎚️',
        term: 'Threshold',
        body: prose([
          {text: 'A '},
          {text: 'cutoff value', bold: true},
          {text: ' used to decide which items pass a filter.'},
        ]),
      },
      {
        emoji: '🛟',
        term: 'Fallback value',
        body: prose([
          {text: 'A '},
          {text: 'default label or value', bold: true},
          {text: " used when data is missing or doesn't match a category."},
        ]),
      },
    ],
  },

  /* Same title as unit4-vocab in the source; decks are keyed by id, never title. */
  'unit5-vocab': {
    title: 'Vocabulary Flip Cards',
    cards: [
      {
        emoji: '💻',
        term: 'Client',
        body: prose([{text: 'The app asking for data'}]),
      },
      {
        emoji: '🗄️',
        term: 'Server',
        body: prose([{text: 'The service that stores and sends data'}]),
      },
      {
        emoji: '📤',
        term: 'Request',
        body: prose([{text: 'A message asking for data'}]),
      },
      {
        emoji: '📥',
        term: 'Response',
        body: prose([{text: 'A message that sends data back'}]),
      },
    ],
  },

  'error-handling': {
    title: 'Vocabulary: Error Handling',
    cards: [
      {
        emoji: '🧪',
        term: 'try',
        body: prose([
          {
            text: 'A block of code used to test a section of code for errors while it is being executed.',
          },
        ]),
      },
      {
        emoji: '🥅',
        term: 'catch',
        body: prose([
          {
            text: 'A block of code used to handle errors that occur in the try block, preventing the program from crashing.',
          },
        ]),
      },
      {
        emoji: '🪂',
        term: 'fallback',
        body: prose([
          {
            text: 'A backup message, screen, or behavior your app uses when something goes wrong instead of crashing or staying blank.',
          },
        ]),
      },
    ],
  },

  'live-vs-local': {
    title: 'Vocabulary: Live Data vs Local Data',
    cards: [
      {
        emoji: '☁️',
        term: 'Live Data',
        body: prose([
          {
            text: 'Data that updates in real time from an outside source. It requires an internet connection to access and is retrieved using an API.',
          },
        ]),
      },
      {
        emoji: '💾',
        term: 'Local Data',
        body: prose([
          {
            text: 'Data that is stored directly on the device that is running the application. It is available immediately and does not require an internet connection.',
          },
        ]),
      },
    ],
  },
};

export const DEFAULT_DECK = 'unit4-vocab';

/** Plain-text definition, for the flip announcement. */
export function bodyText(body: Body): string {
  return body.kind === 'prose'
    ? body.segments.map(segment => segment.text).join('')
    : body.items.join('. ');
}
