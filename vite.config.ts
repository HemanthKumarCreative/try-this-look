import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { copyFileSync } from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger(),
    // Copy widget script to dist after build
    {
      name: "copy-widget-script",
      closeBundle() {
        try {
          copyFileSync(
            path.resolve(__dirname, "public/nusense-tryon-widget.js"),
            path.resolve(__dirname, "dist/nusense-tryon-widget.js")
          );
        } catch (error) {
          console.warn("Widget script copy failed:", error);
        }
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
    },
  },
}));
