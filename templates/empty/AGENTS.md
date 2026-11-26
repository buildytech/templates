# AGENTS.md — empty template

A blank page on Vite and Bun: `index.html`, `src/main.ts`, nothing else. No framework, no CSS, no rules: add what the
project needs. Keep the `server` block of `vite.config.ts` (the host runs `bun x vite --host 127.0.0.1 --port <port>
--strictPort` with `HMR_CLIENT_PORT` / `HMR_PROTOCOL`) and Bun as the package manager (`bun.lock`).

```sh
bun install
bun run dev
bun run verify   # build
```
