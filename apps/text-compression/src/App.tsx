import Alert from '@code-dot-org/component-library/alert';
import Button from '@code-dot-org/component-library/button';
import SimpleDropdown from '@code-dot-org/component-library/dropdown/simpleDropdown';
import Typography from '@code-dot-org/component-library/typography';
import MuiTextField from '@mui/material/TextField';
import {useEffect, useMemo, useRef, useState} from 'react';

import {computeCompression} from './compression';
import CompressedText from './CompressedText';
import {copy} from './copy';
import DictionaryEntryRow from './DictionaryEntryRow';
import {encodeSpaces, previewLabel, SAMPLE_TEXTS} from './sampleTexts';
import {useAnnounce} from './shared';
import Stats from './Stats';
import {MAX_DICT_ENTRIES, SYMBOLS} from './symbols';
import './text-compression.css';

/** Empty pattern boxes shown before the student adds more. */
const INITIAL_ENTRY_COUNT = 6;

/** Milliseconds of typing quiet before the compression summary is announced, so it isn't read after every keystroke. */
const ANNOUNCE_DEBOUNCE_MS = 700;

export default function App() {
  const announce = useAnnounce();
  const [texts, setTexts] = useState<string[]>(() => [...SAMPLE_TEXTS]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showCustomEditor, setShowCustomEditor] = useState(false);
  const [customDraft, setCustomDraft] = useState('');
  const [entries, setEntries] = useState<string[]>(() => Array(INITIAL_ENTRY_COUNT).fill(''));

  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const customFieldRef = useRef<HTMLInputElement>(null);

  const activeText = texts[selectedIndex];
  const result = useMemo(() => computeCompression(activeText, entries), [activeText, entries]);

  useEffect(() => {
    if (showCustomEditor) {
      customFieldRef.current?.focus();
    }
  }, [showCustomEditor]);

  // Announces the compression outcome after typing settles, not on every
  // keystroke; skips the very first render so opening the widget stays quiet.
  const announcedOnce = useRef(false);
  useEffect(() => {
    if (!announcedOnce.current) {
      announcedOnce.current = true;
      return;
    }
    const timeout = window.setTimeout(() => {
      if (result.invalidEntryIndexes.size > 0) {
        announce(copy.stats.announceError);
      } else if (result.compressionPercent !== null) {
        const {compressionPercent: percent, totalSize, originalSize} = result;
        if (percent > 0) {
          announce(copy.stats.announceSmaller(percent, totalSize, originalSize));
        } else if (percent < 0) {
          announce(copy.stats.announceLarger(percent, totalSize, originalSize));
        } else {
          announce(copy.stats.announceNoChange(totalSize));
        }
      }
    }, ANNOUNCE_DEBOUNCE_MS);
    return () => window.clearTimeout(timeout);
  }, [result, announce]);

  function closeCustomEditor() {
    setShowCustomEditor(false);
    setCustomDraft('');
    toggleButtonRef.current?.focus();
  }

  function handleUseCustomText() {
    if (customDraft.trim() === '') {
      return;
    }
    const newIndex = texts.length;
    setTexts(prev => [...prev, encodeSpaces(customDraft)]);
    setSelectedIndex(newIndex);
    setShowCustomEditor(false);
    setCustomDraft('');
    toggleButtonRef.current?.focus();
  }

  function updateEntry(index: number, value: string) {
    setEntries(prev => prev.map((entry, i) => (i === index ? value : entry)));
  }

  function addEntry() {
    setEntries(prev => (prev.length >= MAX_DICT_ENTRIES ? prev : [...prev, '']));
  }

  function removeEntry(index: number) {
    setEntries(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <main className="tcPage">
      <Typography semanticTag="h1" visualAppearance="heading-lg">
        {copy.title}
      </Typography>
      {copy.intro.map(paragraph => (
        <Typography key={paragraph} semanticTag="p" visualAppearance="body-two">
          {paragraph}
        </Typography>
      ))}

      <div className="tcTextPicker">
        <SimpleDropdown
          name="tc-text-picker"
          labelText={copy.textPicker.label}
          items={texts.map((text, i) => ({value: String(i), text: previewLabel(text)}))}
          selectedValue={String(selectedIndex)}
          onChange={e => setSelectedIndex(Number(e.target.value))}
        />
        <Button
          ref={toggleButtonRef}
          type="secondary"
          text={copy.textPicker.writeYourOwn}
          onClick={() => setShowCustomEditor(v => !v)}
          aria-expanded={showCustomEditor}
        />
      </div>

      {showCustomEditor && (
        <div className="tcCustomEditor">
          <Typography semanticTag="h2" visualAppearance="heading-sm">
            {copy.customText.heading}
          </Typography>
          <MuiTextField
            label={copy.customText.fieldLabel}
            placeholder={copy.customText.placeholder}
            multiline
            minRows={4}
            fullWidth
            value={customDraft}
            onChange={e => setCustomDraft(e.target.value)}
            inputRef={customFieldRef}
          />
          <div className="tcCustomEditorActions">
            <Button type="tertiary" color="black" text={copy.customText.cancel} onClick={closeCustomEditor} />
            <Button
              type="primary"
              text={copy.customText.use}
              onClick={handleUseCustomText}
              disabled={customDraft.trim() === ''}
            />
          </div>
        </div>
      )}

      <div className="tcColumns">
        <section aria-labelledby="tc-compressed-heading" className="tcColumn">
          <Typography semanticTag="h2" visualAppearance="heading-sm" id="tc-compressed-heading">
            {copy.compressed.heading}
          </Typography>
          <Typography semanticTag="p" visualAppearance="body-three" className="tcHelp">
            {copy.spacesNote}
          </Typography>
          <CompressedText segments={result.segments} />
          <Typography semanticTag="h3" visualAppearance="heading-xs">
            {copy.stats.heading}
          </Typography>
          <Stats result={result} />
        </section>

        <section aria-labelledby="tc-dictionary-heading" className="tcColumn">
          <Typography semanticTag="h2" visualAppearance="heading-sm" id="tc-dictionary-heading">
            {copy.dictionary.heading}
          </Typography>
          {result.invalidEntryIndexes.size > 0 && (
            <Alert type="danger" size="s" text={copy.dictionary.dictionaryErrorAlert} />
          )}
          <ul className="tcEntryList">
            {entries.map((value, i) => (
              <DictionaryEntryRow
                key={i}
                entryNumber={i + 1}
                symbol={SYMBOLS[i]}
                value={value}
                invalid={result.invalidEntryIndexes.has(i)}
                removable
                onChange={v => updateEntry(i, v)}
                onRemove={() => removeEntry(i)}
              />
            ))}
          </ul>
          {entries.length < MAX_DICT_ENTRIES ? (
            <Button type="secondary" text={copy.dictionary.addPattern} onClick={addEntry} />
          ) : (
            <Typography semanticTag="p" visualAppearance="body-three">
              {copy.dictionary.maxReached(MAX_DICT_ENTRIES)}
            </Typography>
          )}
        </section>
      </div>
    </main>
  );
}
