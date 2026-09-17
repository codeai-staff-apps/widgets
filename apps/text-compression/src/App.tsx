import Alert from '@code-dot-org/component-library/alert';
import Button from '@code-dot-org/component-library/button';
import SimpleDropdown from '@code-dot-org/component-library/dropdown/simpleDropdown';
import Typography from '@code-dot-org/component-library/typography';
import MuiTextField from '@mui/material/TextField';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

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

const CUSTOM_EDITOR_ID = 'tc-custom-editor';

/** Where to send focus after an add/remove changes which pattern rows exist. */
type PendingFocus = {type: 'add'} | {type: 'removed'; removedAt: number};

function focusPatternField(entryNumber: number): boolean {
  const field = document.querySelector<HTMLInputElement>(`input[name="tc-pattern-${entryNumber}"]`);
  field?.focus();
  return field !== null;
}

export default function App() {
  const announce = useAnnounce();
  const [texts, setTexts] = useState<string[]>(() => [...SAMPLE_TEXTS]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showCustomEditor, setShowCustomEditor] = useState(false);
  const [customDraft, setCustomDraft] = useState('');
  const [entries, setEntries] = useState<string[]>(() => Array(INITIAL_ENTRY_COUNT).fill(''));

  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const customFieldRef = useRef<HTMLInputElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const pendingFocusRef = useRef<PendingFocus | null>(null);

  const activeText = texts[selectedIndex];
  const result = useMemo(() => computeCompression(activeText, entries), [activeText, entries]);

  useEffect(() => {
    if (showCustomEditor) {
      customFieldRef.current?.focus();
    }
  }, [showCustomEditor]);

  const closeCustomEditor = useCallback(() => {
    setShowCustomEditor(false);
    setCustomDraft('');
    toggleButtonRef.current?.focus();
  }, []);

  // Escape collapses the disclosure panel and returns focus to its trigger,
  // matching how a modal is expected to behave even though this one isn't
  // modal (nothing here traps focus inside it).
  useEffect(() => {
    if (!showCustomEditor) {
      return;
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeCustomEditor();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [showCustomEditor, closeCustomEditor]);

  // After a pattern row is added or removed, move focus to where the student
  // would expect it (the new row when adding; the row that slid into the
  // removed one's place, or the last remaining row, or the Add button when
  // removing) instead of letting it fall back to <body>.
  useEffect(() => {
    const pending = pendingFocusRef.current;
    if (!pending) {
      return;
    }
    pendingFocusRef.current = null;
    if (pending.type === 'add') {
      focusPatternField(entries.length);
      return;
    }
    const {removedAt} = pending;
    if (removedAt < entries.length && focusPatternField(removedAt + 1)) {
      return;
    }
    if (entries.length > 0 && focusPatternField(entries.length)) {
      return;
    }
    addButtonRef.current?.focus();
  }, [entries]);

  // Announces the compression outcome after typing settles, not on every
  // keystroke; skips the very first render so opening the widget stays quiet.
  const announcedOnce = useRef(false);
  useEffect(() => {
    if (!announcedOnce.current) {
      announcedOnce.current = true;
      return;
    }
    if (result.invalidEntryIndexes.size > 0) {
      // The danger Alert below already announces this immediately (it renders
      // with role="alert"); a second, debounced announcement here would just
      // repeat the same fact a moment later.
      return;
    }
    const timeout = window.setTimeout(() => {
      if (result.compressionPercent !== null) {
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

  function handleUseCustomText() {
    if (customDraft.trim() === '') {
      return;
    }
    const newIndex = texts.length;
    setTexts(prev => [...prev, encodeSpaces(customDraft)]);
    setSelectedIndex(newIndex);
    closeCustomEditor();
  }

  function updateEntry(index: number, value: string) {
    setEntries(prev => prev.map((entry, i) => (i === index ? value : entry)));
  }

  function addEntry() {
    pendingFocusRef.current = {type: 'add'};
    setEntries(prev => (prev.length >= MAX_DICT_ENTRIES ? prev : [...prev, '']));
  }

  function removeEntry(index: number) {
    pendingFocusRef.current = {type: 'removed', removedAt: index};
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
          aria-controls={CUSTOM_EDITOR_ID}
        />
      </div>

      {showCustomEditor && (
        <div className="tcCustomEditor" id={CUSTOM_EDITOR_ID}>
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
            // The default MUI outline is a ~1.7:1 gray on white, well under the
            // 3:1 WCAG 1.4.11 floor for a control's boundary; this is the one
            // token-driven override needed to bring it up to the same solid
            // border every other field on the page already uses.
            sx={{'& .MuiOutlinedInput-notchedOutline': {borderColor: 'var(--borders-neutral-solid)'}}}
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
            // showIcon={false}: Alert's default icon is a FontAwesomeV6Icon,
            // whose stylesheet loads Font Awesome from an external host this
            // repo's CSP blocks (see OdometerRow.tsx) — it would just render
            // as a blank glyph.
            <Alert type="danger" size="s" showIcon={false} text={copy.dictionary.dictionaryErrorAlert} />
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
            <Button ref={addButtonRef} type="secondary" text={copy.dictionary.addPattern} onClick={addEntry} />
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
