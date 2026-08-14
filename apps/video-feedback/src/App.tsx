import Button from '@code-dot-org/component-library/button';
import SegmentedButtons from '@code-dot-org/component-library/segmentedButtons';
import {useToast} from '@code-dot-org/component-library/toast';
import Typography from '@code-dot-org/component-library/typography';
import TextField from '@mui/material/TextField';
import {useState, type FormEvent} from 'react';

import VideoPlayer from './VideoPlayer';

const RATING_VALUES = ['1', '2', '3', '4', '5'];

export default function App() {
  const [rating, setRating] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const showToast = useToast();

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!rating) {
      return;
    }
    showToast('Thanks for your feedback!');
    setRating(null);
    setComment('');
  };

  return (
    <main style={{maxWidth: '40rem', margin: '0 auto', padding: '2rem', display: 'grid', gap: '1.5rem'}}>
      <Typography semanticTag="h1" visualAppearance="heading-lg">
        Video Feedback
      </Typography>
      <Typography semanticTag="p" visualAppearance="body-one">
        Watch the video below, then rate it from 1 to 5 and share what you noticed.
      </Typography>

      <VideoPlayer title="Sample video" />

      <form onSubmit={onSubmit} style={{display: 'grid', gap: '1.5rem'}}>
        <fieldset style={{border: 0, margin: 0, padding: 0, display: 'grid', gap: '0.5rem'}}>
          <legend
            style={{
              padding: 0,
              fontFamily: 'var(--font-family-main)',
              fontWeight: 600,
              color: 'var(--text-neutral-primary)',
            }}
          >
            Your rating
          </legend>
          <SegmentedButtons
            type="number"
            selectedButtonValue={rating ?? ''}
            onChange={setRating}
            buttons={RATING_VALUES.map(value => ({value, label: value, buttonType: 'number'}))}
          />
        </fieldset>

        <TextField
          label="What did you notice? (optional)"
          multiline
          minRows={4}
          fullWidth
          value={comment}
          onChange={event => setComment(event.target.value)}
        />

        <div>
          <Button
            type="primary"
            buttonTagTypeAttribute="submit"
            text="Submit feedback"
            disabled={!rating}
            onClick={() => {}}
          />
        </div>
      </form>
    </main>
  );
}
