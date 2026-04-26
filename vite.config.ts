import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/imax-csv': {
        target: 'https://raw.githubusercontent.com/r-imax/imaxguide/main/data',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/imax-csv\/?/, '/'),
      },
    },
  },
  build: {
    outDir: 'dist',
    target: 'es2020',
  },
});
