import {encodeHeader, intToBin} from './pixelCodec';

type Channel = [r: number, g: number, b: number];

/** Encodes one raw per-channel value (0..2^bitsPerChannel - 1) into that many bits. */
function encodePixels(pixels: Channel[], bitsPerChannel: number): string {
  return pixels
    .map(([r, g, b]) =>
      [r, g, b].map(value => intToBin(value, bitsPerChannel)).join(''),
    )
    .join('');
}

/** Turns rows of a legend ('.' | glyph) into one Channel per cell. */
function paintByLegend(rows: string[], legend: Record<string, Channel>): Channel[] {
  return rows.flatMap(row => [...row].map(glyph => legend[glyph]));
}

export interface Sample {
  id: string;
  label: string;
  width: number;
  height: number;
  bitsPerPixel: number;
  /** Canonical binary: header bytes followed by the pixel payload. */
  rawBits: string;
}

function makeSample(
  id: string,
  label: string,
  width: number,
  height: number,
  bitsPerChannel: number,
  pixels: Channel[],
): Sample {
  const bitsPerPixel = bitsPerChannel * 3;
  return {
    id,
    label,
    width,
    height,
    bitsPerPixel,
    rawBits: encodeHeader(width, height, bitsPerPixel) + encodePixels(pixels, bitsPerChannel),
  };
}

// 1 bit/channel = 8 possible colors: enough to draw a recognizable low-depth heart.
const HEART_ROWS = [
  '.RR..RR.',
  'RRRRRRRR',
  'RRRRRRRR',
  'RRRRRRRR',
  '.RRRRRR.',
  '..RRRR..',
  '...RR...',
  '........',
];
const heart = makeSample(
  'heart',
  'Heart (low color depth)',
  8,
  8,
  1,
  paintByLegend(HEART_ROWS, {'.': [1, 1, 1], R: [1, 0, 0]}),
);

// 8 bits/channel = true color: a smooth gradient a 1-bit image could never show.
function sunsetPixels(width: number, height: number): Channel[] {
  const pixels: Channel[] = [];
  for (let y = 0; y < height; y++) {
    const t = y / (height - 1);
    // Warm yellow at the top fading to deep purple at the bottom.
    const r = Math.round(255 - t * 90);
    const g = Math.round(200 - t * 180);
    const b = Math.round(80 + t * 120);
    for (let x = 0; x < width; x++) {
      pixels.push([r, g, b]);
    }
  }
  return pixels;
}
const sunset = makeSample('sunset', 'Sunset gradient (true color)', 12, 8, 8, sunsetPixels(12, 8));

// A small all-white starting point for building an image from scratch.
const blank = makeSample(
  'blank',
  'Blank canvas',
  4,
  4,
  1,
  new Array(16).fill([1, 1, 1] as Channel),
);

export const SAMPLES: Sample[] = [heart, sunset, blank];
export const DEFAULT_SAMPLE = heart;
