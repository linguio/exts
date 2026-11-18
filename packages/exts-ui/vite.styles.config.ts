import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    outDir: fileURLToPath(new URL('../../dist/.cache/exts-ui-css', import.meta.url)),
    emptyOutDir: true,
    lib: { entry: fileURLToPath(new URL('src/style-entry.ts', import.meta.url)), formats: ['es'], fileName: 'style-entry', cssFileName: 'styles' },
  },
});
