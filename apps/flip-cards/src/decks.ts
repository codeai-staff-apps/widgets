/*
 * Deck content transcribed from the original vibe apps. One flip-cards app
 * serves every deck; levels select one via ?deck=<id>. Definition text is a
 * list of segments so emphasis survives without HTML-in-data.
 */

export type Segment = {text: string; bold?: boolean; italic?: boolean};

export type Card = {emoji: string; term: string; definition: Segment[]};

export type Deck = {title: string; cards: Card[]};

export const decks: Record<string, Deck> = {
  'vocab-u4': {
    title: 'Vocabulary Flip Cards',
    cards: [
      {
        emoji: '🔧',
        term: 'Active filter',
        definition: [
          {text: 'The current set of rules being applied to a set of data and '},
          {text: 'clearly shown to the user', bold: true},
          {text: '. It explains how the data is being limited '},
          {text: 'right now', italic: true},
          {text: '.'},
        ],
      },
      {
        emoji: '🫧',
        term: 'Filter bubble',
        definition: [
          {
            text: 'When algorithms mostly show you content that matches what you already like or agree with, and hide other viewpoints or topics, often ',
          },
          {text: 'without you noticing', bold: true},
          {text: '.'},
        ],
      },
    ],
  },
};

export const DEFAULT_DECK = 'vocab-u4';
