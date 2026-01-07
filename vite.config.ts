import { defineConfig } from 'vite';

export default defineConfig({
  root: './', // Define que o index.html está na raiz
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
  },
});