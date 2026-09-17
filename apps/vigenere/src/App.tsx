import Button from '@code-dot-org/component-library/button';
import SegmentedButtons from '@code-dot-org/component-library/segmentedButtons';
import Slider from '@code-dot-org/component-library/slider';
import TextField from '@code-dot-org/component-library/textField';
import Typography from '@code-dot-org/component-library/typography';
import MuiTextField from '@mui/material/TextField';
import {useEffect, useMemo, useState} from 'react';

import type {CipherMode} from './cipher';
import {cleanText, computeSteps} from './cipher';
import CharacterBreakdown from './CharacterBreakdown';
import {copy} from './copy';
import LetterTrack from './LetterTrack';
import {sampleTexts} from './sampleTexts';
import {useAnnounce} from './shared';
import {SPEED_MAX, SPEED_MIN, SPEED_STEP, useCipherPlayback} from './useCipherPlayback';
import VigenereTable from './VigenereTable';
import './vigenere.css';

export default function App() {
  const [rawMessage, setRawMessage] = useState(sampleTexts.message);
  const [rawKeyword, setRawKeyword] = useState(sampleTexts.keyword);
  const [mode, setMode] = useState<CipherMode>('encrypt');
  const announce = useAnnounce();

  const message = useMemo(() => cleanText(rawMessage), [rawMessage]);
  const keyword = useMemo(() => cleanText(rawKeyword), [rawKeyword]);
  const steps = useMemo(() => computeSteps(mode, message, keyword), [mode, message, keyword]);

  // Identifies the current message/keyword/mode combination — see useCipherPlayback.
  const resetKey = `${mode}:${message}:${keyword}`;
  const {revealed, playing, speed, setSpeed, play, pause, step, fastForward, restart} =
    useCipherPlayback(steps.length, resetKey);

  const visibleSteps = steps.slice(0, revealed);
  const resultSoFar = visibleSteps
    .map(s => (mode === 'encrypt' ? s.cipherChar : s.plainChar))
    .join('');
  const activeStep = revealed > 0 ? steps[revealed - 1] : null;
  const done = steps.length > 0 && revealed >= steps.length;

  useEffect(() => {
    if (revealed === 0) {
      return;
    }
    const id = window.setTimeout(() => {
      announce(
        revealed >= steps.length
          ? copy.announce.complete(mode, resultSoFar)
          : copy.announce.progress(mode, revealed, steps.length, resultSoFar),
      );
    }, 500);
    return () => window.clearTimeout(id);
    // resultSoFar is derived from revealed/steps/mode, so it's redundant as a dependency trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, steps.length, mode, announce]);

  const handleRestart = () => {
    restart();
    announce(copy.announce.restarted);
  };

  return (
    <main className="vigPage">
      <Typography semanticTag="h1" visualAppearance="heading-lg">
        {copy.title}
      </Typography>
      {copy.intro.map(paragraph => (
        <Typography key={paragraph} semanticTag="p" visualAppearance="body-two">
          {paragraph}
        </Typography>
      ))}

      <form className="vigForm" onSubmit={e => e.preventDefault()}>
        <MuiTextField
          label={copy.form.messageLabel(mode)}
          helperText={copy.form.messageHelp}
          multiline
          minRows={2}
          maxRows={6}
          fullWidth
          value={rawMessage}
          onChange={e => setRawMessage(e.target.value)}
        />

        <TextField
          name="vig-keyword"
          inputType="text"
          label={copy.form.keywordLabel}
          helperMessage={keyword.length > 0 ? copy.form.keywordHelp : undefined}
          errorMessage={keyword.length === 0 ? copy.form.keywordEmptyError : undefined}
          value={rawKeyword}
          onChange={e => setRawKeyword(e.target.value)}
        />

        <fieldset className="vigModeFieldset">
          <legend className="vigModeLegend">{copy.form.modeLegend}</legend>
          <SegmentedButtons
            selectedButtonValue={mode}
            onChange={value => setMode(value as CipherMode)}
            buttons={[
              {value: 'encrypt', label: copy.form.encrypt},
              {value: 'decrypt', label: copy.form.decrypt},
            ]}
          />
        </fieldset>
      </form>

      <div className="vigControls">
        <fieldset className="vigControlsFieldset">
          <legend className="vigModeLegend">{copy.controls.legend}</legend>
          <div className="vigButtonRow">
            <Button text={copy.controls.restart} type="tertiary" color="black" onClick={handleRestart} />
            <Button
              text={copy.controls.step}
              type="secondary"
              onClick={step}
              disabled={steps.length === 0 || done}
            />
            {playing ? (
              <Button text={copy.controls.pause} type="primary" onClick={pause} />
            ) : (
              <Button
                text={copy.controls.play}
                type="primary"
                onClick={play}
                disabled={steps.length === 0 || done}
              />
            )}
            <Button
              text={copy.controls.fastForward}
              type="secondary"
              onClick={fastForward}
              disabled={steps.length === 0 || done}
            />
          </div>
        </fieldset>

        <div className="vigSpeedRow">
          <span id="vig-speed-slow">{copy.controls.speedSlow}</span>
          <Slider
            name="vig-speed"
            label={copy.controls.speedLabel}
            color="brand"
            hideValue
            minValue={SPEED_MIN}
            maxValue={SPEED_MAX}
            step={SPEED_STEP}
            value={speed}
            aria-describedby="vig-speed-slow vig-speed-fast"
            onChange={e => setSpeed(Number(e.target.value))}
          />
          <span id="vig-speed-fast">{copy.controls.speedFast}</span>
        </div>
      </div>

      <section className="vigResult" aria-labelledby="vig-result-heading">
        <Typography semanticTag="h2" visualAppearance="heading-xs" id="vig-result-heading">
          {copy.result.heading}
        </Typography>
        <LetterTrack
          label={copy.result.keywordTrackLabel}
          text={keyword}
          activeIndex={activeStep ? activeStep.keyIndex : null}
          role="key"
        />
        <LetterTrack
          label={copy.result.sourceLabel(mode)}
          text={message}
          activeIndex={revealed > 0 ? revealed - 1 : null}
          role="source"
        />
        <LetterTrack
          label={copy.result.resultLabel(mode)}
          text={resultSoFar}
          activeIndex={resultSoFar.length > 0 ? resultSoFar.length - 1 : null}
          role="result"
        />
      </section>

      <CharacterBreakdown mode={mode} steps={steps} revealed={revealed} />

      <VigenereTable mode={mode} step={activeStep} />
    </main>
  );
}
