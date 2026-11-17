import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/marketing-con-eli/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    },
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  }
});
