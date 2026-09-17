/**
 * The encoding this widget teaches: a flat bit string that is, in order,
 * a width byte, a height byte, a bits-per-pixel byte, then width*height
 * pixels of bitsPerPixel bits each. Every function here is pure so the
 * header <-> pixel-grid relationship (the widget's whole point) can be
 * unit-tested without React or a canvas.
 *
 * `rawBits` is always canonical binary ('0'/'1' only, no whitespace).
 * Hexadecimal is only ever a *display* encoding of the same bits — see
 * `formatDisplay` / `parseDisplay`.
 */

export const HEADER_BYTES = 3; // width, height, bitsPerPixel
export const HEADER_BITS = HEADER_BYTES * 8;
export const MIN_DIMENSION = 1;
export const MAX_DIMENSION = 255; // one byte
export const MIN_BITS_PER_PIXEL = 1;
export const MAX_BITS_PER_PIXEL = 24; // 8 bits/channel x R,G,B

export interface DecodedImage {
  width: number;
  height: number;
  /** As read from the header byte, which can be 0 (see `bitsToColors`). */
  bitsPerPixel: number;
  /** Bits after the 3 header bytes. May be shorter or longer than width*height*bitsPerPixel. */
  payloadBits: string;
}

/** Pads `str` with leading `prefix` until it reaches `len`. */
function pad(str: string, len: number, prefix: string): string {
  return str.length >= len ? str : pad(prefix + str, len, prefix);
}

export function intToBin(value: number, bits: number): string {
  return pad(Math.max(0, Math.trunc(value)).toString(2), bits, '0').slice(-bits);
}

export function binToInt(bits: string): number {
  return bits.length ? parseInt(bits, 2) || 0 : 0;
}

export function hexToBin(hex: string): string {
  return [...hex].map(digit => intToBin(parseInt(digit, 16) || 0, 4)).join('');
}

export function binToHex(bin: string): string {
  let allBits = bin;
  while (allBits.length % 4 !== 0) {
    allBits += '0'; // half-byte-align, matching how a hex digit can't represent a partial nibble
  }
  let hex = '';
  for (let i = 0; i < allBits.length; i += 4) {
    hex += parseInt(allBits.slice(i, i + 4), 2).toString(16).toUpperCase();
  }
  return hex;
}

/** Clamps a value the way a slider/number control does: at least `min` (default 1), whole number. */
export function clampPositive(value: number, min = 1, max = Infinity): number {
  const whole = Math.trunc(value);
  if (!Number.isFinite(whole) || whole < min) {
    return min;
  }
  return Math.min(whole, max);
}

export function encodeHeader(width: number, height: number, bitsPerPixel: number): string {
  return intToBin(width, 8) + intToBin(height, 8) + intToBin(bitsPerPixel, 8);
}

/** Splits a canonical bit string into its header fields and the pixel payload that follows. */
export function decode(rawBits: string): DecodedImage {
  return {
    width: binToInt(rawBits.slice(0, 8)) || MIN_DIMENSION,
    height: binToInt(rawBits.slice(8, 16)) || MIN_DIMENSION,
    // Deliberately NOT defaulted to 1: a bitsPerPixel byte of 0 is a real,
    // undecodable state (see bitsToColors) and is how this widget shows what
    // happens when a piece of the format's metadata is missing or wrong.
    bitsPerPixel: binToInt(rawBits.slice(16, 24)),
    payloadBits: rawBits.slice(HEADER_BITS),
  };
}

/**
 * If bitsPerPixel isn't divisible by 3, each pixel is one greyscale channel
 * (can't split evenly across R/G/B). Otherwise each third of the bits is one
 * channel. A bitsPerPixel of 0 can't decode anything (see bitsToColors).
 */
export function getColorForBits(bits: string, bitsPerPixel: number): string {
  const numColors = 2 ** bitsPerPixel;
  const bitsPerChannel = Math.floor(bitsPerPixel / 3);

  if (bitsPerChannel * 3 !== bitsPerPixel) {
    const value = Math.trunc((binToInt(bits) / (numColors - 1)) * 255);
    return `rgb(${value}, ${value}, ${value})`;
  }

  const maxChannelValue = Math.max(2 ** bitsPerChannel - 1, 1);
  const channel = (offset: number) =>
    Math.trunc((binToInt(bits.slice(offset, offset + bitsPerChannel)) / maxChannelValue) * 255);

  return `rgb(${channel(0)}, ${channel(bitsPerChannel)}, ${channel(bitsPerChannel * 2)})`;
}

