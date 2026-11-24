# ADR 0001 — Project templates in their own public repository

Status: accepted (2026-11-24, owner t151u)

## Context

The templates lived in the private `buildytech/vibecode` monorepo with ten stacks. The desktop host embedded two of
them through a submodule of that private repo, so the public desktop CI could not clone it. The owner kept only the
Vite React and Vite Svelte stacks.

## Decision

- `buildytech/templates` (public, MIT) holds `vite-svelte-bun` and `vite-react-bun`, copied from vibecode `f0546ed`
  with a clean history.
- Hosts (desktop now, cloud later) take this repo as a git submodule pinned by commit and own the run profile.
- CI runs `bun run verify` for each template and fails on generated drift.

## Consequences

- The desktop CI no longer needs a token for a private submodule.
- A template change reaches a host only by moving the pin.
- The other eight vibecode templates are not carried over.
