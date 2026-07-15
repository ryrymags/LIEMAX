import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

// V2 app. Builds into the repo's docs/ directory, which Netlify publishes
// (netlify.toml: publish = "docs"). The canonical math engine and generated
// data bundle are imported directly from src/ — one implementation, no
// hand-mirrored browser math.
export default defineConfig({
  root: __dirname,
  plugins: [react()],
  resolve: {
    alias: {
      '@math': path.resolve(__dirname, '../src/math'),
      '@data': path.resolve(__dirname, '../src/data'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../docs'),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
});
