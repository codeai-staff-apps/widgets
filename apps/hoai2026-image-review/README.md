# Hour of AI 2026 image review

Internal review tool for the images generated for Hour of AI 2026 (Sprite Lab
style character, object, place, and block images).

It lists every filling (one combination of words, such as "ancient spikeball")
with its 3 variants. The published image is shown with a "Published" label.
Rejected attempts are shown beside it with a "Rejected" label, the reason, and
the moderation results. Clicking an image opens a dialog with the large image,
prompt, seed, model, timestamps, full checks, and a link to the original file.

## Data

Everything is read at runtime, so new generations show up without a rebuild.
All paths are relative to `IMAGEGEN_BASE_URL` in `src/config.ts`.

- `review/v1/index.json`: per-category counts and the path of each manifest.
- `review/v1/<category>/manifest.json`: `slots[]` (the word lists, in the order
  of each filling's `wordIds`) and `fillings[]` with 3 `variants[]`. A variant
  has `current` (the published image, or `null`) and `rejected[]`. Image paths
  are in `frames` (`single`, or `base`, `idling`, `walking`, `jumping`,
  `landing` for animated characters).
- Published images live under `images/v1/...`, rejected ones under
  `review/v1/...`. Missing images answer 403, not 404, so the UI falls back to
  a placeholder on any load error.

Each category manifest loads when its tab is first opened (the place manifest
is 1.2 MB) and is kept in memory. The noun is the first required slot; every
other slot becomes a multi-select chip group.

The status filter works on fillings: "Published" has at least one published
image, "Has rejections" has at least one rejected attempt, "Rejected only" has
rejected attempts and no published image, and "No published image" covers
everything without a published image, including fillings not drawn yet.

## External host and CSP

This app is the one exception to "no external requests" in `AGENTS.md`: its
purpose is to show images from S3. The default base URL is
`https://cdo-curriculum.s3.amazonaws.com/media/spritelab/generate/`, which
sends `Access-Control-Allow-Origin: *`. `https://curriculum.code.org/media/spritelab/generate/`
should serve the same files but has not been verified from a browser.

The Pages CSP from `packages/runtime/vitePreset.mjs` (`connect-src 'none'`,
`img-src 'self' data:`) blocks both the manifest fetches and the images. For
the deployed app to load live data the policy needs, for this app only:

```
connect-src https://cdo-curriculum.s3.amazonaws.com;
img-src 'self' data: https://cdo-curriculum.s3.amazonaws.com
```

The runtime was not changed. Until the policy allows it, the app falls back to
a manifest snapshot bundled in `src/snapshot/` and says so in a warning banner;
images show "Image unavailable" placeholders with their path. The Claude
artifact preview behaves the same way, because the artifact platform blocks all
requests to other hosts.

Refresh the snapshot with `npm run snapshot` (needs network access to S3).
