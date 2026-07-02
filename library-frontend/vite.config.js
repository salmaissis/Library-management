import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // The Spring Boot backend does not currently define a CORS policy,
    // so in development we proxy /api requests to avoid CORS errors.
    // See src/services/axiosInstance.js for the corresponding baseURL.
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
