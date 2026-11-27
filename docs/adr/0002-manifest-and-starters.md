# ADR 0002 — Templates manifest and the starter set

Status: accepted (2026-11-27, owner t222u, t223u)

## Context

The two templates from vibecode (`vite-svelte-bun`, `vite-react-bun`) were outdated and carried a lot the projects do
not need (page contracts, block catalogues, test suites, release metadata). Many niche templates will follow, and every
new one needed a Go change in the host (an embed line and a profile).

## Decision

- Templates live in `templates/<id>/`; `templates.json` lists them with id, name, stack, description, runner and
  legacy aliases. The host embeds the folder and the manifest and builds its profiles from it; a runner (`vite-bun`)
  is the host's run profile (install, dev, build argv). A template with a known runner needs no host code.
- The set: `svelte` (default) and `react`, the same mobile-first site (header, mobile Sheet menu, dark mode, hero,
  features, CTA, footer) from UI8Kit primitives and registry blocks installed with `ui8kit@3`, data in JSON fixtures, no
  backend; the ui8kit/contract rules copied verbatim; Istok Web shipped locally; and `empty`, later a blank Vite page (since ADR 0003: a workspace with no project files).
- `vite-svelte-bun` and `vite-react-bun` are aliases of `svelte` and `react`, so projects made from them keep their
  install and preview profile. Their files stay in the git history.

## Consequences

- Adding a template: a folder, a manifest entry, a pin bump in the host. CI builds its matrix from the manifest.
- A new runner (another package manager or dev server) is an ADR and a host change.
