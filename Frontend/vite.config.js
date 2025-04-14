import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression({ // Compress assets with gzip
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
  build: {
    target: 'es2015', // Target modern browsers
    minify: 'terser', // Use terser for better minification
    cssMinify: true, // Minify CSS
    reportCompressedSize: false, // Improve build performance
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React into its own chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Split UI libraries into their own chunk
          'ui-vendor': ['react-icons', 'react-hot-toast', 'framer-motion'],
          // Split utility libraries into their own chunk
          'util-vendor': ['axios'],
        },
      },
    },
    sourcemap: false, // Disable sourcemaps in production for better performance
  },
  server: {
    open: true, // Open browser on server start
    cors: true, // Enable CORS
    port: 5173, // Use default port
  },
  preview: {
    port: 5173, // Use same port for preview
    open: true, // Open browser on preview start
  },
});
