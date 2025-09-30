import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Proxy Supabase auth callbacks and API requests if needed for local dev
      '/.supabase': {
        target: 'http://localhost:54321',
        changeOrigin: true,
      },
      // Proxy PayPal API requests to your backend
      '/api': {
        target: 'https://paypal-integration-4lq6.onrender.com',
        changeOrigin: true,
        secure: true,
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));