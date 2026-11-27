# ADR 0004: The Go templ starter is a pinned layer over the empty workspace

## Context

VibeChat needs a Go project template (the owner, t241u): the same runtime BuildY Chat exports as a Go templ ZIP,
[fastygo/starter](https://github.com/fastygo/starter). Hosts embed this repository with `go:embed`, and `go:embed`
cannot embed a directory that holds a `go.mod` (a nested module): the starter cannot be copied in as files. The owner
also plans templates as layers (core per framework, then data and design) over the empty workspace (t242u, t243u).

## Decision

1. `templates/templ/layer.json` (schemaVersion 1): `base: "empty"`, `source` (`github-archive`, `fastygo/starter`,
   full commit `cf9d7db…`, the paths left out), `go` (the toolchain the starter names), `files` (path → SHA-256 of
   every file) and `executables` (mode 0755). The commit is the one of BuildY Chat's `registry/templ` snapshot.
2. Runner `go-templ` (a new runner; the host change is vibechat-desktop ADR 0005): the host downloads
   `codeload.github.com/<repo>/tar.gz/<commit>`, keeps exactly the listed files, and refuses the template when any file
   is missing, extra or different. Then install `go mod download`, the dev loop `templ generate` + `go build` + run.
3. `bun scripts/templ-layer.ts` rewrites `files` from the pinned commit; `--check <dir>` compares and keeps the tree.
   CI (`templ` job) runs the check and `go vet`, `go test`, `go build` on that tree with the pinned Go.
4. `check-manifest.ts` knows `go-templ`: `layer.json` with base `empty` and a full commit, `go.mod`, `go.sum`,
   `cmd/site/main.go` listed, no `go.mod` in the folder; `--matrix` lists only the `vite-bun` starters.

## Consequences

- A new Go project needs the network once per pinned commit (hosts cache the checked tree). Moving the pin is a
  commit here (`layer.json`) and a submodule bump in the host.
- Future direction: every template becomes `base` + layers (framework core, data such as fixtures, CSS and fonts,
  design), all declared like this one; the svelte and react starters can move to the same form when their core is
  shared with BuildY Chat's exports.
