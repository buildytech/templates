# Vite Svelte Bun template (UI8Kit)

A landing page on Svelte 5, Vite 8, Tailwind CSS 4 and Bun, built from UI8Kit primitives and registry blocks.
The UI8Kit rules are in `.cursor/rules` (copied from github.com/ui8kit/contract); this file maps them to the checks
of this project.

## How the page is made

- `src/content/page.json` is the page contract (page-spec/v2 of `@ui8kit/contract`): `locale`, `title`, `seo` and
  `blocks: [{ id, item, props }]`, where `item` is an installed registry block and `props` are exactly its props
  (`contracts/blocks.json`, generated from `src/blocks`). **Every visible word lives here** or in
  `src/content/ui.json` (the interface dictionary). Change the page by editing these two files first.
- Write the texts in the language of the request and set `locale` (BCP 47, e.g. `ru`, `en`) in both files.
- Installed blocks (`src/blocks`, generated, never edit): `header-simple`, `hero-simple`, `features-simple`,
  `steps-simple`, `stats-simple`, `logos-simple`, `pricing-simple`, `testimonials-simple`, `team-simple`,
  `faq-simple`, `newsletter-form`, `cta-simple`, `footer-simple`. Their props and layout axes (`align`, `cols`,
  `layout`, `surface`, `padding`, `media` …) are listed in `contracts/blocks.json`. Prefer them.
- `src/App.svelte` renders the header, `src/sections/page-main.svelte` (the `main` landmark, the blocks in order),
  the footer and the theme switch (`src/sections/theme-switch.svelte`, dark mode).
- A section no block covers: a new file in `src/sections/`, rooted on one `<Block tag="section">`, built only from
  the kit in `src/compose` (`Container`, `Stack`, `Group`, `Grid`, `Card`, `Title`, `Text`, `Badge`, `LinkButton`,
  `List`/`ListItem`, `Icon`…), words through props from `src/content`. Render it from `page-main.svelte`.

## Rules (short; full text in `.cursor/rules`)

- No bare HTML tags anywhere in `src/blocks`, `src/sections`, `App.svelte`: only kit primitives, retag with
  `tag` (`Block tag="section"`), headings `Title as={2}`. No `{@html}`, no dynamic tags or components.
- One `Block` per file, never nested or inside `{#each}`; one `main` per page (`page-main.svelte`).
- Spacing 8+4: even Tailwind steps (`gap-4`, `p-6`, `py-16`); odd steps only inside controls; no half steps, no
  `[..]` values. Colors only through tokens (`bg-background`, `text-muted-foreground`, `bg-primary`), never palette
  classes or hex. Icons: Lucide through the kit. No inline `style`. No literal text in markup.
- Never edit generated files: `src/blocks`, `src/compose`, `src/kit`, `src/utils`, `src/icons`, `src/presets`,
  `src/components`, `src/styles` (`ui8kit check` verifies them against `ui8kit.lock.json`).

## Commands

- `bun run verify`: everything below in order; it must be green before you finish.
- `bun run check:ui8kit` (generated files unchanged), `bun run contract:validate` (page + dictionary),
  `bun run rules:check` (tags, Block root, literal text), `bun run lint:px` (ui8px 8+4 gate, max 0),
  `bun run check` (svelte-check), `bun run test`, `bun run build`.

## Constraints

- The network is closed for the agent and dependencies are installed by the host: do not run `bun add`,
  `bun install`, `npx ui8kit add` or any download. Work with what is installed.
- Do not start the dev server; the host runs the preview. Do not add a second lockfile.
- Keep `.buildy/brief.json` (product brief, `buildy.brief.v1`) in line with the page after meaningful changes.
