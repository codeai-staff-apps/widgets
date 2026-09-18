import Button from '@code-dot-org/component-library/button';
import Checkbox from '@code-dot-org/component-library/checkbox';
import {useEffect, useRef} from 'react';

import {copy} from './copy';
import {useAnnounce} from './shared';

export const CANVAS_SIZE = 400;

/**
 * Signals "the data ran out before the image did" — a pixel the payload
 * doesn't have a value for. Uses the DS's own error token rather than a
 * hardcoded color, but is intentionally distinct from any real decoded
 * pixel color (which is why it isn't itself a design-system concept).
 */
const MISSING_PIXEL_VAR = '--background-error-light';
const MISSING_PIXEL_FALLBACK = '#f6c9c9';

interface Scale {
  squareSize: number;
  fillSize: number;
  offset: number;
}

function computeScale(width: number, height: number, actualSize: boolean): Scale {
  if (actualSize) {
    return {squareSize: 1, fillSize: 1, offset: 0};
  }
  const squareSize = CANVAS_SIZE / Math.max(width, height);
  let fillSize = squareSize * 0.95;
  let offset = (squareSize - fillSize) / 2;
  if (squareSize - fillSize < 0.33) {
    // Too thin a gap to render as a visible gridline; fill the whole square instead.
    fillSize += 1;
    offset = 0;
  }
  return {squareSize, fillSize, offset};
}

function paintPixels(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: string[],
  missingColor: string,
  scale: Scale,
  left: number,
  top: number,
) {
  const {squareSize, fillSize, offset} = scale;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      ctx.fillStyle = colors[y * width + x] || missingColor;
      ctx.fillRect(left + x * squareSize + offset, top + y * squareSize + offset, fillSize, fillSize);
    }
  }
}

export interface PixelCanvasProps {
  width: number;
  height: number;
  bitsPerPixel: number;
  colors: string[];
  actualSize: boolean;
  onActualSizeChange: (actualSize: boolean) => void;
}

export default function PixelCanvas({
  width,
  height,
  bitsPerPixel,
  colors,
  actualSize,
  onActualSizeChange,
}: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const announce = useAnnounce();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      return;
    }
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    const scale = computeScale(width, height, actualSize);
    const left = Math.floor((CANVAS_SIZE - width * scale.squareSize) / 2);
    const top = Math.floor((CANVAS_SIZE - height * scale.squareSize) / 2);
    const missingColor =
      getComputedStyle(canvas).getPropertyValue(MISSING_PIXEL_VAR).trim() || MISSING_PIXEL_FALLBACK;
    paintPixels(ctx, width, height, colors, missingColor, scale, left, top);
  }, [width, height, colors, actualSize]);

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const scale = computeScale(width, height, actualSize);
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = Math.max(1, Math.round(width * scale.squareSize));
    exportCanvas.height = Math.max(1, Math.round(height * scale.squareSize));
    const exportCtx = exportCanvas.getContext('2d');
    if (!exportCtx) {
      return;
    }
    const missingColor =
      getComputedStyle(canvas).getPropertyValue(MISSING_PIXEL_VAR).trim() || MISSING_PIXEL_FALLBACK;
    paintPixels(exportCtx, width, height, colors, missingColor, scale, 0, 0);

    const link = document.createElement('a');
    link.href = exportCanvas.toDataURL('image/png');
    link.download = 'pixelation.png';
    link.click();
    announce(copy.announce.imageSaved);
  };

  return (
    <div className="pxCanvasColumn">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="pxCanvas"
        role="img"
        aria-label={copy.canvasLabel(
          width,
          height,
          bitsPerPixel,
          Math.max(0, width * height - colors.length),
        )}
      />
      <div className="pxCanvasControls">
        <Checkbox
          name="px-actual-size"
          label={copy.controls.actualSize}
          checked={actualSize}
          onChange={e => onActualSizeChange(e.target.checked)}
        />
        <Button text={copy.controls.saveImage} type="secondary" onClick={handleSave} />
      </div>
    </div>
  );
}
