import {cspMeta, widgetBase} from '@codeai-staff-apps/runtime/vitePreset.mjs';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

import appMeta from './app.json';

export default defineConfig({
  base: widgetBase(appMeta.id),
  plugins: [react(), cspMeta()],
});
