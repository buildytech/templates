# AGENTS.md — buildytech/templates

- Two templates only: `vite-svelte-bun` (default) and `vite-react-bun`. A new template is an ADR first.
- A template is user code: it must build offline after `bun install --frozen-lockfile` and pass `bun run verify`.
- UI8Kit rules: [ui8kit/contract](https://github.com/ui8kit/contract) is the one source (rules 00 to 05). Prototypes
  (`src/blocks`, `src/sections`) follow 8+4 through ui8px; texts come from `src/content` / fixtures; no bare tags.
- Primitives and blocks change only through `npx ui8kit@3 add` (never by hand); `ui8kit check` must stay green.
- Keep the dev server on `127.0.0.1` and the HMR client port overridable by env (the host's preview proxy).
- Every change ends with `bun run verify` green in each touched template and a clean `git diff` (CI checks both).
- Commits go to `main` (no PRs, no force pushes).
