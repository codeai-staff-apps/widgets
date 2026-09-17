import {defineConfig} from 'vitest/config';

/**
 * Deliberately standalone (not the app's vite.config.ts): the tests below are
 * pure-function unit tests with no DOM and no components, so they don't need
 * the app's React plugin, CSP injection, or base-path config.
 */
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
