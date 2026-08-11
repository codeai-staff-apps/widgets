# widgets — rebuilt educational mini-apps

Rebuilds of "vibe coded" educational widgets as governed apps: Vite static
builds using the @code-dot-org/component-library design system, deployed to
GitHub Pages at `codeai-staff-apps.github.io/widgets/<app-id>/`, linked by a
gallery at the site root.

## Layout

```
packages/runtime/   design tokens (from @code-dot-org/component-library-styles)
                    + brand fonts + Vite preset (CSP injection).
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
3. `(cd packages/runtime && npm install)` — once per checkout. The runtime's
   design tokens come from `@code-dot-org/component-library-styles`, and npm
   does not install a `file:`-linked package's dependencies for you.
4. `npm install`, `npm run dev` to iterate, `npm run build` must pass (it
   typechecks) before you commit. The design system installs from public npm —
   no auth token needed.

## Rules

- **Anti-bespoke, Occam's razor.** Build the SIMPLEST thing that provides
  equivalent functionality. No speculative props, config, or abstraction; no
  state beyond what the interaction needs. If your implementation feels clever,
  simplify it.
- **Keep the original's identity.** An app's theme is part of what it teaches:
  the Mars dashboard has to look like Mars. Reproduce the original's palette,
  depth, and signature motifs — but by *re-tokening the design system*, not by
  hand-rolling components. Three layers, in order:
  1. **`src/theme.css`** — redefine DS tokens to the app's palette. The DS is
     token-driven, so this re-themes every DS component for free. The selector
     MUST be `:root[data-brand]`: the document is `<html data-brand="codeai-next">`
     and a plain `:root` block ties on specificity and loses on source order.
  2. **MUI `ThemeProvider`** — tokens do not reach MUI. Set `palette.mode`,
     `primary.main`, and `background.paper` so MUI parts (`LinearProgress`,
     `Paper`, `Chip`) match. Style with `sx`, not a new stylesheet.
  3. **App CSS** — last resort, only for a signature visual no component
     provides (a gradient-clipped title, a card that must visibly flip). Use
     `var(--token)`, never raw hex, wherever a token exists.
  What you still drop: the original's novelty fonts (CSP blocks Google Fonts —
  map display/body onto `var(--font-family-heading)`/`var(--font-family-main)`)
  and any ornament that costs accessibility. Identity is carried by colour,
  depth, and layout, not by the typeface.
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
- **Faithful rebuild**: same educational content, same interaction flow, and
  the same visual identity as the original (its spec transcribes all three);
  built out of design-system components; a11y fixed. Do not redesign the
  pedagogy, and do not flatten the theme into stock components on white —
  a rebuild nobody recognises is not a rebuild.
- **Stay in your app.** Never edit sibling apps, `packages/runtime`,
  `template/`, `gallery/`, or workflows.
- Each app keeps its own `package-lock.json` committed.

## Deploy

Push to `main` builds every app + the gallery and deploys to GitHub Pages
(`.github/workflows/deploy.yml`). The gallery card for your app comes from
`app.json` — keep `name`/`description` presentable and `originalUrl` pointing
at the vibe original it replaces.
