import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Production-specific Vite configuration
export default defineConfig({
  plugins: [react()],
  
  // Build configuration for production
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          utils: ['axios', 'date-fns'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },

  // Environment variables
  envPrefix: 'VITE_',
  envDir: '.',

  // Production optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios', 'date-fns'],
  },

  // Preview server (for testing production builds)
  preview: {
    port: 4173,
    host: true,
  },
});