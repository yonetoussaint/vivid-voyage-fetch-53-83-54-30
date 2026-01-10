import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true,
  },
  plugins: [
    react(),
    nodePolyfills({
      include: ['path', 'stream', 'util', 'crypto', 'buffer', 'process'],
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
      // Use the actual installed package
      'onnxruntime-web': path.resolve(__dirname, 'node_modules/onnxruntime-web'),
    },
  },
  build: {
    target: 'es2020', // Important for WASM support
    chunkSizeWarningLimit: 1500,
    commonjsOptions: {
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@xenova')) {
            return 'transformers';
          }
          if (id.includes('node_modules/onnxruntime-web')) {
            return 'onnxruntime';
          }
        }
      }
    }
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    // Exclude heavy libraries from optimization
    exclude: ['@xenova/transformers', 'onnxruntime-web'],
    esbuildOptions: {
      target: 'es2020'
    }
  }
}));