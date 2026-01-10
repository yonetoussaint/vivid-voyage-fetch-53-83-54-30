import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import { nodePolyfills } from 'rollup-plugin-polyfill-node';

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
      // Polyfills for Transformers.js
      "util": "rollup-plugin-polyfill-node/polyfills/util",
      "sys": "util",
      "events": "rollup-plugin-polyfill-node/polyfills/events",
      "stream": "rollup-plugin-polyfill-node/polyfills/stream",
      "path": "rollup-plugin-polyfill-node/polyfills/path",
      "querystring": "rollup-plugin-polyfill-node/polyfills/qs",
      "punycode": "rollup-plugin-polyfill-node/polyfills/punycode",
      "url": "rollup-plugin-polyfill-node/polyfills/url",
      "string_decoder": "rollup-plugin-polyfill-node/polyfills/string-decoder",
      "http": "rollup-plugin-polyfill-node/polyfills/http",
      "https": "rollup-plugin-polyfill-node/polyfills/http",
      "os": "rollup-plugin-polyfill-node/polyfills/os",
      "assert": "rollup-plugin-polyfill-node/polyfills/assert",
      "constants": "rollup-plugin-polyfill-node/polyfills/constants",
      "_stream_duplex": "rollup-plugin-polyfill-node/polyfills/readable-stream/duplex",
      "_stream_passthrough": "rollup-plugin-polyfill-node/polyfills/readable-stream/passthrough",
      "_stream_readable": "rollup-plugin-polyfill-node/polyfills/readable-stream/readable",
      "_stream_transform": "rollup-plugin-polyfill-node/polyfills/readable-stream/transform",
      "_stream_writable": "rollup-plugin-polyfill-node/polyfills/readable-stream/writable",
      "process": "rollup-plugin-polyfill-node/polyfills/process-es6",
      "buffer": "rollup-plugin-polyfill-node/polyfills/buffer-es6",
      "crypto": "rollup-plugin-polyfill-node/polyfills/crypto-browserify"
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
        nodePolyfills()
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