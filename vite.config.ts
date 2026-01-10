import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

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
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      // Polyfills for Transformers.js
      "util": "rollup-plugin-node-polyfills/polyfills/util",
      "sys": "util",
      "events": "rollup-plugin-node-polyfills/polyfills/events",
      "stream": "rollup-plugin-node-polyfills/polyfills/stream",
      "path": "rollup-plugin-node-polyfills/polyfills/path",
      "querystring": "rollup-plugin-node-polyfills/polyfills/qs",
      "punycode": "rollup-plugin-node-polyfills/polyfills/punycode",
      "url": "rollup-plugin-node-polyfills/polyfills/url",
      "string_decoder": "rollup-plugin-node-polyfills/polyfills/string-decoder",
      "http": "rollup-plugin-node-polyfills/polyfills/http",
      "https": "rollup-plugin-node-polyfills/polyfills/http",
      "os": "rollup-plugin-node-polyfills/polyfills/os",
      "assert": "rollup-plugin-node-polyfills/polyfills/assert",
      "constants": "rollup-plugin-node-polyfills/polyfills/constants",
      "_stream_duplex": "rollup-plugin-node-polyfills/polyfills/readable-stream/duplex",
      "_stream_passthrough": "rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough",
      "_stream_readable": "rollup-plugin-node-polyfills/polyfills/readable-stream/readable",
      "_stream_transform": "rollup-plugin-node-polyfills/polyfills/readable-stream/transform",
      "_stream_writable": "rollup-plugin-node-polyfills/polyfills/readable-stream/writable",
      "process": "rollup-plugin-node-polyfills/polyfills/process-es6",
      "buffer": "rollup-plugin-node-polyfills/polyfills/buffer-es6",
      "crypto": "rollup-plugin-node-polyfills/polyfills/crypto-browserify"
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true
        }),
        NodeModulesPolyfillPlugin()
      ]
    }
  },
  build: {
    rollupOptions: {
      plugins: [
        // Enable rollup polyfills
        rollupNodePolyFill()
      ],
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