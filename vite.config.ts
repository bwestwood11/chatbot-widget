import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "esnext",
    outDir: path.resolve(__dirname, "dist"),
    rollupOptions: {
      output: {
        entryFileNames: "index.js",
        chunkFileNames: "",
        assetFileNames: "index.css",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
