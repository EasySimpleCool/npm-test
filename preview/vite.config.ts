import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@easysimplecool/design-system': resolve(__dirname, '../src/index.ts'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
