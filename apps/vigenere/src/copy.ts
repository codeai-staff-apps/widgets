import type {CipherMode} from './cipher';

/**
 * All user-facing strings, collected here so a future translation pass is
 * mechanical. `SPACE_LETTER` (an underscore standing in for a space) is
 * shown to people as-is, matching what the widget actually ciphers.
 */
export const copy = {
  title: 'Vigenère Cipher',
  intro: [
    'A Vigenère cipher shifts each letter of a message by an amount that ' +
      "depends on a keyword — repeated for as long as the message runs — instead of shifting every letter by the same amount.",
    'Type a message and a keyword, then step through the cipher one letter ' +
      'at a time to see how each keyword letter picks that step’s shift.',
  ],

  form: {
    messageLabel: (mode: CipherMode) =>
      mode === 'encrypt' ? 'Plaintext message' : 'Ciphertext message',
    messageHelp: 'Letters and spaces only — anything else is dropped before ciphering.',
    keywordLabel: 'Keyword',
    keywordHelp: 'Repeats for as long as the message needs.',
    keywordEmptyError: 'Enter a keyword to cipher with.',
    modeLegend: 'Direction',
    encrypt: 'Encrypt',
    decrypt: 'Decrypt',
  },

  controls: {
    legend: 'Playback',
    restart: 'Restart',
    play: 'Play',
    pause: 'Pause',
    step: 'Step',
    fastForward: 'Skip to end',
    speedLabel: 'Speed',
    speedSlow: 'Slow',
    speedFast: 'Fast',
  },

  result: {
    heading: 'Result',
    keywordTrackLabel: 'Keyword, repeating',
    sourceLabel: (mode: CipherMode) => (mode === 'encrypt' ? 'Plaintext' : 'Ciphertext'),
    resultLabel: (mode: CipherMode) => (mode === 'encrypt' ? 'Ciphertext' : 'Plaintext'),
    empty: '—',
  },

  breakdown: {
    heading: 'Letter-by-letter',
    empty: 'Play or step through the cipher to see each letter worked out here.',
    term: (position: number, sourceChar: string, keyChar: string) =>
      `${position}. ${sourceChar} × keyword letter ${keyChar}`,
    definition: (shift: number, resultChar: string) => `shift ${shift} → ${resultChar}`,
  },

  table: {
    heading: 'Vigenère square',
    description:
      'Row = keyword letter, column = plaintext letter, cell = ciphertext letter. ' +
      'The highlighted path shows the current step’s lookup.',
  },

  announce: {
    restarted: 'Restarted.',
    progress: (mode: CipherMode, revealed: number, total: number, resultSoFar: string) =>
      `${mode === 'encrypt' ? 'Encrypting' : 'Decrypting'}: ${revealed} of ${total} letters. ` +
      `Result so far: ${resultSoFar || copy.result.empty}.`,
    complete: (mode: CipherMode, result: string) =>
      `${mode === 'encrypt' ? 'Encryption' : 'Decryption'} complete. Result: ${result || copy.result.empty}.`,
  },
};
