import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true,
    proxy: {
      // Proxy Supabase auth callbacks and API requests if needed for local dev
      '/.supabase': {
        target: 'http://localhost:54321',
        changeOrigin: true,
      }
    }
  },
  plugins: [
    react(),
    // Polyfills for Transformers.js and other Node.js modules
    nodePolyfills({
      include: [
        'path',
        'stream',
        'util',
        'crypto',
        'buffer',
        'process',
        'events',
        'os',
        'assert',
        'url',
        'querystring'
      ],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: [
        // Mark these as external to prevent bundling issues
        'onnxruntime-web'
      ]
    },
    // Increase chunk size for AI models
    chunkSizeWarningLimit: 1500,
    // Optimize for Transformers.js
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  define: {
    // Global definitions for Transformers.js
    global: 'globalThis',
    'process.env': {},
    'process.versions': {},
    'process.platform': 'browser',
    'process.browser': true
  }
}));