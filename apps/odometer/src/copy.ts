/**
 * All user-facing strings, collected here so a future translation pass is
 * mechanical. Numeral digits (0-9, A-Z) are not included: arbitrary-radix
 * digit strings have no locale-aware representation.
 */
export const copy = {
  title: 'Odometer',
  intro: [
    'This widget shows one shared number as five odometers, each counting ' +
      'in a different base. Binary, decimal and hexadecimal are the number ' +
      'systems you will see most often in computer science.',
    'Set a value, then predict what one more — or one less — will look ' +
      'like in each base before you check.',
  ],
  rowLabels: {
    binary: 'Binary',
    octal: 'Octal',
    decimal: 'Decimal',
    hexadecimal: 'Hexadecimal',
    custom: 'Custom base',
  },
  overflowBadge: 'Overflow!',
  overflowAriaSuffix: ' — overflowing, this row needs more digits than it has',
  overflowAnnounce: (label: string) => `${label} is overflowing.`,
  overflowClearAnnounce: (label: string) => `${label} is back in range.`,
  resetAnnounce: 'Value reset to 0.',
  // dnd-kit supplies its own screen-reader instructions for how to operate
  // the handle (its default `accessibility.screenReaderInstructions`), so
  // this only needs to state which row and where it currently sits.
  reorderHandleLabel: (label: string, position: number, total: number) =>
    `Reorder ${label} row, position ${position} of ${total}.`,
  reorderAnnounce: (label: string, position: number, total: number) =>
    `${label} moved to position ${position} of ${total}.`,
  reorderHelp: 'Drag a row, or focus its handle and press Space then the arrow keys, to reorder.',
  controls: {
    start: 'Start',
    pause: 'Pause',
    reset: 'Reset',
    speedLabel: 'Speed',
    speedSlow: 'Slow',
    speedFast: 'Fast',
    valueLabel: 'Value',
    valueSliderLabel: 'Value (slider)',
    customBaseLabel: 'Custom base',
    customBaseHelp: 'Any base from 2 to 36. Bases above 10 use letters A-Z for the extra digits.',
  },
};
