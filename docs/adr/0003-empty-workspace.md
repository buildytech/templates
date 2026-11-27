# ADR 0003: Empty is a workspace with no project files

## Context

VibeChat imports a Svelte or React ZIP into an empty project. The previous `empty` starter shipped a blank Vite page (index.html, package.json, …). A literal “zero files” check would then hide Import ZIP.

## Decision

`empty` uses `runner: "none"`. This repository keeps only `templates/empty/.gitkeep` so git tracks the folder; hosts skip that file and create a git repository with an empty first commit. Install and the dev server do not run until the project is a Svelte or React app (ZIP import or files added). `scripts/check-manifest.ts --matrix` omits `empty`, so CI `verify` stays on the UI8Kit starters.

## Consequences

Hosts must accept a template without `package.json` when the runner is `none`, and must not write a `.gitignore` into an empty project (that would be a file). After a valid import the host switches the project to the svelte or react profile.
