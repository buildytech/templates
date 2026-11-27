# templates

Project templates of [BuildY](https://github.com/buildytech). Each folder under `templates/` is a complete standalone
app with its own pinned Bun version, lockfile and `bun run verify`. `templates.json` lists them (picker order, first is
the default). The hosts copy a folder as the first commit of a new project:
[vibechat-desktop](https://github.com/buildytech/vibechat-desktop) embeds this repository through the git submodule
`server/third_party/templates` and reads `templates.json`.

| Id | Stack | What |
| --- | --- | --- |
| [`svelte`](templates/svelte) (default) | Vite 8, Svelte 5, Tailwind 4, UI8Kit, Bun | mobile-first site: header, mobile Sheet menu, dark mode, hero, features, CTA, footer; JSON fixtures; Istok Web; ui8kit/contract rules |
| [`react`](templates/react) | Vite 8, React 19, Tailwind 4, UI8Kit, Bun | the same site with the same DOM and ARIA |
| [`templ`](templates/templ) | Go 1.27, templ, PocketBase, Tailwind 4, UI8Kit | [fastygo/starter](https://github.com/fastygo/starter) at a pinned commit, as a checked layer over `empty` (`layer.json`, ADR 0004); the same runtime as BuildY Chat's Go templ export |
| [`empty`](templates/empty) | Blank workspace | no project files (only `.gitkeep` in this repo so git keeps the folder); hosts create a git repo with an empty first commit. Import a Svelte, React or Go templ ZIP, or add files |

```bash
cd templates/svelte   # or react
bun install --frozen-lockfile
bun run verify
```

`verify` of the UI8Kit starters: `ui8kit check` (installed primitives unchanged), `rules:check` (no bare tags, raw HTML,
inline style or literal text; Block root), `lint:px` (ui8px 8+4 gate, max 0), type check, build.

## Adding a template

1. `templates/<id>/` with `package.json` (`verify`, `engines.bun`), `bun.lock` (format v1), `.bun-version`,
   `AGENTS.md`, `LICENSE`, `index.html`, `vite.config.ts` (dev server on 127.0.0.1, HMR port from env).
2. An entry in `templates.json` (`runner: "vite-bun"`); `bun scripts/check-manifest.ts`.
3. CI picks it up from the manifest (`--matrix` lists only templates with a runner that can `verify`). The host gets it with the next submodule pin.

The `empty` template is the exception: `runner: "none"`, no project files. The folder keeps only `.gitkeep` so git tracks it; hosts skip that file and make an empty first commit. Install and the dev server do not run until the project has a Svelte or React app (ZIP import or files added).

See [AGENTS.md](AGENTS.md), [ADR 0001](docs/adr/0001-templates-repository.md) and
[ADR 0002](docs/adr/0002-manifest-and-starters.md), [ADR 0004](docs/adr/0004-go-templ-layer.md).

## License

MIT, © 2026 BuildY. Each template carries its own `LICENSE` for the projects made from it. Istok Web: SIL OFL 1.1.
