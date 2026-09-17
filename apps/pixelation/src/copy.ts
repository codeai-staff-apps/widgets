/**
 * All user-facing strings, collected here so a future translation pass is
 * mechanical.
 */
export const copy = {
  title: 'Pixelation',
  intro: [
    'Every digital image is really just a list of numbers. This widget shows ' +
      'the same underlying idea behind any image format: a stream of color ' +
      'values, plus a bit of metadata that says how wide the image is, is all ' +
      'it takes to turn a flat list of numbers into a picture.',
    'Change the width, height, or color depth below and watch both the ' +
      'picture and its raw encoding change together. Then try editing the raw ' +
      'data yourself — every value you type is a pixel.',
  ],
  sections: {
    sample: 'Start from',
    dimensions: 'Image dimensions',
    colorDepth: 'Color depth',
    encoding: 'Raw data',
    fileFormat: 'How the file is encoded',
  },
  sampleLabel: 'Sample image',
  controls: {
    width: 'Width (pixels)',
    widthSlider: 'Width (pixels), slider',
    height: 'Height (pixels)',
    heightSlider: 'Height (pixels), slider',
    bitsPerPixel: 'Bits per pixel',
    bitsPerPixelSlider: 'Bits per pixel, slider',
    bitsPerPixelHelp:
      'More bits per pixel means more possible colors, at the cost of a bigger file.',
    binary: 'Binary',
    hexadecimal: 'Hexadecimal',
    encodingGroupLabel: 'Show raw data as',
    pixelData: 'Pixel data',
    pixelDataHelp:
      'The first 3 bytes are the width, height, and bits-per-pixel header; ' +
      'everything after that is pixel color data, one chunk per pixel.',
    readableFormat: 'Readable format',
    readableFormatHelp: 'Break the raw data into one pixel per chunk, one image row per line.',
    rawFormat: 'Raw format',
    rawFormatHelp: 'Show the raw data with no added spacing.',
    actualSize: 'Actual size',
    saveImage: 'Save image',
    reset: 'Reset',
  },
  pixelFormat: {
    label: 'Pixel format',
    zero: '0 bits per pixel — no color can be decoded; every pixel is missing data.',
    // "unknown" shows when the bits-per-pixel can't split into whole hex digits.
    unknown: 'Unknown — this many bits per pixel cannot be shown as whole hex digits.',
    greyscale: (bits: number) => `${bits} greyscale bits per pixel.`,
    rgb: (bitsPerChannel: number) =>
      `${bitsPerChannel} bits each for red, green, and blue.`,
  },
  fileFormat: {
    intro:
      'Every image in this widget is encoded the same way: three header ' +
      'bytes, then the pixel data.',
    width: 'Width — 1 byte',
    height: 'Height — 1 byte',
    bitsPerPixel: 'Bits per pixel — 1 byte',
    data: 'n bits of pixel data',
    dataFormula: 'n = width × height × bits per pixel',
  },
  canvasLabel: (width: number, height: number, bitsPerPixel: number) =>
    `Rendered image, ${width} by ${height} pixels, ${bitsPerPixel} bits per pixel.`,
  missingDataLabel: 'shown in pink where the raw data runs out before the image does',
  announce: {
    dimensions: (width: number, height: number, bitsPerPixel: number) =>
      `Image resized to ${width} by ${height} pixels, ${bitsPerPixel} bits per pixel.`,
    encodingMode: (mode: string) => `Raw data now shown as ${mode}.`,
    reset: 'Reset to the starting image.',
    imageSaved: 'Image saved.',
    sampleLoaded: (label: string) => `Loaded sample: ${label}.`,
  },
  saveImageWindowTitle: 'Pixelation image',
};
