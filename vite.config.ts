import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: '', // Não cria pasta assets
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'script.js', // Força o nome a ser script.js
        assetFileNames: 'style.css'  // Força o nome a ser style.css
      }
    }
  }
});