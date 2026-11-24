# Vite React Bun Template

Production-oriented React 19 and TypeScript starter using Bun for dependency installation and execution with Vite, Tailwind CSS, and ui8kit.

## Requirements

- Bun 1.3.3
- Git

## Quick start

```bash
bun install --frozen-lockfile
bun run dev
```

The development server binds to `0.0.0.0:3000`. The default route does not
require credentials, a database, or any external API.

## Quality gates

```bash
bun run check:ui8kit && bun run lint && bun run test && bun run build
```

These are the same standalone checks executed by GitHub Actions.

## Architecture

- `index.html` loads the client entry at `src/main.tsx`.
- `src/App.tsx` is the application composition root.
- `src/ui/` and `src/utils/` are immutable generated ui8kit files.
- `bun.lock` is the only dependency lockfile.

## UI primitives

The ui8kit files listed in `.ui8kit-manifest.json` are generated and verified
by content digest. Do not edit them directly. Compose them from application
components, use their variants, and add product-specific code outside generated
directories.

## Configuration and deployment

The first render has no required environment variables. Build output is created
with `bun run build`. Deploy it using a platform that
supports Vite 6 + React 19; keep the runtime and lockfile versions pinned for
reproducible installs.

## Releases and security

Releases use SemVer tags and immutable commit SHAs. See `CHANGELOG.md` and
`template-release.json`. Report vulnerabilities according to `SECURITY.md`.

## License

MIT
