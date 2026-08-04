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

export const CSP = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'", // emotion/MUI inject inline <style>
  "img-src 'self' data:",
  "font-src 'self' data:", // Vite inlines small woff2 files as data: URIs
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
