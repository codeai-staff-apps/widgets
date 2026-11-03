/**
 * Where the generated images and their review manifests live.
 *
 * This is the CORS-verified S3 host that serves the same objects as the public
 * CloudFront URL. https://curriculum.code.org/media/spritelab/generate/ should
 * be the equivalent public URL if/when it is verified from a browser.
 */
export const IMAGEGEN_BASE_URL =
  'https://cdo-curriculum.s3.amazonaws.com/media/spritelab/generate/';

/** The review index. Per-category manifest paths come from the index itself. */
export const INDEX_PATH = 'review/v1/index.json';

/** Give up on a live request after this long and use the bundled snapshot. */
export const FETCH_TIMEOUT_MS = 15_000;

/** Every path in the index and manifests is relative to the base URL. */
export const assetUrl = (path: string) => IMAGEGEN_BASE_URL + path;
