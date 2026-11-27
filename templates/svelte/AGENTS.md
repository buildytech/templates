# AGENTS.md — Svelte 5 starter

A pure frontend site: Vite 8, Svelte 5, Tailwind 4, UI8Kit primitives, Bun. No backend, no BFF, no API calls, no
server state. Data is plain JSON, words are a dictionary. Keep it that way unless the owner asks otherwise.

## Rules

`.cursor/rules` and `.cursor/skills` are a verbatim copy of [ui8kit/contract](https://github.com/ui8kit/contract)
(commit `5611b44`). Do not edit them here; to update, copy both folders from the contract again.

- Only UI8Kit primitives with the `tag` retag (`Block tag="section"`, `Text tag="span"`, `Title as={2}`); no bare
  HTML tags, no raw HTML, no dynamic tags, no inline `style`.
- Every file in `src/sections`, `src/layouts` and `App.svelte` opens on one `Block`; a second landmark is its own file.
- Texts come from `src/fixtures/*.json` (content) and `src/i18n/en.json` (interface words), never literals in markup.
- Colors via tokens (`bg-background`, `text-muted-foreground`), icons Lucide, spacing on the 8+4 grid (even steps in
  blocks and layouts, no half steps, no `[..]` values).
- Valid HTML5 and ARIA: one `main` per page, named landmarks and dialogs, ARIA state only through primitive props.

## Where things are

| Path | What | Edit |
| --- | --- | --- |
| `src/fixtures/*.json` | page content: brand, navigation, hero, features, call to action, footer | yes |
| `src/i18n/en.json` | ui dictionary (`{ locale, messages }`) | yes |
| `src/app/content.ts` | typed access to fixtures and the dictionary | yes |
| `src/app/theme.ts`, `src/app/modal.ts` | dark mode storage and the native `<dialog>` modal, framework-free; the state lives in `src/layouts/site-header` and reaches ARIA only through Button `pressed` / `expanded` | yes |
| `src/app/icons.ts` | the Lucide glyphs the site uses (add one here before using its name) | yes |
| `src/app.css` | brand layer: Istok Web as the sans font, dark colour scheme | yes |
| `src/layouts` | page frame: `site-header` (nav, toggle, Sheet), `page-main` | yes, 8+4 |
| `src/sections` | project blocks (`feature-cards`) | yes, 8+4 |
| `src/blocks`, `src/components`, `src/compose`, `src/kit`, `src/icons`, `src/utils`, `src/presets`, `src/styles` | installed by the ui8kit CLI | **never by hand** |
| `src/assets/fonts` | Istok Web woff2 (SIL OFL 1.1, `istok-web/OFL.txt`) | no |
| `public` | favicon (svg, ico, apple-touch), web manifest, hero pictures | yes |

Add a primitive or a registry block: `bunx ui8kit add <name>` (`bunx ui8kit list` shows the registry). Never edit
installed files; `bun run check:ui8kit` fails on any change.

## Checks

```sh
bun install
bun run dev        # http://127.0.0.1:5173
bun run verify     # ui8kit check, rules:check, lint:px (ui8px 8+4, max 0), svelte-check, build
```

`rules:check` (scripts/rules-check.ts): bare tags, raw HTML, inline style, Block root, literal text, Cyrillic in code,
reactive ARIA in markup and imperative ARIA (`setAttribute("aria-…")`, `data-ui8kit*`) in any script outside the kit zone.
`lint:px` (scripts/ui8px-gate.ts): mirrors the class sets of `src/blocks`, `src/sections`, `src/layouts` into
`.ui8px/extract` and runs `ui8px lint` against `.ui8px/policy` (`.ui8px/gate.json`: max 0). New code keeps a zero
baseline.

## Interactive state

State (dark mode, the open menu) is framework state (`$state` / `useState` in `src/layouts/site-header`) and reaches
ARIA only through primitive props: `Button pressed` (aria-pressed), `Button expanded` (aria-expanded), the Sheet's
`onclose`. Scripts never write `aria-*` or `data-ui8kit*` on the DOM (contract rule 02). The kit's `ThemeToggle`,
`SheetTrigger` and `SheetClose` composites print static ARIA for script-driven runtimes and take no state prop, so
this starter uses `Button` + `LucideIcon` instead.

## Host contract

The BuildY host installs with `bun install` and runs `bun x vite --host 127.0.0.1 --port <port> --strictPort` with
`HMR_CLIENT_PORT` / `HMR_PROTOCOL` for its preview proxy. Keep the `server` block of `vite.config.ts` and Bun as
the only package manager (`bun.lock`).
