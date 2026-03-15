import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove all console.log in production
        drop_debugger: true,
        pure_funcs: [
          "console.log",
          "console.error",
          "console.warn",
          "console.info",
          "console.debug",
        ],
      },
    },
    sourcemap: false, // Disable sourcemaps in production
  },
});
