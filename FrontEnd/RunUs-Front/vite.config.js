import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        // target: "http://localhost:8080",
        target: "https://i11e103.p.ssafy.io:8001",
        changeOrigin: true,
        secure: false,
      },
    },
    port: 3000,
    host: true
  },
});