/*
 * Refreshes src/snapshot/ from the live review data: `npm run snapshot`.
 *
 * The snapshot is the app's offline fallback. Where the page cannot reach the
 * image host (the Claude artifact preview, or Pages before its CSP allows the
 * host) the app shows these manifests instead. It is not the source of truth.
 */
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const appDir = new URL('..', import.meta.url);
const config = readFileSync(new URL('src/config.ts', appDir), 'utf8');
const base = config.match(/IMAGEGEN_BASE_URL =\s*'([^']+)'/)[1];
const indexPath = config.match(/INDEX_PATH = '([^']+)'/)[1];

const outDir = new URL('src/snapshot/', appDir);
mkdirSync(outDir, {recursive: true});

const getJson = async path => {
  const response = await fetch(base + path);
  if (!response.ok) {
    throw new Error(`${response.status} for ${path}`);
  }
  return response.json();
};
const write = (name, data) => {
  const text = JSON.stringify(data);
  writeFileSync(new URL(`${name}.json`, outDir), text + '\n');
  console.log(`${name}.json  ${text.length} bytes`);
};

const {bases, ...index} = await getJson(indexPath);
write('index', index);
for (const {sentenceId, manifest} of index.sentences) {
  const {bases, bucket, version, ...rest} = await getJson(manifest);
  write(sentenceId, rest);
}
console.log(`snapshot of ${base} written to ${fileURLToPath(outDir)}`);
