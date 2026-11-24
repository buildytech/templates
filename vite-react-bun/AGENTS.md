# Vite React Bun Template

## Stack

- Vite 6 + React 19, TypeScript, and Tailwind CSS 4.
- Bun 1.3.3 runtime and package manager.
- Generated React primitives under `src/ui/`.

## Commands

- Install: `bun install --frozen-lockfile`.
- Develop: `bun run dev`.
- Verify generated UI: `bun run check:ui8kit`.
- Lint and typecheck: `bun run lint`.
- Test: `bun run test`.
- Build: `bun run build`.
- Full gate: `bun run check:ui8kit && bun run lint && bun run test && bun run build`.

## Engineering rules

- Never edit files listed in `.ui8kit-manifest.json`.
- Put application components outside `src/ui/` and `src/utils/`.
- Keep semantic HTML, keyboard access, visible focus, and sufficient contrast.
- Keep the server bound to `0.0.0.0:3000`.
- Preserve the pinned package manager and its single lockfile.
- Do not add secrets, build output, user-specific branding, or an external
  service requirement to the default route.
- Preserve Vite foreign-host support and public HTTPS HMR configuration.

## Architecture

- `index.html` loads the client entry at `src/main.tsx`.
- `src/App.tsx` is the application composition root.
- `src/ui/` and `src/utils/` are immutable generated ui8kit files.
- `bun.lock` is the only dependency lockfile.

## UI conventions

- Compose interfaces from generated primitives and their documented variants.
- Keep product components outside generated directories.
- Preserve accessible names, keyboard behavior, focus visibility, and contrast.

## Product brief SPEC

- `.buildy/brief.json` is the portable product SPEC (`buildy.brief.v1`).
- After meaningful UI, copy, design-token, font, screen, or brick changes,
  update this file so it matches the live product.
- Keep the brief stack-agnostic: brick ids, preferred content keys, and
  design rules — not framework file paths.
- Do not invent marketing copy that is not on screen.
- Studio Export/Import Brief and rebuild-from-SPEC flows depend on this file
  staying current as the product grows.

## Constraints

- Do not add a second package manager or lockfile.
- Do not require credentials or external services on the default route.
- Keep generated files immutable and the development port stable.
- Keep `.buildy/brief.json` aligned with the shipped product surface.

## Definition of done

- The full gate passes from a clean clone.
- The default route renders without browser console errors.
- Generated ui8kit verification passes with no modified manifest-owned files.
- `.buildy/brief.json` reflects the current product identity, screens, and
  design after the change.
