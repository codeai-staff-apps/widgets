import Button from '@code-dot-org/component-library/button';
import SimpleDropdown from '@code-dot-org/component-library/dropdown/simpleDropdown';
import MuiTextField from '@mui/material/TextField';
import {useState, type ChangeEvent} from 'react';

import type {SampleMessage} from '../messages';
import {strings} from '../strings';

export interface MessagePickerProps {
  messages: SampleMessage[];
  messageIndex: number;
  onSelect: (index: number) => void;
  onAddCustomMessage: (text: string) => void;
}

/** The message dropdown, plus a reveal-on-demand "write your own" text box. */
export default function MessagePicker({
  messages,
  messageIndex,
  onSelect,
  onAddCustomMessage,
}: MessagePickerProps) {
  const [writingOwn, setWritingOwn] = useState(false);
  const [draft, setDraft] = useState('');

  return (
    <div className="freq-message-picker">
      <SimpleDropdown
        name="frequency-message"
        labelText={strings.messageLabel}
        selectedValue={String(messageIndex)}
        items={messages.map((item, index) => ({value: String(index), text: item.title}))}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => onSelect(Number(event.target.value))}
      />
      <Button
        text={strings.writeYourOwn}
        type="secondary"
        onClick={() => setWritingOwn(prev => !prev)}
        ariaLabel={strings.writeYourOwn}
      />
      {writingOwn && (
        <div className="freq-custom-message">
          <MuiTextField
            label={strings.customMessageLabel}
            placeholder={strings.customMessagePlaceholder}
            multiline
            minRows={4}
            fullWidth
            value={draft}
            onChange={event => setDraft(event.target.value)}
          />
          <div className="freq-button-row">
            <Button
              text={strings.addMessage}
              type="primary"
              disabled={!draft.trim()}
              onClick={() => {
                onAddCustomMessage(draft);
                setDraft('');
                setWritingOwn(false);
              }}
            />
            <Button
              text={strings.cancelCustomMessage}
              type="secondary"
              onClick={() => {
                setDraft('');
                setWritingOwn(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
