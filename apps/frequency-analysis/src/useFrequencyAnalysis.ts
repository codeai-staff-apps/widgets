import {useCallback, useMemo, useState} from 'react';

import {
  alphabeticOrder,
  Assignments,
  assignRemaining,
  byFrequencyOrder,
  caesarAssignments,
  decodeMessage,
  messageFrequencies,
  place,
  shuffledOrder,
  unassign,
} from './cipher';
import {LANGUAGE} from './language';
import {DEFAULT_MESSAGES, SampleMessage} from './messages';
import {useAnnounce} from './shared';
import {strings} from './strings';

/** Which control panel is showing. The board itself is always rendered. */
export type ControlsMode = 'caesar' | 'substitution';
export type ColumnOrder = 'alphabetic' | 'frequency';

/** All state and actions the app needs, in one hook so `App` stays a thin layout. */
export function useFrequencyAnalysis() {
  const announce = useAnnounce();

  const [messages, setMessages] = useState<SampleMessage[]>([...DEFAULT_MESSAGES]);
  const [messageIndex, setMessageIndex] = useState(0);

  const [controls, setControlsState] = useState<ControlsMode>('caesar');
  const [shift, setShift] = useState(0);
  const [assignments, setAssignments] = useState<Assignments>({});
  const [bankOrder, setBankOrderState] = useState<string[]>(alphabeticOrder());
  const [columnOrder, setColumnOrderState] = useState<ColumnOrder>('alphabetic');

  const message = messages[messageIndex]?.message ?? '';
  const frequencies = useMemo(() => messageFrequencies(message), [message]);

  const decoded = useMemo(() => decodeMessage(message, assignments), [message, assignments]);

  const columns = useMemo(
    () => (columnOrder === 'alphabetic' ? alphabeticOrder() : byFrequencyOrder(frequencies)),
    [columnOrder, frequencies],
  );

  /** Both charts share this scale, so a letter's bar is the same height whichever chart it's in. */
  const maxValue = useMemo(() => {
    const messageMax = Math.max(...LANGUAGE.letters.map(letter => frequencies[letter] ?? 0));
    const languageMax = Math.max(...LANGUAGE.letters.map(letter => LANGUAGE.frequency[letter] ?? 0));
    return Math.max(messageMax, languageMax) || 1;
  }, [frequencies]);

  const setControls = useCallback((next: ControlsMode) => {
    setControlsState(next);
    if (next === 'caesar') {
      // Matches the original: picking the Caesar tab resets the ciphertext
      // column order, so the shift always slides a plain A-to-Z alphabet.
      setColumnOrderState('alphabetic');
    }
  }, []);

  const selectMessage = useCallback(
    (index: number) => {
      setMessageIndex(index);
      const title = messages[index]?.title;
      if (title) {
        announce(strings.announceMessageChanged(title));
      }
    },
    [announce, messages],
  );

  const addCustomMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) {
        return;
      }
      const excerpt = trimmed.length > 24 ? `${trimmed.slice(0, 24)} ...` : trimmed;
      setMessages(prev => {
        const next = [...prev, {title: strings.customMessageTitle(excerpt), message: trimmed}];
        setMessageIndex(next.length - 1);
        return next;
      });
      announce(strings.announceCustomMessageAdded);
    },
    [announce],
  );

  /** A shift is a bulk assignment: it writes all 26 letters straight into `assignments`,
   * so dragging still works afterwards and the board's letter rows visibly slide. */
  const applyShift = useCallback(
    (next: number) => {
      const n = LANGUAGE.letters.length;
      const normalized = ((next % n) + n) % n;
      setShift(normalized);
      setAssignments(caesarAssignments(normalized));
      announce(strings.announceShift(normalized));
    },
    [announce],
  );

  const shiftBy = useCallback(
    (delta: number) => {
      applyShift(shift + delta);
    },
    [applyShift, shift],
  );

  const setShiftAmount = useCallback(
    (next: number) => {
      applyShift(next);
    },
    [applyShift],
  );

  const resetShift = useCallback(() => {
    setShift(0);
    setAssignments({});
    announce(strings.announceReset);
  }, [announce]);

  const placeGuess = useCallback(
    (guess: string, targetCipherLetter: string) => {
      setAssignments(prev => {
        if (prev[targetCipherLetter] === guess) {
          return prev;
        }
        const sourceCipherLetter = Object.keys(prev).find(letter => prev[letter] === guess);
        const displaced = prev[targetCipherLetter];
        const next = place(prev, guess, targetCipherLetter);

        if (displaced && displaced !== guess) {
          if (sourceCipherLetter) {
            announce(strings.announceSwapped(targetCipherLetter, guess, sourceCipherLetter, displaced));
          } else {
            announce(strings.announceDisplaced(targetCipherLetter, guess, displaced));
          }
        } else {
          announce(strings.announceMapped(targetCipherLetter, guess));
        }
        return next;
      });
    },
    [announce],
  );

  const sendToBank = useCallback(
    (guess: string) => {
      setAssignments(prev => unassign(prev, guess));
      announce(strings.announceUnassigned(guess));
    },
    [announce],
  );

  const resetAssignments = useCallback(() => {
    setAssignments({});
    announce(strings.announceReset);
  }, [announce]);

  const assignAll = useCallback(() => {
    setAssignments(prev => assignRemaining(prev, bankOrder, columns));
    announce(strings.announceAssignAll);
  }, [announce, bankOrder, columns]);

  const sortBank = useCallback(
    (order: 'alphabetic' | 'frequency' | 'random') => {
      if (order === 'alphabetic') {
        setBankOrderState(alphabeticOrder());
        announce(strings.announceSortBank(strings.orderAlphabetically));
      } else if (order === 'frequency') {
        // Sorted by standard-language frequency (not the message's own
        // frequency) -- this is what lets the bank read top-to-bottom as
        // "most likely guess first".
        setBankOrderState(byFrequencyOrder(LANGUAGE.frequency));
        announce(strings.announceSortBank(strings.orderByFrequency));
      } else {
        setBankOrderState(shuffledOrder());
        announce(strings.announceSortBank(strings.orderRandomly));
      }
    },
    [announce],
  );

  const sortColumns = useCallback(
    (order: ColumnOrder) => {
      setColumnOrderState(order);
      announce(
        strings.announceSortOriginals(
          order === 'alphabetic' ? strings.orderAlphabetically : strings.orderByFrequency,
        ),
      );
    },
    [announce],
  );

  return {
    messages,
    messageIndex,
    message,
    controls,
    shift,
    assignments,
    bankOrder,
    columnOrder,
    columns,
    frequencies,
    maxValue,
    decoded,
    setControls,
    selectMessage,
    addCustomMessage,
    shiftBy,
    setShiftAmount,
    resetShift,
    placeGuess,
    sendToBank,
    resetAssignments,
    assignAll,
    sortBank,
    sortColumns,
  };
}

export type FrequencyAnalysis = ReturnType<typeof useFrequencyAnalysis>;
