import Typography from '@code-dot-org/component-library/typography';
import Paper from '@mui/material/Paper';

/**
 * The lavender box the original uses for "Your move" / "Jordan says" prompts.
 * `quote` renders the text as Jordan's own words — an italic, left-ruled
 * `<blockquote>` — rather than plain instructional prose.
 */
export default function PromptBox({
  label,
  text,
  quote = false,
}: {
  label: string;
  text: string;
  quote?: boolean;
}) {
  const body = (
    <Typography
      semanticTag="p"
      visualAppearance="body-two"
      noMargin
      style={{color: '#1F1976', fontWeight: quote ? undefined : 500, fontStyle: quote ? 'italic' : undefined}}
    >
      {text}
    </Typography>
  );

  return (
    <Paper
      variant="outlined"
      role="note"
      sx={{bgcolor: '#E4E2F8', borderColor: '#E4E2F8', borderRadius: '10px', p: '13px 16px'}}
    >
      <Typography
        semanticTag="p"
        visualAppearance="overline-three"
        noMargin
        style={{color: '#1F1976'}}
      >
        {label}
      </Typography>
      {quote ? (
        <blockquote style={{margin: 0, borderLeft: '3px solid #4C42CF', paddingLeft: 12}}>{body}</blockquote>
      ) : (
        body
      )}
    </Paper>
  );
}
