import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: '', // Isso impede a criação da pasta /assets/
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Isso impede o Vite de colocar números aleatórios no nome dos arquivos
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      }
    }
  }
});