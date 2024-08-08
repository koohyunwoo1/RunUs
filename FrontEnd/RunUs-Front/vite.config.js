
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          //target: "http://localhost:8080",
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
      port: 3000,
      host: true
    },
    define: {
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL)
    },
    build: {
      rollupOptions: {
        input: {
          app: './index.html',
          // 'firebase-messaging-sw': './public/firebase-messaging-sw.js',
        },
      },
    }
  };
});
