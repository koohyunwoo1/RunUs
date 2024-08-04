import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
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
  };
});