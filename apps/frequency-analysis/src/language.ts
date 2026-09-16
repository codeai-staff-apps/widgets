/**
 * The one language this tool ciphers over. Bundling letters, frequencies and
 * a display name into a single object means a future locale swap is one new
 * object and one import, not a hunt through the codebase (see `strings.ts`'s
 * `standardLanguage`).
 */
export const LANGUAGE = {
  code: 'en',
  name: 'English',
  letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  /**
   * Standard English letter frequencies (source: the original widget's
   * table, itself sourced from published English letter-frequency studies).
   */
  frequency: {
    A: 0.08167,
    B: 0.01492,
    C: 0.02782,
    D: 0.04253,
    E: 0.12702,
    F: 0.02228,
    G: 0.02015,
    H: 0.06094,
    I: 0.06966,
    J: 0.00153,
    K: 0.00772,
    L: 0.04025,
    M: 0.02406,
    N: 0.06749,
    O: 0.07507,
    P: 0.01929,
    Q: 0.00095,
    R: 0.05987,
    S: 0.06327,
    T: 0.09056,
    U: 0.02758,
    V: 0.00978,
    W: 0.02361,
    X: 0.0015,
    Y: 0.01974,
    Z: 0.00074,
  } as Readonly<Record<string, number>>,
};
