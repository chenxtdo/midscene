import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Configure Vitest (https://vitest.dev/config/)
  test: {
    setupFiles: ['./src/test-setup.ts'],
    testTimeout: 100000,
    hookTimeout: 100000,
    globals: true,
    globalSetup: ['./src/global-setup.ts'],
    globalTeardown: ['./src/global-setup.ts']
  },
  optimizeDeps: {
    include: ['@silvia-odwyer/photon']
  },
  resolve: {
    alias: {
      '@silvia-odwyer/photon': '@silvia-odwyer/photon/pkg/photon.js'
    }
  },
});
