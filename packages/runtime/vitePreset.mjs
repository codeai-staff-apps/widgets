/*
 * Vite preset shared by all widget apps.
 *
 * widgetBase(id)  — the GH Pages base path for an app. Site layout is
 *                   codeai-staff-apps.github.io/widgets/<id>/.
 * cspMeta()       — injects the Content-Security-Policy <meta> tag into the
 *                   BUILT index.html. The policy travels in the artifact, not
 *                   the host: connect-src 'none' blocks all runtime egress no
 *                   matter where the file is served from. Build-only, because
 *                   the dev server needs websockets + inline scripts for HMR.
 */

/*
 * dsco.code.org is the design system's own asset CDN — a first-party
 * carve-out, not third-party egress. It serves the Font Awesome Pro faces
 * the component library's icons require; FA Pro is licensed, so the files
 * cannot be vendored into this public repo. connect-src stays 'none'.
 */
const DSCO_CDN = 'https://dsco.code.org';

export const CSP = [
  "default-src 'none'",
  "script-src 'self'",
  `style-src 'self' 'unsafe-inline' ${DSCO_CDN}`, // emotion/MUI inline styles + FA css
  "img-src 'self' data:",
  `font-src 'self' data: ${DSCO_CDN}`, // Vite inlines small woff2 as data: URIs
  "connect-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join('; ');

export const widgetBase = id => `/widgets/${id}/`;

export function cspMeta() {
  return {
    name: 'widget-csp-meta',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler: html =>
        html.replace(
          '<head>',
          `<head>\n    <meta http-equiv="Content-Security-Policy" content="${CSP}">`,
        ),
    },
  };
}
