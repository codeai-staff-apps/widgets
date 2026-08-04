import {cspMeta} from '@codeai-staff-apps/runtime/vitePreset.mjs';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

export default defineConfig({
  base: '/widgets/',
  plugins: [react(), cspMeta()],
});
