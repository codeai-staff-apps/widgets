import Button from '@code-dot-org/component-library/button';
import FormFieldWrapper from '@code-dot-org/component-library/formFieldWrapper';
import SegmentedButtons from '@code-dot-org/component-library/segmentedButtons';
import Slider from '@code-dot-org/component-library/slider';
import TextField from '@code-dot-org/component-library/textField';
import Typography from '@code-dot-org/component-library/typography';
import {useState} from 'react';

import {copy} from './copy';
import {
  bitsToColors,
  clampPositive,
  decode,
  filterDisplayInput,
  formatDisplay,
  MAX_BITS_PER_PIXEL,
  MAX_DIMENSION,
  MIN_BITS_PER_PIXEL,
  MIN_DIMENSION,
  parseDisplay,
  unformatDisplay,
  withHeader,
  type DisplayMode,
} from './pixelCodec';
import PixelCanvas from './PixelCanvas';
import PixelFormatPreview from './PixelFormatPreview';
import './pixelation.css';
import {DEFAULT_SAMPLE, SAMPLES} from './sampleData';
import {useAnnounce} from './shared';

const MODE_BUTTONS = [
  {value: 'binary', label: copy.controls.binary},
  {value: 'hex', label: copy.controls.hexadecimal},
];

export default function App() {
  const announce = useAnnounce();
  const [selectedSampleId, setSelectedSampleId] = useState(DEFAULT_SAMPLE.id);
  const [mode, setMode] = useState<DisplayMode>('binary');
  const [text, setText] = useState(() =>
    formatDisplay(DEFAULT_SAMPLE.rawBits, DEFAULT_SAMPLE.width, DEFAULT_SAMPLE.bitsPerPixel, 'binary'),
  );
  const [actualSize, setActualSize] = useState(false);

  const decoded = decode(parseDisplay(text, mode));
  const {width, height, bitsPerPixel, payloadBits} = decoded;
  const colors = bitsToColors(payloadBits, bitsPerPixel);

  // The controls' own clamped values — used as the "other two" fields
  // whenever one control rewrites the header, so touching any one of the
  // three also snaps the other two back into a valid range.
  const controlWidth = clampPositive(width, MIN_DIMENSION, MAX_DIMENSION);
  const controlHeight = clampPositive(height, MIN_DIMENSION, MAX_DIMENSION);
  const controlBitsPerPixel = clampPositive(bitsPerPixel, MIN_BITS_PER_PIXEL, MAX_BITS_PER_PIXEL);

  function applyHeader(newWidth: number, newHeight: number, newBitsPerPixel: number) {
    setText(withHeader(text, mode, newWidth, newHeight, newBitsPerPixel));
    announce(copy.announce.dimensions(newWidth, newHeight, newBitsPerPixel));
  }

  function handleWidthChange(value: number) {
    applyHeader(clampPositive(value, MIN_DIMENSION, MAX_DIMENSION), controlHeight, controlBitsPerPixel);
  }
  function handleHeightChange(value: number) {
    applyHeader(controlWidth, clampPositive(value, MIN_DIMENSION, MAX_DIMENSION), controlBitsPerPixel);
  }
  function handleBitsPerPixelChange(value: number) {
    applyHeader(controlWidth, controlHeight, clampPositive(value, MIN_BITS_PER_PIXEL, MAX_BITS_PER_PIXEL));
  }

  function handleModeChange(nextMode: string) {
    if (nextMode !== 'binary' && nextMode !== 'hex') {
      return;
    }
    if (nextMode === mode) {
      return;
    }
    const bits = parseDisplay(text, mode);
    setMode(nextMode);
    setText(formatDisplay(bits, width, bitsPerPixel, nextMode));
    announce(
      copy.announce.encodingMode(nextMode === 'hex' ? copy.controls.hexadecimal : copy.controls.binary),
    );
  }

  function handleTextInput(value: string) {
    setText(filterDisplayInput(value, mode));
  }

  function handleReadableFormat() {
    setText(formatDisplay(parseDisplay(text, mode), width, bitsPerPixel, mode));
  }

  function handleRawFormat() {
    setText(unformatDisplay(text));
  }

  function loadSample(sampleId: string) {
    const sample = SAMPLES.find(s => s.id === sampleId) ?? DEFAULT_SAMPLE;
    setSelectedSampleId(sample.id);
    setText(formatDisplay(sample.rawBits, sample.width, sample.bitsPerPixel, mode));
    announce(copy.announce.sampleLoaded(sample.label));
  }

  function handleReset() {
    const sample = SAMPLES.find(s => s.id === selectedSampleId) ?? DEFAULT_SAMPLE;
    setText(formatDisplay(sample.rawBits, sample.width, sample.bitsPerPixel, mode));
    announce(copy.announce.reset);
  }

  return (
    <main className="pxPage">
      <div className="pxIntro">
        <Typography semanticTag="h1" visualAppearance="heading-lg">
          {copy.title}
        </Typography>
        {copy.intro.map(paragraph => (
          <Typography key={paragraph} semanticTag="p" visualAppearance="body-two">
            {paragraph}
          </Typography>
        ))}
      </div>

      <div className="pxSection">
        <Typography semanticTag="h2" visualAppearance="heading-sm">
          {copy.sections.sample}
        </Typography>
        <div className="pxSampleRow" role="group" aria-label={copy.sampleLabel}>
          <SegmentedButtons
            selectedButtonValue={selectedSampleId}
            onChange={loadSample}
            buttons={SAMPLES.map(sample => ({value: sample.id, label: sample.label}))}
          />
        </div>
      </div>

      <div className="pxLayout">
        <div className="pxSection">
          <Typography semanticTag="h2" visualAppearance="heading-sm">
            {copy.sections.dimensions}
          </Typography>
          <div className="pxSliderRow">
            <TextField
              name="px-width"
              inputType="number"
              label={copy.controls.width}
              value={controlWidth}
              min={MIN_DIMENSION}
              max={MAX_DIMENSION}
              onChange={e => handleWidthChange(parseInt(e.target.value, 10))}
            />
            <Slider
              name="px-width-slider"
              label={copy.controls.widthSlider}
              hideValue
              color="brand"
              minValue={MIN_DIMENSION}
              maxValue={MAX_DIMENSION}
              value={controlWidth}
              onChange={e => handleWidthChange(Number(e.target.value))}
            />
          </div>
          <div className="pxSliderRow">
            <TextField
              name="px-height"
              inputType="number"
              label={copy.controls.height}
              value={controlHeight}
              min={MIN_DIMENSION}
              max={MAX_DIMENSION}
              onChange={e => handleHeightChange(parseInt(e.target.value, 10))}
            />
            <Slider
              name="px-height-slider"
              label={copy.controls.heightSlider}
              hideValue
              color="brand"
              minValue={MIN_DIMENSION}
              maxValue={MAX_DIMENSION}
              value={controlHeight}
              onChange={e => handleHeightChange(Number(e.target.value))}
            />
          </div>

          <Typography semanticTag="h2" visualAppearance="heading-sm">
            {copy.sections.colorDepth}
          </Typography>
          <div className="pxSliderRow">
            <TextField
              name="px-bpp"
              inputType="number"
              label={copy.controls.bitsPerPixel}
              value={controlBitsPerPixel}
              min={MIN_BITS_PER_PIXEL}
              max={MAX_BITS_PER_PIXEL}
              aria-describedby="px-bpp-help"
              onChange={e => handleBitsPerPixelChange(parseInt(e.target.value, 10))}
            />
            <Slider
              name="px-bpp-slider"
              label={copy.controls.bitsPerPixelSlider}
              hideValue
              color="brand"
              minValue={MIN_BITS_PER_PIXEL}
              maxValue={MAX_BITS_PER_PIXEL}
              value={controlBitsPerPixel}
              onChange={e => handleBitsPerPixelChange(Number(e.target.value))}
            />
          </div>
          <Typography semanticTag="p" visualAppearance="body-three" id="px-bpp-help">
            {copy.controls.bitsPerPixelHelp}
          </Typography>

          <PixelFormatPreview bitsPerPixel={bitsPerPixel} mode={mode} />
        </div>

        <div className="pxSection">
          <PixelCanvas
            width={width}
            height={height}
            bitsPerPixel={bitsPerPixel}
            colors={colors}
            actualSize={actualSize}
            onActualSizeChange={setActualSize}
          />
        </div>
      </div>

      <div className="pxSection">
        <div className="pxEncodingHeader">
          <Typography semanticTag="h2" visualAppearance="heading-sm">
            {copy.sections.encoding}
          </Typography>
          <div role="group" aria-label={copy.controls.encodingGroupLabel}>
            <SegmentedButtons
              selectedButtonValue={mode}
              onChange={handleModeChange}
              buttons={MODE_BUTTONS}
            />
          </div>
        </div>

        <FormFieldWrapper label={copy.controls.pixelData} helperMessage={copy.controls.pixelDataHelp}>
          <textarea
            className="pxTextarea"
            value={text}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            onChange={e => handleTextInput(e.target.value)}
          />
        </FormFieldWrapper>

        <div className="pxFormatButtons">
          <Button
            text={copy.controls.readableFormat}
            type="tertiary"
            color="black"
            onClick={handleReadableFormat}
            title={copy.controls.readableFormatHelp}
          />
          <Button
            text={copy.controls.rawFormat}
            type="tertiary"
            color="black"
            onClick={handleRawFormat}
            title={copy.controls.rawFormatHelp}
          />
        </div>
      </div>

      <div className="pxSection">
        <Typography semanticTag="h2" visualAppearance="heading-sm">
          {copy.sections.fileFormat}
        </Typography>
        <Typography semanticTag="p" visualAppearance="body-three">
          {copy.fileFormat.intro}
        </Typography>
        <div className="pxLegend">
          <span className="pxLegendByte">{copy.fileFormat.width}</span>
          <span className="pxLegendByte">{copy.fileFormat.height}</span>
          <span className="pxLegendByte">{copy.fileFormat.bitsPerPixel}</span>
          <Typography semanticTag="p" visualAppearance="body-three" noMargin>
            {copy.fileFormat.data}
          </Typography>
          <Typography semanticTag="p" visualAppearance="body-four" noMargin>
            {copy.fileFormat.dataFormula}
          </Typography>
        </div>
      </div>

      <div className="pxActions">
        <Button text={copy.controls.reset} type="tertiary" color="black" onClick={handleReset} />
      </div>
    </main>
  );
}
