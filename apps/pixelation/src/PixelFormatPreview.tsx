import Typography from '@code-dot-org/component-library/typography';
import type {ReactNode} from 'react';

import {copy} from './copy';
import type {DisplayMode} from './pixelCodec';

export interface PixelFormatPreviewProps {
  bitsPerPixel: number;
  mode: DisplayMode;
}

/**
 * Shows how one pixel's bits break down: split evenly across red/green/blue
 * when bitsPerPixel divides by 3, one greyscale value otherwise, or
 * "unknown" when hex mode can't cleanly show the chunk (not a multiple of a
 * nibble). Purely descriptive — the visible swatch is `aria-hidden`, and the
 * sentence next to it is the real accessible content.
 */
export default function PixelFormatPreview({bitsPerPixel, mode}: PixelFormatPreviewProps) {
  const bitsPerChannel = Math.floor(bitsPerPixel / 3);
  const isHexAligned = bitsPerPixel % 4 === 0;
  const glyph = mode === 'hex' ? 'F' : '1';

  let description: string;
  let visual: ReactNode;

  if (bitsPerPixel === 0) {
    description = copy.pixelFormat.zero;
    visual = <span className="pxFormatUnknown">?</span>;
  } else if (mode === 'hex' && !isHexAligned) {
    description = copy.pixelFormat.unknown;
    visual = <span className="pxFormatUnknown">{'-'.repeat(Math.ceil(bitsPerPixel / 4))}</span>;
  } else if (bitsPerChannel * 3 === bitsPerPixel) {
    const digits = mode === 'hex' ? bitsPerChannel / 4 : bitsPerChannel;
    description = copy.pixelFormat.rgb(bitsPerChannel);
    visual = (
      <>
        <span className="pxFormatR">{glyph.repeat(digits)}</span>
        <span className="pxFormatG">{glyph.repeat(digits)}</span>
        <span className="pxFormatB">{glyph.repeat(digits)}</span>
      </>
    );
  } else {
    const digits = mode === 'hex' ? bitsPerPixel / 4 : bitsPerPixel;
    description = copy.pixelFormat.greyscale(bitsPerPixel);
    visual = <span>{glyph.repeat(digits)}</span>;
  }

  return (
    <div className="pxFormat">
      <Typography semanticTag="span" visualAppearance="body-three">
        {copy.pixelFormat.label}:
      </Typography>
      <span className="pxFormatSwatch" aria-hidden="true">
        {visual}
      </span>
      <Typography semanticTag="span" visualAppearance="body-three">
        {description}
      </Typography>
    </div>
  );
}
