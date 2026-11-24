import { fileURLToPath, URL } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const hmrProtocol = process.env.HMR_PROTOCOL

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: true,
    hmr: {
      clientPort: Number(process.env.HMR_CLIENT_PORT ?? 443),
      ...(hmrProtocol === "ws" || hmrProtocol === "wss"
        ? { protocol: hmrProtocol }
        : {}),
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
  },
})
