// Emits the gallery manifest (JSON array of apps/*/app.json) to stdout.
// CI runs: node scripts/gen-manifest.mjs > gallery/src/manifest.json
import {readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';

const appsDir = new URL('../apps', import.meta.url).pathname;
const entries = readdirSync(appsDir, {withFileTypes: true})
  .filter(d => d.isDirectory())
  .map(d => JSON.parse(readFileSync(join(appsDir, d.name, 'app.json'), 'utf8')))
  .sort((a, b) => a.name.localeCompare(b.name));

process.stdout.write(JSON.stringify(entries, null, 2) + '\n');
