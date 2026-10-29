import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { readProjectVersion } from '../../scripts/version.mjs';

readProjectVersion();

export default defineConfig({
  root: fileURLToPath(new URL('./src/entrypoints', import.meta.url)),
  publicDir: fileURLToPath(new URL('./public', import.meta.url)),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  cacheDir: fileURLToPath(new URL('../../dist/.cache/website/vite', import.meta.url)),
  build: {
    outDir: fileURLToPath(new URL('../../dist/build/exts-web', import.meta.url)),
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        home: fileURLToPath(new URL('./src/entrypoints/index.html', import.meta.url)),
        changelog: fileURLToPath(new URL('./src/entrypoints/changelog/index.html', import.meta.url)),
        features: fileURLToPath(new URL('./src/entrypoints/features/index.html', import.meta.url)),
      },
    },
  },
});