/**
 * Reads the payload in bitsPerPixel-sized chunks and returns one CSS color
 * per pixel. A bitsPerPixel of 0 can't decode anything — every pixel goes
 * missing, same as a genuinely truncated file. A trailing partial chunk
 * (not enough bits for one more full pixel) is dropped.
 */
export function bitsToColors(payloadBits: string, bitsPerPixel: number): string[] {
  if (!bitsPerPixel) {
    return [];
  }
  const colors: string[] = [];
  for (let i = 0; i < payloadBits.length; i += bitsPerPixel) {
    colors.push(getColorForBits(payloadBits.slice(i, i + bitsPerPixel), bitsPerPixel));
  }
  if (payloadBits.length % bitsPerPixel !== 0) {
    colors.pop();
  }
  return colors;
}

export type DisplayMode = 'binary' | 'hex';

/**
 * Renders the canonical bits as text a student edits: the 3 header bytes
 * each on their own line, then the pixel payload chunked into `width`
 * pixels per line — so each printed line of data *is* one row of the
 * image, making the width/layout connection visible in the text itself.
 * Falls back to an unbroken hex string when bitsPerPixel isn't a multiple
 * of 4 (a hex digit can't represent a partial nibble).
 */
export function formatDisplay(
  rawBits: string,
  width: number,
  bitsPerPixel: number,
  mode: DisplayMode,
): string {
  const header = rawBits.slice(0, HEADER_BITS);
  const payload = rawBits.slice(HEADER_BITS);
  const headerBytes = [header.slice(0, 8), header.slice(8, 16), header.slice(16, 24)];

  const headerLines =
    mode === 'hex'
      ? headerBytes.map(binToHex)
      : headerBytes.map(byte => `${byte.slice(0, 4)} ${byte.slice(4, 8)}`);
  let text = headerLines.join('\n') + '\n';

  const chunkBits = bitsPerPixel || 1;
  if (mode === 'hex' && chunkBits % 4 !== 0) {
    // Can't cleanly break a non-nibble-aligned pixel into hex digits.
    return text + binToHex(payload);
  }
  const chunked = mode === 'hex' ? binToHex(payload) : payload;
  const chunkSize = mode === 'hex' ? chunkBits / 4 : chunkBits;

  let column = 0;
  for (let i = 0; i < chunked.length; i += chunkSize) {
    text += chunked.slice(i, i + chunkSize) + ' ';
    column++;
    if (column === width) {
      text += '\n';
      column = 0;
    }
  }
  return text;
}

/** Strips everything but the meaningful characters for `mode`, e.g. as the student types. */
export function filterDisplayInput(text: string, mode: DisplayMode): string {
  return mode === 'hex' ? text.replace(/[^0-9A-Fa-f \n]/g, '') : text.replace(/[^01 \n]/g, '');
}

/** Converts displayed text (formatted or not, in either mode) back to canonical bits. */
export function parseDisplay(text: string, mode: DisplayMode): string {
  const stripped = mode === 'hex' ? text.replace(/[^0-9A-Fa-f]/g, '') : text.replace(/[^01]/g, '');
  return mode === 'hex' ? hexToBin(stripped) : stripped;
}

/** Removes formatting whitespace only, keeping whichever mode's characters are present. */
export function unformatDisplay(text: string): string {
  return text.replace(/[ \n]/g, '');
}

/**
 * Rewrites the header (width/height/bitsPerPixel) while keeping the existing
 * pixel payload, then re-renders as formatted display text. This is how the
 * sliders and number fields edit the same underlying bit string that the
 * textarea shows.
 */
export function withHeader(
  currentText: string,
  mode: DisplayMode,
  width: number,
  height: number,
  bitsPerPixel: number,
): string {
  const payloadBits = decode(parseDisplay(currentText, mode)).payloadBits;
  const rawBits = encodeHeader(width, height, bitsPerPixel) + payloadBits;
  return formatDisplay(rawBits, width, bitsPerPixel, mode);
}
