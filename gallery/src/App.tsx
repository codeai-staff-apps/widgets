import Link from '@code-dot-org/component-library/link';
import Typography from '@code-dot-org/component-library/typography';

import manifest from './manifest.json';

type AppMeta = {
  id: string;
  name: string;
  description: string;
  originalUrl: string | null;
};

const apps = manifest as AppMeta[];

export default function App() {
  return (
    <main style={{maxWidth: 960, margin: '0 auto', padding: '2rem 1rem'}}>
      <Typography semanticTag="h1" visualAppearance="heading-lg">
        CodeAI Widgets
      </Typography>
      <Typography semanticTag="p" visualAppearance="body-two">
        Staff-built educational mini-apps, rebuilt on the design system and
        deployed through a governed pipeline. Each card links the rebuilt app
        and the vibe-coded original it replaces.
      </Typography>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {apps.map(app => (
          <li
            key={app.id}
            style={{
              border: '1px solid var(--border-neutral-secondary, #ccc)',
              borderRadius: 'var(--border-radius-l, 12px)',
              padding: 16,
              display: 'grid',
              gap: 8,
              alignContent: 'start',
            }}
          >
            <Typography semanticTag="h2" visualAppearance="heading-sm">
              <Link href={`./${app.id}/`}>{app.name}</Link>
            </Typography>
            <Typography semanticTag="p" visualAppearance="body-three">
              {app.description}
            </Typography>
            {app.originalUrl && (
              <Typography semanticTag="p" visualAppearance="body-four">
                <Link href={app.originalUrl} external>
                  vibe-coded original
                </Link>
              </Typography>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
