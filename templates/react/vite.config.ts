import tailwindcss from "@tailwindcss/vite"
import { fileURLToPath } from "node:url"
import { defineConfig, type Plugin } from "vite"
import react from "@vitejs/plugin-react"

// The host runs the dev server on 127.0.0.1 with --port and shows it through its preview proxy: HMR_CLIENT_PORT is
// the proxy port the browser talks to (HMR_PROTOCOL ws | wss). Without them Vite's defaults apply.
const hmrPort = process.env.HMR_CLIENT_PORT ? Number(process.env.HMR_CLIENT_PORT) : undefined
const hmrProtocol = process.env.HMR_PROTOCOL

// The kit's icon registry imports every Lucide glyph (`icons` of lucide); give it the project's own set instead
// (src/app/icons.ts), so the bundle carries only the glyphs the site uses.
const iconSet = fileURLToPath(new URL("./src/app/icons.ts", import.meta.url))
const lucideSubset = (): Plugin => ({
  name: "lucide-subset",
  enforce: "pre",
  resolveId(source, importer) {
    if (source === "lucide" && importer && /[\\/]icons[\\/]lucide-icons\.tsx?$/.test(importer)) return iconSet
    return null
  },
})

export default defineConfig({
  plugins: [lucideSubset(), react(), tailwindcss()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    allowedHosts: true,
    hmr: {
      ...(hmrPort ? { clientPort: hmrPort } : {}),
      ...(hmrProtocol === "ws" || hmrProtocol === "wss" ? { protocol: hmrProtocol } : {}),
    },
  },
  preview: { host: "127.0.0.1", port: 4173 },
})
