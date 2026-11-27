# AGENTS.md — buildytech/templates

- `templates.json` is the one list of templates: id, folder (`templates/<id>`), picker name, stack, description, runner
  (`vite-bun`: the host installs with `bun install` and runs Vite on 127.0.0.1) and legacy aliases. The picker order is
  the file order; the first entry is the default. Hosts (vibechat-server) read it at build time, so adding a template
  with a known runner needs no host code, only a pin bump. `bun scripts/check-manifest.ts` must pass.
- A template is user code: it must install offline after `bun install --frozen-lockfile` (bun.lock text format v1,
  written with the oldest supported Bun, `engines.bun` >= 1.3.3) and pass `bun run verify`.
- UI8Kit templates: [ui8kit/contract](https://github.com/ui8kit/contract) is the one source of rules; `.cursor/rules`
  and `.cursor/skills` are verbatim copies (record the contract commit in the template's AGENTS.md). Pure frontend: no
  backend, no BFF, no API calls; content in `src/fixtures/*.json`, words in `src/i18n/*.json`.
- Primitives and registry blocks change only through `bunx ui8kit add` (never by hand); `ui8kit check` stays green.
- Keep the dev server on `127.0.0.1` and the HMR client port overridable by env (`HMR_CLIENT_PORT`, `HMR_PROTOCOL`).
- `templ` (runner `go-templ`) is a layer over `empty` (ADR 0004): `layer.json` pins fastygo/starter by commit and
  SHA-256 per file; never copy the starter in (a nested `go.mod` cannot be embedded); `bun scripts/templ-layer.ts`.
- Never ship agent tool config (`.cursor/hooks.json`, `sandbox.json`, `mcp.json`).
- Every change ends with `bun run verify` green in each touched template and a clean `git diff` (CI checks both).
- Commits go to `main` (no PRs, no force pushes). A new template: a folder, an entry in `templates.json`, a line in
  README; a new runner is an ADR and a host change.
