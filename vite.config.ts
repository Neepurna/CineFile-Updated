// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy configuration for TMDB images
      '/image-proxy': {
        target: 'https://image.tmdb.org/t/p/original', // TMDB base URL
        changeOrigin: true, // Changes the origin of the host header to the target URL
        rewrite: (path) => path.replace(/^\/image-proxy/, ''), // Rewrites the URL to remove the "/image-proxy" prefix
      },
    },
  },
});
