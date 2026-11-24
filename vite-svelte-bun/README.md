# Vite Svelte Bun template

Svelte 5 + Vite 8 + Tailwind CSS 4 on Bun, with UI8Kit primitives and blocks (`npx ui8kit@3 init --framework
svelte`, `npx ui8kit@3 add …`) and the UI8Kit rules (`.cursor/rules`, from github.com/ui8kit/contract).

```bash
bun install
bun run dev      # http://127.0.0.1:3000
bun run verify   # ui8kit check, contract, rules, ui8px 8+4, svelte-check, tests, build
```

The page is `src/content/page.json` (page-spec/v2 of `@ui8kit/contract`) and `src/content/ui.json`. See
`AGENTS.md`. Adding a registry block: `npx ui8kit@3 add <block>`, then `bun run gen:contracts` and a renderer in
`src/sections/page-main.svelte`.
