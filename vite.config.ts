import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  build: {
    outDir: '../dist/public', // Isso joga o resultado para a pasta que a Vercel lê
    emptyOutDir: true,
    assetsDir: 'assets', // Garante que crie a pasta assets lá dentro
  }
});