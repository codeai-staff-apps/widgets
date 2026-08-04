/*
 * Bundles one app into a single self-contained HTML FRAGMENT for publishing as
 * a Claude artifact: artifact-dist/<app-id>.html.
 *
 * Usage: node scripts/build-artifact.mjs <app-id>
 *
 * The artifact platform supplies its own <!doctype html><html><head>...<body>
 * wrapper and its own CSP, and blocks every external host. So the output is a
 * fragment — <style>, <div id="root">, inline <script type="module"> — with the
 * CSS and JS inlined and every image inlined as a data: URI. Because the
 * wrapper owns <html>, the script re-applies what the app's index.html would
 * have set: lang, data-brand, title.
 */
import {execFileSync} from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, relative} from 'node:path';

const REPO = new URL('..', import.meta.url).pathname.replace(/\/$/, '');

const URL_RE = /https?:\/\/[^\s"'`)]+/g;

/*
 * A URL only causes egress from a fetch position. Everything else that looks
 * like a URL in a bundle is inert text — XML namespaces in inline SVG, the
 * documentation links React and MUI put in their error messages — so those are
 * reported but not fatal.
 */
const FETCH_POSITION =
  /(?:url\(|src=|href=|@import\s+|\bimport\(|\bfetch\()['"\s]*(https?:\/\/[^\s"'`)]+)/g;

const appId = process.argv[2];
if (!appId) {
  die('usage: node scripts/build-artifact.mjs <app-id>');
}
const appDir = join(REPO, 'apps', appId);
if (!existsSync(join(appDir, 'package.json'))) {
  die(`no such app: apps/${appId}`);
}

if (!existsSync(join(appDir, 'node_modules', 'vite'))) {
  console.log(`installing apps/${appId}...`);
  execFileSync('npm', ['install', '--no-audit', '--no-fund'], {cwd: appDir, stdio: 'inherit'});
}

const tmp = mkdtempSync(join(tmpdir(), `artifact-${appId}-`));
const outDir = join(tmp, 'dist');
const configPath = join(tmp, 'vite.artifact.config.mjs');
writeFileSync(configPath, artifactConfig(appDir, outDir));

const viteBin = join(appDir, 'node_modules', 'vite', 'bin', 'vite.js');
execFileSync(process.execPath, [viteBin, 'build', '--config', configPath], {
  cwd: appDir,
  stdio: 'inherit',
});

const {fragment, consumed} = fragmentize(appDir, outDir);
verify(fragment, outDir, consumed);

const distDir = join(REPO, 'artifact-dist');
mkdirSync(distDir, {recursive: true});
const outFile = join(distDir, `${appId}.html`);
writeFileSync(outFile, fragment);
console.log(`\n${outFile}\n${Buffer.byteLength(fragment)} bytes`);

/*
 * A throwaway Vite config that reuses the app's own config (plugins, aliases,
 * everything) and overrides only what the artifact target needs. Imports are
 * absolute so they resolve against the app's node_modules even though this
 * file lives in a temp dir.
 */
function artifactConfig(dir, out) {
  return `
import {mergeConfig} from ${JSON.stringify(join(dir, 'node_modules/vite/dist/node/index.js'))};
import appConfig from ${JSON.stringify(join(dir, 'vite.config.ts'))};

const base = await (typeof appConfig === 'function'
  ? appConfig({command: 'build', mode: 'production'})
  : appConfig);

// The artifact platform sets its own CSP; a meta tag from the app would only conflict.
const plugins = (base.plugins ?? []).flat(Infinity).filter(p => p && p.name !== 'widget-csp-meta');

export default mergeConfig({...base, plugins}, {
  root: ${JSON.stringify(dir)},
  base: './',
  resolve: {
    alias: {
      '@codeai-staff-apps/runtime/runtime.css': '@codeai-staff-apps/runtime/artifact.css',
    },
  },
  build: {
    outDir: ${JSON.stringify(out)},
    emptyOutDir: true,
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    cssCodeSplit: false,
    modulePreload: false,
  },
});
`;
}

function fragmentize(dir, out) {
  const source = readFileSync(join(dir, 'index.html'), 'utf8');
  const built = readFileSync(join(out, 'index.html'), 'utf8');

  const lang = match(source, /<html[^>]*\blang="([^"]*)"/, 'lang on <html>');
  const brand = match(source, /<html[^>]*\bdata-brand="([^"]*)"/, 'data-brand on <html>');
  const title = match(source, /<title>([^<]*)<\/title>/, '<title>');

  // base is './', so the emitted hrefs are relative to the output dir.
  const cssRe = /<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/;
  const jsRe = /<script[^>]+type="module"[^>]+src="([^"]+)"/;
  const cssHref = normalize(match(built, cssRe, 'stylesheet link'));
  const jsSrc = normalize(match(built, jsRe, 'module script'));
  const css = readFileSync(join(out, cssHref), 'utf8');
  const js = readFileSync(join(out, jsSrc), 'utf8');

  // </script> inside a JS string literal would end the inline block early.
  const inlineJs = js.replaceAll('</script', '<\\/script');

  const fragment = [
    `<style>\n${css}</style>`,
    '<div id="root"></div>',
    '<script type="module">',
    `document.documentElement.lang = ${JSON.stringify(lang)};`,
    `document.documentElement.dataset.brand = ${JSON.stringify(brand)};`,
    `document.title = ${JSON.stringify(title)};`,
    inlineJs.trimEnd(),
    '</script>',
    '',
  ].join('\n');

  return {fragment, consumed: ['index.html', cssHref, jsSrc]};
}

function verify(fragment, out, consumed) {
  const fetched = [...new Set([...fragment.matchAll(FETCH_POSITION)].map(m => m[1]))];
  if (fetched.length) {
    die(`fragment fetches external hosts:\n  ${fetched.join('\n  ')}`);
  }

  // Anything the build emitted but the fragment does not carry is a missed inline.
  const left = readdirSync(out, {recursive: true, withFileTypes: true})
    .filter(e => e.isFile())
    .map(e => relative(out, join(e.parentPath, e.name)))
    .filter(f => !consumed.includes(f));
  if (left.length) {
    die(`build emitted files the fragment does not inline:\n  ${left.join('\n  ')}`);
  }

  const inert = [...new Set(fragment.match(URL_RE) ?? [])];
  if (inert.length) {
    console.log(`URLs present as inert text (not fetched):\n  ${inert.join('\n  ')}`);
  }
}

function normalize(href) {
  return href.replace(/^\.\//, '');
}

function match(text, re, what) {
  const found = text.match(re);
  if (!found) {
    die(`could not find ${what}`);
  }
  return found[1];
}

function die(message) {
  console.error(message);
  process.exit(1);
}
