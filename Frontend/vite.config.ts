import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 80, // Run on port 80
    host: true, // Allows access from network
    strictPort: true, // Ensures Vite fails if port 80 is unavailable
    allowedHosts: ['sabdamanthan.srijangyawali.com'], 
  },
});
