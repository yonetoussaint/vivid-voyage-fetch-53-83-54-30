import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  base: "/",
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true,
  },
  plugins: [
    react(),
    nodePolyfills({
      include: ["path", "stream", "util", "crypto", "buffer", "process"],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Truck Management App",
        short_name: "TruckApp",
        description: "Offline truck service management system",
        theme_color: "#000000",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,wasm}"],
      },
    }),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "onnxruntime-web": path.resolve(
        __dirname,
        "node_modules/onnxruntime-web"
      ),
    },
  },
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 1500,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/@xenova")) {
            return "transformers";
          }
          if (id.includes("node_modules/onnxruntime-web")) {
            return "onnxruntime";
          }
        },
      },
    },
  },
  define: {
    global: "globalThis",
  },
  optimizeDeps: {
    exclude: ["@xenova/transformers", "onnxruntime-web"],
    esbuildOptions: {
      target: "es2020",
    },
  },
}));