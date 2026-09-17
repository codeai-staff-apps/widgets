/**
 * All user-facing strings, collected here so a future translation pass is
 * mechanical.
 */
export const copy = {
  title: 'Text Compression',
  intro: [
    'Dictionary compression works by finding a pattern — a repeated word or ' +
      'phrase — and replacing every copy of it with one short symbol. Do that ' +
      'enough times and the text shrinks, but the dictionary you have to keep ' +
      'alongside it (to say what each symbol means) costs bytes too.',
    'Look for a repeated pattern in the text below, then type it into a ' +
      'pattern box in the dictionary. Every place that pattern appears gets ' +
      'replaced by its symbol, and the sizes below update to show whether it ' +
      'was worth it.',
  ],
  spacesNote:
    'Spaces in the text are shown as underscores ( _ ) so every character, not just letters, can be part of a pattern.',
  textPicker: {
    label: 'Choose text',
    writeYourOwn: 'Write your own…',
    customOptionPrefix: 'Custom: ',
  },
  customText: {
    heading: 'Write your own text',
    fieldLabel: 'Your text',
    placeholder: 'Write or paste your text here.',
    cancel: 'Cancel',
    use: 'Use this text',
    tooShort: 'Type something before using it.',
  },
  compressed: {
    heading: 'Compressed text',
    symbolAria: (entryNumber: number, pattern: string) => `Symbol ${entryNumber}, short for “${pattern}”`,
  },
  dictionary: {
    heading: 'Dictionary',
    patternLabel: (entryNumber: number) => `Pattern ${entryNumber}`,
    symbolLabel: (entryNumber: number) => `Symbol ${entryNumber}`,
    removeLabel: (entryNumber: number) => `Remove pattern ${entryNumber}`,
    addPattern: 'Add another pattern',
    maxReached: (max: number) => `Maximum of ${max} patterns reached.`,
    patternError: 'This pattern can’t contain a dictionary symbol character.',
    dictionaryErrorAlert:
      'One or more patterns contain a reserved symbol character. Fix the highlighted pattern to see compression stats.',
  },
  stats: {
    heading: 'Sizes',
    compressedSize: 'Compressed text size',
    dictionarySize: 'Dictionary size',
    totalSize: 'Total size',
    originalSize: 'Original text size',
    compression: 'Compression',
    bytes: (n: number) => `${n} bytes`,
    errorInDictionary: 'Error in dictionary',
    percentSmaller: (percent: number) => `${percent}% smaller`,
    percentLarger: (percent: number) => `${Math.abs(percent)}% larger`,
    percentNoChange: 'No change',
    announceSmaller: (percent: number, total: number, original: number) =>
      `Compression: ${percent}% smaller, ${total} bytes instead of ${original}.`,
    announceLarger: (percent: number, total: number, original: number) =>
      `Compression: ${Math.abs(percent)}% larger, ${total} bytes instead of ${original}.`,
    announceNoChange: (total: number) => `Compression: no change, still ${total} bytes.`,
  },
};
