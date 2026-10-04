import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
    // Proxy all /api requests to the Express backend in development.
    // This keeps the Gemini API key securely on the server and avoids CORS issues.
    proxy: {
      '/api': {
        target: 'https://webxr-stem-learning-platform.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
