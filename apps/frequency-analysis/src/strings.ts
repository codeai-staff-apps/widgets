/**
 * Every user-facing string in one place, so a future localization pass has a
 * single file to translate instead of a hunt through JSX.
 */
export const strings = {
  heading: 'Frequency Analysis',
  intro:
    'Substitution ciphers hide a message by swapping each letter for another one, but they can’t hide how often each letter appears. Compare the ciphertext’s letter frequencies against standard English to guess the substitution.',

  messageLabel: 'Message',
  writeYourOwn: 'Write your own',
  customMessageLabel: 'Your message',
  customMessagePlaceholder: 'Write or paste a message here.',
  addMessage: 'Add message',
  cancelCustomMessage: 'Cancel',
  customMessageTitle: (excerpt: string) => `Custom: ${excerpt}`,
  decodedMessageHeading: 'Decoded message',
  decodedMessageHint: 'Locked-in guesses are shown in the plaintext color; everything else stays as ciphertext.',

  modeLabel: 'Cipher type',
  modeCaesar: 'Caesar Substitution',
  modeRandom: 'Random Substitution',

  boardHeading: 'Letter frequencies',
  captionOriginal: 'Original',
  captionMapsTo: 'Maps to',
  captionUnassigned: 'Unassigned',
  captionFrequency: 'Frequency',

  shiftLabel: 'Shift the substitutions left or right',
  shiftLeft: 'Shift left',
  shiftRight: 'Shift right',
  shiftFieldLabel: 'Shift amount',
  reset: 'Reset',

  sortOriginalsLabel: 'Sort originals',
  sortAlphabetic: 'A to Z',
  sortByFrequency: 'By %',

  sortSubstitutionsLabel: 'Sort substitutions',
  sortRandom: 'Random',
  assignAll: 'Assign',

  chartMessageSeries: 'Original message',
  standardLanguage: (name: string) => `Standard ${name}`,

  slotEmptyLabel: (letter: string, messagePercent: string) =>
    `${letter}: appears ${messagePercent} of the time in the message. No guess yet.`,
  slotFilledLabel: (letter: string, guess: string, messagePercent: string, guessLanguagePercent: string) =>
    `${letter}: appears ${messagePercent} of the time in the message. Currently guessed ${guess}, which appears ${guessLanguagePercent} of the time in standard English.`,
  tileLabel: (letter: string, languagePercent: string) =>
    `Letter ${letter}, appears ${languagePercent} of the time in standard English. Unassigned.`,
  unassignedEmptyLabel: (position: number) => `Unassigned position ${position}, empty`,

  dragInstructions:
    'Press space or enter to pick up a letter, arrow keys to move it across ciphertext columns or between the Maps to and Unassigned rows, space or enter to drop it, and escape to cancel.',

  announceMapped: (cipherLetter: string, guess: string) => `${cipherLetter} now maps to ${guess}.`,
  announceSwapped: (cipherLetter: string, guess: string, otherCipherLetter: string, otherGuess: string) =>
    `${cipherLetter} now maps to ${guess}, and ${otherCipherLetter} now maps to ${otherGuess}.`,
  announceDisplaced: (cipherLetter: string, guess: string, displacedGuess: string) =>
    `${cipherLetter} now maps to ${guess}. ${displacedGuess} returned to unassigned.`,
  announceUnassigned: (guess: string) => `${guess} returned to unassigned.`,
  announceReset: 'All mappings cleared.',
  announceAssignAll: 'Remaining letters assigned.',
  announceShift: (n: number) => `Shift set to ${n}.`,
  announceSortOriginals: (order: string) => `Ciphertext letters sorted ${order}.`,
  announceSortBank: (order: string) => `Unassigned letters sorted ${order}.`,
  announceMessageChanged: (title: string) => `Message changed to ${title}.`,
  announceCustomMessageAdded: 'Custom message added and selected.',

  orderAlphabetically: 'alphabetically',
  orderByFrequency: 'by frequency',
  orderRandomly: 'randomly',
};
