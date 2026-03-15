import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    // Remove terser options if you don't need them
    minify: "esbuild", // Use esbuild instead of terser (faster, built-in)
    // Or if you want to keep terser:
    // minify: 'terser',
    // terserOptions: {
    //   compress: {
    //     drop_console: true,
    //     drop_debugger: true
    //   }
    // }
  },
});
