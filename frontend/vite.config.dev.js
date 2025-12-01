import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Development-specific Vite configuration
export default defineConfig({
  plugins: [react()],
  
  // Development server configuration
  server: {
    port: 5173,
    host: true,
    open: true,
    cors: true,
  },

  // Build configuration for development
  build: {
    outDir: 'dist-dev',
    sourcemap: true,
    minify: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },

  // Environment variables
  envPrefix: 'VITE_',
  envDir: '.',

  // Development optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios', 'date-fns'],
  },

  // Preview server (for testing builds)
  preview: {
    port: 4173,
    host: true,
  },
});