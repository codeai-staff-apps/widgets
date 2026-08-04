# widgets — rebuilt educational mini-apps

Rebuilds of "vibe coded" educational widgets as governed apps: Vite static
builds using the @code-dot-org/component-library design system, deployed to
GitHub Pages at `codeai-staff-apps.github.io/widgets/<app-id>/`, linked by a
gallery at the site root.

## Layout

```
packages/runtime/   design tokens + brand fonts + Vite preset (CSP injection).
                    Do not modify without platform review.
template/           copy this to start an app: cp -r template apps/<app-id>
gallery/            the index page linking all apps
apps/<app-id>/      one self-contained npm project per app (own package.json;
                    never imports from sibling apps)
scripts/            gen-manifest.mjs — builds the gallery manifest from
                    apps/*/app.json
```

## Building an app

1. `cp -r template apps/<app-id>` (kebab-case id).
2. Fill in `app.json` (`id` MUST equal the directory name — it sets the Vite
   base path), `package.json` name, `index.html` title/lang.
3. `export GH_PACKAGES_TOKEN=$(gh auth token)` — required for npm install
   (the design system comes from GitHub Packages, which needs auth even for
   reads).
4. `npm install`, `npm run dev` to iterate, `npm run build` must pass (it
   typechecks) before you commit.

## Rules

- **Component hierarchy: component-library first, MUI second, custom last.**
  Import DS components by subpath: `@code-dot-org/component-library/button`.
  Use MUI (`@mui/material` v7) only where no DS component exists. Hand-rolled
  markup/CSS is the last resort, and must use the design tokens
  (`var(--text-neutral-primary)` etc.) — never hardcoded colors/fonts.
- **No external requests of any kind.** The build injects a CSP meta with
  `connect-src 'none'` and self-only assets; a Google-Fonts link or hotlinked
  image will be blocked at runtime. Vendor every asset into `src/assets/`.
  Fonts come from the runtime — never load your own.
- **Accessibility floor** (fix the original's defects; never copy them):
  real `<button>`/`<input>` elements with accessible names; full keyboard
  operability; touch support for any drag interaction (pointer events, not
  HTML5 drag alone); a heading structure starting at one `<h1>`; `lang` on
  `<html>`; visible `:focus-visible` styles; `prefers-reduced-motion`
  respected; never expose an activity's answer through an accessible name.
- **Faithful rebuild**: same educational content and interaction flow as the
  original (its spec transcribes the content); design-system look; a11y
  fixed. Do not redesign the pedagogy.
- **Stay in your app.** Never edit sibling apps, `packages/runtime`,
  `template/`, `gallery/`, or workflows.
- Each app keeps its own `package-lock.json` committed.

## Deploy

Push to `main` builds every app + the gallery and deploys to GitHub Pages
(`.github/workflows/deploy.yml`). The gallery card for your app comes from
`app.json` — keep `name`/`description` presentable and `originalUrl` pointing
at the vibe original it replaces.
