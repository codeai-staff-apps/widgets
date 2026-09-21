# Case study: building the "Two DHCP Servers, One LAN" widget conversationally

**What this is:** a faithful record of the conversation that produced this
widget, kept so the app can stand as an example of a *purely conversational
agentic workflow* — building a governed frontend widget from scratch without
the human writing (or, mostly, reading) any code.

**Who:** Darin, the Infra team manager. Not a frontend engineer; steered the
entire build in natural language. Claude Code (Opus 4.8) did the scaffolding,
coding, building, and verification.

**Where:** the `widgets` monorepo — Vite static apps on the
`@code-dot-org/component-library` design system, governed by `AGENTS.md`
(anti-bespoke, design-system-first, strict CSP with no external requests, an
explicit accessibility floor).

**Constraint that shaped the workflow:** Darin declined to install the Chrome
browser-driver extension partway through. So *nothing was verified by looking at
it in a browser.* Every claim of correctness had to come from the build
(typecheck), from reading the code, or from computation. That constraint is
part of what makes this a useful example — it shows what conversational
verification looks like when you can't just eyeball the result.

---

## Timeline

### 1. "Does the repo help me bootstrap this?"

Darin's opening question was about a *subnet mask* widget and whether the repo
had anything to help start one. The agent read `AGENTS.md` and the repo layout
and reported the real bootstrap path:

- `cp -r template apps/<app-id>` to scaffold
- the design-system component hierarchy (component-library → MUI → custom-last)
- reusable `src/shared/` helpers (`ScreenMachine`, `SelectAndPlace`,
  `LiveAnnouncer`, `CodeBlock`)
- the hard rules: CSP blocks all external requests; use design tokens, never
  hardcoded colors/fonts; fix the original's a11y defects.

Rather than immediately generating code, the agent surfaced the one decision
that actually mattered (scaffold now vs. design the pedagogy first) and asked.

### 2. The real idea

Darin pivoted: not subnet masks — **two DHCP servers on one network** (e.g. two
home routers on one LAN), built from scratch with no "vibe original" to
replace.

The agent proposed the pedagogy in plain language (the DHCP race, the
split-subnet failure, the duplicate-IP failure, and the fix: one authoritative
DHCP server / access-point mode), then used a structured question to pin down
scope. Two decisions, presented with previews:

| Decision | Options offered | Darin chose |
|---|---|---|
| Which failure to dramatize | both + fix / **split-network only** / duplicate-IP only | **Split-network only** |
| How the learner drives it | free sandbox / **guided steps** | **Guided steps** |

This is a hallmark of the workflow: the human makes *product* decisions; the
agent makes the *implementation* decisions those imply.

### 3. Scaffold and first build

The agent:

- copied `template/` to `apps/two-dhcp-servers`, set `app.json` (id must equal
  the directory name — it drives the Vite base path), `package.json` name, and
  the page title;
- set `originalUrl: null` (from-scratch app) after checking the gallery only
  renders that link when truthy;
- pruned unused shared helpers (`SelectAndPlace`, `CodeBlock`) and trimmed the
  barrel export;
- wrote a small honest model in `network.ts` — two routers on different `/24`s,
  a scripted lease per step, and a `sameSubnet()` function so reachability is
  *derived from the leases the learner sees*, never asserted by the script;
- built the `LanDiagram` (two routers + two devices on one bus) and a 7-step
  `ScreenMachine` walkthrough;
- kept styling token-driven; the only bespoke CSS is the diagram itself.

`npm run build` (which typechecks) passed. Before writing any component the
agent verified real specifics against the installed packages — the DS `Button`
props, the `ComponentSizeXSToL` values, the actual design-token names — instead
of guessing.

### 4. The closing "gotcha"

Darin asked for a question prompt at the end about a subtle real-world point:
after you disable Router B's DHCP, its admin page at `192.168.0.1` is *still*
unreachable from a laptop that now has `192.168.1.100`, because Router B itself
never moved off the `192.168.0.0/24` subnet. "No need to make it fully
interactive."

The agent added a "One more gotcha" step with a **Reveal answer** toggle (lightly
interactive, not a full activity), a matching recap bullet, and left Router B's
card showing `192.168.0.0/24` so the learner can see the mismatch the question
is about.

### 5. Moving the controls into the diagram

Darin: move the DHCPDISCOVER and DHCP-toggle buttons *up into the cards*, make
them flash when it's their turn, but don't let them be clickable off the
happy path.

The agent moved the buttons into the device/router cards and made a card's
button exist only during the step that expects its click — so there's no way to
click ahead or out of turn — with an amber pulse cue (motion gated behind
`prefers-reduced-motion`, a steady ring otherwise).

