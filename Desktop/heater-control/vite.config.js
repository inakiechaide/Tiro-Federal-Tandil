import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0', // Hace que el servidor sea accesible en la red local
    strictPort: true,
    hmr: {
      host: 'localhost',
      port: 3000,
      protocol: 'ws',
      overlay: false
    },
    watch: {
      usePolling: true,
      interval: 100
    }
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['@chakra-ui/react', 'framer-motion'],
    force: true
  }
});
