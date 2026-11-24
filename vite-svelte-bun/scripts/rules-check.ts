// rules:check — the UI8Kit composition rules this template can check without the private codegen-x rules gate,
// over the composition zone of package.json "ui8kit" (src/blocks, src/sections, src/App.svelte):
//  - raw-native-tag: no bare lowercase HTML/SVG tags (only kit primitives; <svelte:head> etc. are allowed);
//  - raw-html / dynamic-tag: no {@html}, no <svelte:element>, no <svelte:component>;
//  - block-root (src/sections): the file opens on <Block>, at most one <Block>, never inside {#each};
//  - literal-text (src/sections, App): no text nodes with letters, no literal text props (title, label, aria-label…);
//  - no inline style attribute; no Cyrillic in code (words live in src/content).
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"

const pkg = JSON.parse(readFileSync("package.json", "utf8"))
const zone: string[] = pkg.ui8kit.composition
const blockRoot: string[] = pkg.ui8kit.blockRoot
const generated = (src: string) => src.startsWith("<!-- Code generated")

function files(p: string): string[] {
  if (p.endsWith(".svelte")) return [p]
  try {
    return readdirSync(p).flatMap((f) => (statSync(join(p, f)).isDirectory() ? files(join(p, f)) : f.endsWith(".svelte") ? [join(p, f)] : []))
  } catch {
    return []
  }
}

const errors: string[] = []
for (const file of zone.flatMap(files)) {
  const src = readFileSync(file, "utf8")
  const markup = src.replace(/<script[\s\S]*?<\/script>/g, (m) => "\n".repeat(m.split("\n").length - 1)).replace(/<!--[\s\S]*?-->/g, "")
  const at = (i: number) => `${file}:${markup.slice(0, i).split("\n").length}`
  for (const m of markup.matchAll(/<([a-z][a-z0-9-]*)[\s/>]/g)) errors.push(`${at(m.index!)} raw-native-tag <${m[1]}>`)
  for (const m of markup.matchAll(/\{@html|<svelte:element|<svelte:component/g)) errors.push(`${at(m.index!)} raw-html/dynamic-tag ${m[0]}`)
  for (const m of markup.matchAll(/\sstyle=/g)) errors.push(`${at(m.index!)} inline style`)
  if (/[\u0400-\u04FF]/.test(src)) errors.push(`${file} Cyrillic in code (move words to src/content)`)
  if (generated(src)) continue
  if (blockRoot.some((d) => file.startsWith(d + "/"))) {
    const blocks = [...markup.matchAll(/<Block[\s>]/g)]
    const first = markup.match(/<([A-Za-z][\w:.-]*)/)
    if (!first || first[1] !== "Block") errors.push(`${file} block-root: the file must open on <Block>`)
    if (blocks.length > 1) errors.push(`${file} block-root: one <Block> per file`)
    for (const b of blocks) {
      const before = markup.slice(0, b.index)
      if ((before.match(/\{#each/g) ?? []).length > (before.match(/\{\/each\}/g) ?? []).length) errors.push(`${at(b.index!)} block-root: <Block> inside {#each}`)
    }
  }
  for (const m of markup.matchAll(/>([^<>{}]*[A-Za-z\u00C0-\u024F\u0400-\u04FF][^<>{}]*)</g)) errors.push(`${at(m.index!)} literal-text "${m[1].trim()}"`)
  for (const m of markup.matchAll(/\s(title|label|placeholder|alt|aria-label|aria-description)="([^"{}]*[A-Za-z][^"{}]*)"/g)) errors.push(`${at(m.index!)} literal-text ${m[1]}="${m[2]}"`)
}
if (errors.length) {
  console.error(errors.join("\n"))
  console.error(`rules:check: ${errors.length} finding(s); new code has a zero baseline`)
  process.exit(1)
}
console.log("rules:check: composition zone clean")
