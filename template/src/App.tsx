import Button from '@code-dot-org/component-library/button';
import Typography from '@code-dot-org/component-library/typography';

export default function App() {
  return (
    <main style={{padding: '2rem', display: 'grid', gap: '1rem'}}>
      <Typography semanticTag="h1" visualAppearance="heading-lg">
        RENAME ME
      </Typography>
      <div>
        <Button text="It works" onClick={() => {}} />
      </div>
    </main>
  );
}