### 6. Commit

At Darin's request, the agent branched off `main`
(`add-two-dhcp-servers-widget`) and committed the working widget.

### 7. Accessibility pass

Darin: "First up is an accessibility pass."

With no browser available, the agent evaluated by **computation**. It resolved
the design-system token files (skipping the Dark-theme blocks, since the app
runs `[data-brand='codeai-next']` light), followed every `var()` chain to a hex
value, and computed WCAG contrast for every foreground/background pair the
diagram uses — including opacity-blended text.

That surfaced concrete problems, not vibes:

- **A latent bug:** `--background-neutral-white` doesn't exist — the card
  backgrounds were rendering transparent and only *looked* white because the
  container behind them is white. Fixed to `--background-neutral-primary`.
- **Five text contrast failures (WCAG 1.4.3 AA):** the DS sentiment inks ship
  *below* 4.5:1 on their own `-light` fills (success 4.15, info 4.13, error
  3.51) — the same defect `array-state-visualizer` documents. Fixed with a
  Layer-1 `theme.css` that darkens the inks (success `#136b1d` → 6.12:1, error
  `#b30000` → 5.59:1, info `#0b5cb8` → 5.44:1) and, for the laptop chip, by
  switching to the paler purple `-extra-light` fill where the stock ink already
  passes (5.53:1).
- **A focus-loss bug (keyboard/AT):** the flashing button *unmounted* the moment
  it was clicked, dropping focus to `<body>`. Fixed by keeping the button
  mounted for the whole step (it just stops pulsing) with an idempotent guard so
  a repeat click is a harmless no-op — still strictly on-rails.
- **Flash-ring non-text contrast (WCAG 1.4.11):** the amber ring was 2.79:1 on
  white; given its own `--cta-ring` token at `#b26a00` (4.24:1).
- **Heading structure:** every step is now an `<h1>` (only one screen is in the
  DOM at a time), matching the pattern `capstone-teaching-moves` uses.

Then it re-ran the resolver with the `theme.css` overrides applied to confirm
every text pair passed AA before reporting done. Two remaining sub-3:1 items
(decorative success/card borders) were judged *not* violations — the state and
grouping are carried by fill, text, and the routers' colored top-borders, not by
those borders — and left alone rather than fighting the design system.

---

## Artifacts produced

```
apps/two-dhcp-servers/
  app.json            id/name/description; originalUrl: null (from-scratch)
  index.html          title + lang, CSP injected by the build
  src/
    network.ts        routers, scripted leases, sameSubnet() (honest verdict)
    LanDiagram.tsx     the one bespoke visual: routers+devices on one bus
    lan.css           token-driven diagram styles; pulse gated on reduced-motion
    theme.css         Layer-1 WCAG fixes for DS tokens that fail AA
    App.tsx           7-step ScreenMachine walkthrough + on-rails card actions
    main.tsx, AppShell.tsx, shared/*
```

The 8 screens: intro → laptop joins → phone joins → the split → the fix →
everyone on one network → the gotcha → recap.

---

## How verification worked without a browser

| Claim | How it was checked |
|---|---|
| It compiles / types are right | `npm run build` (runs `tsc -b`) |
| DS component props exist | read the installed `.d.ts` files before use |
| Token names are real | grepped the design-system CSS, not memory |
| Colors meet WCAG AA | resolved token `var()` chains to hex and computed ratios |
| Fixes actually land | re-ran the resolver with `theme.css` applied |
| Keyboard focus is preserved | reasoned through the mount/unmount lifecycle |

The one thing this *can't* substitute for is a human (or a browser agent)
actually seeing and operating the widget — layout, visual polish, and the feel
of the interaction remain unverified by design here.

---

## What this example shows about the workflow

- **The human stays in the product seat.** Darin decided the topic, the failure
  to teach, the guided format, the closing gotcha, and where the controls live.
  He never specified an implementation.
- **Decisions were surfaced, not assumed.** At each fork the agent offered
  concrete options (often with previews) and let Darin choose, instead of
  guessing and building the wrong thing.
- **Governance was upheld without being asked.** Design-system-first,
  token-driven, CSP-clean, and a11y-fixed came from the repo's `AGENTS.md`, not
  from Darin restating the rules.
- **Verification was real, and honest about its limits.** Contrast was computed,
  not eyeballed; the build gated every step; and the write-up says plainly what
  was *not* checked (the live visual/interaction) after browser tooling was
  declined.
- **An evaluation pass found real defects.** The a11y review turned up a genuine
  undefined-token bug and a focus-loss bug that a "looks fine" glance would have
  missed — which is the point of asking for the pass at all.
