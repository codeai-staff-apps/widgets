import {describe, expect, it} from 'vitest';

import {
  binToHex,
  bitsToColors,
  decode,
  encodeHeader,
  filterDisplayInput,
  formatDisplay,
  getColorForBits,
  hexToBin,
  intToBin,
  parseDisplay,
  unformatDisplay,
  withHeader,
} from './pixelCodec';

describe('header <-> pixel grid round trip', () => {
  it('decodes width, height and bitsPerPixel back out of an encoded header', () => {
    const rawBits = encodeHeader(3, 2, 6) + '0'.repeat(3 * 2 * 6);
    const decoded = decode(rawBits);
    expect(decoded.width).toBe(3);
    expect(decoded.height).toBe(2);
    expect(decoded.bitsPerPixel).toBe(6);
    expect(decoded.payloadBits.length).toBe(36);
  });

  it('is the core teaching point: the same payload bits decode to a different grid under a different width', () => {
    // 6 pixels of 1 bit each: three "on" and three "off" pixels, order fixed.
    const payload = '111000';
    const wideImage = decode(encodeHeader(6, 1, 1) + payload);
    const narrowImage = decode(encodeHeader(2, 3, 1) + payload);
    expect(bitsToColors(wideImage.payloadBits, wideImage.bitsPerPixel)).toEqual(
      bitsToColors(narrowImage.payloadBits, narrowImage.bitsPerPixel),
    );
    // Same flat array of colors, but wideImage reads as 1 row of 6 and
    // narrowImage as 3 rows of 2 — the pixel data alone can't tell you which.
    expect(wideImage.width).not.toBe(narrowImage.width);
  });

  it('a bitsPerPixel of 0 decodes no pixels at all, not a divide-by-zero crash', () => {
    const rawBits = encodeHeader(2, 2, 0) + '00001111';
    const decoded = decode(rawBits);
    expect(decoded.bitsPerPixel).toBe(0);
    expect(bitsToColors(decoded.payloadBits, decoded.bitsPerPixel)).toEqual([]);
  });
});

describe('getColorForBits', () => {
  it('splits evenly into R/G/B when bitsPerPixel is a multiple of 3', () => {
    // 6 bits -> 2 bits/channel, max channel value 3. '11' '00' '01' -> full R, no G, 1/3 B.
    expect(getColorForBits('110001', 6)).toBe('rgb(255, 0, 85)');
  });

  it('falls back to greyscale when bitsPerPixel does not divide by 3', () => {
    // 4 bits, 15 possible values, '1111' is the max -> full white.
    expect(getColorForBits('1111', 4)).toBe('rgb(255, 255, 255)');
    expect(getColorForBits('0000', 4)).toBe('rgb(0, 0, 0)');
  });
});

describe('bitsToColors', () => {
  it('drops a trailing partial pixel instead of rendering a garbage color', () => {
    // 5 bits at 2 bits/pixel: 2 whole pixels + 1 leftover bit.
    expect(bitsToColors('11010', 2)).toHaveLength(2);
  });
});

describe('binary/hex are the same bits, only displayed differently', () => {
  it('round-trips through hex and back when nibble-aligned', () => {
    const bits = '101100101111000010100101'.slice(0, 24); // 24 bits = 6 whole nibbles
    expect(hexToBin(binToHex(bits))).toBe(bits);
  });

  it('pads hex output to a whole nibble', () => {
    expect(binToHex('101')).toBe('A'); // '101' -> '1010'
  });

  it('intToBin zero-pads to the requested width', () => {
    expect(intToBin(5, 8)).toBe('00000101');
    expect(intToBin(255, 8)).toBe('11111111');
  });
});

describe('formatDisplay / parseDisplay round trip', () => {
  it('formats one header byte per line, then width pixels per line, and parses back losslessly', () => {
    const rawBits = encodeHeader(2, 2, 4) + '0000111100001111'; // 2x2 image, 4 bits/pixel
    const text = formatDisplay(rawBits, 2, 4, 'binary');
    const lines = text.trim().split('\n');
    // 3 header lines + 2 rows of pixel data (width=2 chunks per line).
    expect(lines).toHaveLength(5);
    expect(parseDisplay(text, 'binary')).toBe(rawBits);
  });

  it('formats in hex when the mode is hex and still round-trips', () => {
    const rawBits = encodeHeader(2, 1, 8) + '0000000011111111';
    const text = formatDisplay(rawBits, 2, 8, 'hex');
    expect(parseDisplay(text, 'hex')).toBe(rawBits);
  });

  it('falls back to one unbroken hex string when bitsPerPixel is not a multiple of 4', () => {
    const rawBits = encodeHeader(1, 1, 6) + '000000';
    const text = formatDisplay(rawBits, 1, 6, 'hex');
    expect(text.split('\n')).toHaveLength(4); // 3 header lines, then the unbroken payload with no trailing line break
  });
});

describe('filterDisplayInput', () => {
  it('keeps only 0/1 and whitespace in binary mode', () => {
    expect(filterDisplayInput('01 1a0\n1', 'binary')).toBe('01 10\n1');
  });

  it('keeps only hex digits and whitespace in hex mode', () => {
    expect(filterDisplayInput('0F g1\n', 'hex')).toBe('0F 1\n');
  });
});

describe('unformatDisplay', () => {
  it('strips only spaces and newlines, not the data', () => {
    expect(unformatDisplay('01 10\n11 00\n')).toBe('01101100');
  });
});

describe('withHeader', () => {
  it('changes only the header, preserving the pixel payload', () => {
    const rawBits = encodeHeader(2, 2, 4) + '0000111100001111';
    const text = formatDisplay(rawBits, 2, 4, 'binary');
    const resized = withHeader(text, 'binary', 4, 1, 4);
    const decoded = decode(parseDisplay(resized, 'binary'));
    expect(decoded.width).toBe(4);
    expect(decoded.height).toBe(1);
    expect(decoded.payloadBits).toBe('0000111100001111');
  });
});
