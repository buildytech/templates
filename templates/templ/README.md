# templ (Go)

A layer over the [empty](../empty) workspace: [fastygo/starter](https://github.com/fastygo/starter) (Go 1.27, templ,
PocketBase, Tailwind 4, UI8Kit templ registry; presets blog, corporate, shop) at the commit pinned in
[`layer.json`](layer.json), the same commit BuildY Chat's Go templ export uses (`registry/templ` in buildytech/chat).

`layer.json` lists every file of the starter at that commit with its SHA-256 (`.github/`, `bin/`, `pb_data/`,
`vendor/` left out). A host downloads the GitHub archive of the commit and writes the project only when every file
matches; nothing of the starter is copied into this repository (it is a Go module, which `go:embed` of a host cannot
embed). Rewrite after moving the pin: `bun scripts/templ-layer.ts`; CI checks it with `--check` and builds the tree.

Runner `go-templ`: the host runs `go mod download`, then `go tool templ generate`, `go build ./cmd/site` and
`site dev --http 127.0.0.1:<port>` in its jail, and rebuilds on change. See [ADR 0004](../../docs/adr/0004-go-templ-layer.md).
