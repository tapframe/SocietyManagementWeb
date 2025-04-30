import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests starting with /api to the backend server
      '/api': {
        target: 'http://localhost:5000', // Your backend server address (running on port 5000)
        changeOrigin: true,
        secure: false, // Assuming backend is running on http
      },
    },
  },
}); 