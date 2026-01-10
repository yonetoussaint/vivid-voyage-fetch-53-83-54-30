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
      // Fix for onnxruntime-web - tell Vite to treat it as external
      'onnxruntime-web': path.resolve(__dirname, './src/utils/onnx-shim.js'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
    commonjsOptions: {
      transformMixedEsModules: true
    },
    rollupOptions: {
      // Mark onnxruntime-web as external so it's not bundled
      external: ['onnxruntime-web'],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@xenova')) {
            return 'transformers';
          }
        }
      }
    }
  },
  define: {
    global: 'globalThis',
  },
  // Optimize dependencies to exclude onnxruntime-web
  optimizeDeps: {
    exclude: ['onnxruntime-web']
  }
}));