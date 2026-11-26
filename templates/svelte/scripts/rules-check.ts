// rules:check — the UI8Kit composition rules (ui8kit/contract rules 01 to 04) this starter checks without the
// private codegen-x rules gate, over the composition zone of package.json "ui8kit" (.svelte and .tsx files):
//  - raw-native-tag: no bare lowercase HTML/SVG tags, only kit primitives (<svelte:head> etc. are allowed);
//  - raw-html / dynamic-tag: no {@html}, dangerouslySetInnerHTML, <svelte:element>, <svelte:component>;
//  - block-root (blockRoot dirs): the file opens on <Block>, at most one <Block>, never inside a loop;
//  - literal-text (hand-written files): no text nodes with letters, no literal text props (title, label, alt…);
//  - no inline style attribute; no Cyrillic in code (words live in src/fixtures and src/i18n).
// Generated files ("Code generated … DO NOT EDIT") are checked for tags, raw HTML and style only.
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"

const pkg = JSON.parse(readFileSync("package.json", "utf8"))
const zone: string[] = pkg.ui8kit.composition
const blockRoot: string[] = pkg.ui8kit.blockRoot
const EXT = /\.(svelte|tsx)$/

function files(p: string): string[] {
  if (EXT.test(p)) return [p]
  try {
    return readdirSync(p).flatMap((f) => (statSync(join(p, f)).isDirectory() ? files(join(p, f)) : EXT.test(f) ? [join(p, f)] : []))
  } catch {
    return []
  }
}

const blank = (m: string) => m.replace(/[^\n]/g, " ")
// The markup of a file: Svelte without <script> and comments; TSX without comments, strings and everything outside
// JSX (the returned tree), approximated as the text between the first `return (` / `=> (` and the file end.
function markupOf(file: string, src: string): string {
  if (file.endsWith(".svelte")) return src.replace(/<script[\s\S]*?<\/script>/g, blank).replace(/<!--[\s\S]*?-->/g, blank)
  let s = src.replace(/\/\*[\s\S]*?\*\//g, blank).replace(/(^|[^:"'`])\/\/[^\n]*/g, (m, p) => p + blank(m.slice(p.length)))
  s = s.replace(/^\s*(import|export type|type)\b[^\n]*(\n\s+[^\n]*)*?\n(?=\S|$)/gm, blank)
  const start = s.search(/(return|=>)\s*\(\s*</)
  return start < 0 ? blank(s) : blank(s.slice(0, start)) + s.slice(start)
}

const errors: string[] = []
for (const file of zone.flatMap(files)) {
  const src = readFileSync(file, "utf8")
  const markup = markupOf(file, src)
  const at = (i: number) => `${file}:${markup.slice(0, i).split("\n").length}`
  for (const m of markup.matchAll(/<([a-z][a-z0-9-]*)[\s/>]/g)) errors.push(`${at(m.index!)} raw-native-tag <${m[1]}>`)
  for (const m of markup.matchAll(/\{@html|dangerouslySetInnerHTML|<svelte:element|<svelte:component/g)) errors.push(`${at(m.index!)} raw-html/dynamic-tag ${m[0]}`)
  for (const m of markup.matchAll(/\sstyle=/g)) errors.push(`${at(m.index!)} inline style`)
  if (/[\u0400-\u04FF]/.test(src)) errors.push(`${file} Cyrillic in code (move words to src/fixtures or src/i18n)`)
  if (/Code generated .*DO NOT EDIT/.test(src.slice(0, 300))) continue
  if (blockRoot.some((d) => file === d || file.startsWith(d + "/"))) {
    const blocks = [...markup.matchAll(/<Block[\s>]/g)]
    const first = markup.match(/<([A-Za-z][\w:.-]*)/)
    if (!first || first[1] !== "Block") errors.push(`${file} block-root: the file must open on <Block>`)
    if (blocks.length > 1) errors.push(`${file} block-root: one <Block> per file`)
    for (const b of blocks) {
      const before = markup.slice(0, b.index)
      const open = (before.match(/\{#each|\.map\(/g) ?? []).length
      const closed = (before.match(/\{\/each\}|\)\)\}/g) ?? []).length
      if (open > closed) errors.push(`${at(b.index!)} block-root: <Block> inside a loop`)
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
console.log(`rules:check: composition zone clean (${zone.join(", ")})`)
