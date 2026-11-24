# templates

Project templates of [BuildY Studio](https://github.com/buildytech/studio). Each folder is a complete standalone app
with its own pinned Bun version, lockfile and `bun run verify`. The hosts copy a folder as the first commit of a new
project: [vibechat-desktop](https://github.com/buildytech/vibechat-desktop) embeds them through the git submodule
`third_party/templates`; the cloud host will take the same submodule.

| Template | Stack | `verify` runs |
| --- | --- | --- |
| [`vite-svelte-bun`](vite-svelte-bun) (default) | Vite 8, Svelte 5, Tailwind 4, UI8Kit blocks, Bun 1.4 | `ui8kit check`, page contract, `rules:check`, ui8px 8+4 gate (`lint:px`, max 0), `svelte-check`, `bun test`, build |
| [`vite-react-bun`](vite-react-bun) | Vite, React 19, Tailwind 4, UI8Kit primitives, Bun 1.3 | ui8kit manifest check, oxlint + `tsc`, vitest, build |

```bash
cd vite-svelte-bun   # or vite-react-bun
bun install --frozen-lockfile
bun run verify
```

## Rules

UI8Kit rules come from [ui8kit/contract](https://github.com/ui8kit/contract) (`AGENTS.md`, `.cursor/rules`,
`.cursor/skills`); `vite-svelte-bun` carries a copy. See [AGENTS.md](AGENTS.md) and [ADR 0001](docs/adr/0001-templates-repository.md).

## Host profile

A host needs, per template: the install command (`bun install`, run by the host outside the agent sandbox), the dev
command (`bun x vite --host 127.0.0.1 --port {port} --strictPort`) and the HMR client port env
(`HMR_CLIENT_PORT`, `HMR_PROTOCOL`) for a preview proxy. The profiles live in the host (vibechat-desktop
`templates.go`), not here.

## License

MIT, © 2026 BuildY. Each template carries its own `LICENSE` for the projects made from it.
