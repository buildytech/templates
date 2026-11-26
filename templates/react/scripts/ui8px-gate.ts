// lint:px — the 8+4 spacing gate (ui8px) for the blocks and layouts layers: registry blocks (src/blocks), project
// blocks (src/sections) and the page frame (src/layouts). ui8px reads .html, not .svelte / .tsx, so the class sets
// are mirrored first (as codegen-x/ui8kit ui8px-extract.mjs does): every static class="..." / className="..." and
// every class-list string becomes one <i data-src class> in .ui8px/extract/<dir>/<file>.html. Then `ui8px lint`
// runs on the extract and the gate fails over .ui8px/gate.json `max` (0) on the blocking rules, plus GRID:
// arbitrary [..] spacing values.
import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

const SOURCES = ["src/blocks", "src/sections", "src/layouts"]
const EXT = /\.(svelte|tsx)$/
const OUT = ".ui8px/extract"
const gate = JSON.parse(readFileSync(".ui8px/gate.json", "utf8")) as { max: number; blocking: string[] }

const TOKEN = /^[!-]?[a-z][a-z0-9:/._%[\]()#-]*$/
const looksLikeClasses = (s: string) => {
  const parts = s.trim().split(/\s+/).filter(Boolean)
  return parts.length > 0 && parts.every((p) => TOKEN.test(p)) && parts.some((p) => p.includes("-") || p.includes(":"))
}
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")

function files(dir: string): string[] {
  try {
    return readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? files(join(dir, f)) : EXT.test(f) ? [join(dir, f)] : []))
  } catch {
    return []
  }
}

rmSync(OUT, { recursive: true, force: true })
const sets: { file: string; classes: string }[] = []
for (const file of SOURCES.flatMap(files)) {
  const src = readFileSync(file, "utf8")
  const found = new Set<string>()
  for (const m of src.matchAll(/\b(?:class|className)="([^"{}]*)"/g)) found.add(m[1])
  for (const m of src.matchAll(/"([^"\n]{2,})"/g)) {
    // Skip values of other attributes (id, data-slot, controls…) and string concatenations (`id + "-title"`).
    const before = src.slice(Math.max(0, m.index! - 40), m.index!)
    const after = src.slice(m.index! + m[0].length, m.index! + m[0].length + 3)
    const attr = before.match(/([\w:-]+)=\{?$/)
    if (attr && attr[1] !== "class" && attr[1] !== "className") continue
    if (/\+\s*$/.test(before) || /^\s*\+/.test(after)) continue
    if (looksLikeClasses(m[1])) found.add(m[1])
  }
  const lines = [...found].filter((c) => c.trim()).map((c) => `<i data-src="${esc(file)}" class="${esc(c.trim())}"></i>`)
  if (!lines.length) continue
  const out = join(OUT, file.replace(EXT, ".html"))
  mkdirSync(join(out, ".."), { recursive: true })
  writeFileSync(out, lines.join("\n") + "\n")
  for (const c of found) sets.push({ file, classes: c })
}
mkdirSync(OUT, { recursive: true })
writeFileSync(join(OUT, ".gitignore"), "*\n")

const run = spawnSync(join("node_modules", ".bin", "ui8px"), ["lint", OUT, "--json"], { encoding: "utf8" })
if (run.status === 2 || (!run.stdout && run.status !== 0)) {
  console.error(run.stderr || run.stdout)
  process.exit(2)
}
type Finding = { rule?: string; code?: string; file?: string; path?: string; className?: string; class?: string; message?: string }
let findings: Finding[] = []
try {
  const parsed = JSON.parse(run.stdout || "{}")
  findings = Array.isArray(parsed) ? parsed : (parsed.findings ?? parsed.diagnostics ?? parsed.results ?? [])
} catch {
  console.error(run.stdout)
  process.exit(2)
}
// The extract must be read: ui8px skips git-ignored paths, so .ui8px/extract stays out of the root .gitignore
// (it carries its own nested one).
const checked = (() => {
  try {
    return Number(JSON.parse(run.stdout || "{}").filesChecked ?? -1)
  } catch {
    return -1
  }
})()
if (sets.length > 0 && checked === 0) {
  console.error("lint:px: ui8px checked no files of " + OUT + " (is it git-ignored?)")
  process.exit(2)
}
const blocking = findings.filter((f) => gate.blocking.includes(f.rule ?? f.code ?? ""))
// GRID: arbitrary spacing values ([..] in gap/p/m/space/inset/size utilities) are off the 8+4 grid by definition.
const SPACING = /^(?:[a-z0-9-]+:)*-?(?:gap|gap-x|gap-y|p|px|py|pt|pb|ps|pe|pl|pr|m|mx|my|mt|mb|ms|me|ml|mr|space-x|space-y|inset|top|bottom|start|end|left|right|size|w|h)-\[/
for (const s of sets) for (const c of s.classes.split(/\s+/)) if (SPACING.test(c)) blocking.push({ rule: "GRID", file: s.file, className: c, message: "arbitrary spacing value" })
mkdirSync(".ui8px/reports", { recursive: true })
writeFileSync(".ui8px/reports/lint.json", JSON.stringify({ findings, blocking }, null, 2) + "\n")
const report = findings.filter((f) => !gate.blocking.includes(f.rule ?? f.code ?? ""))
for (const f of blocking) console.error(`✗ ${f.rule ?? f.code} ${f.file ?? f.path ?? ""} ${f.className ?? f.class ?? ""} ${f.message ?? ""}`)
console.log(`lint:px: ${sets.length} class sets from ${SOURCES.join(", ")}; blocking ${blocking.length} (max ${gate.max}); report-only ${report.length}`)
process.exit(blocking.length > gate.max ? 1 : 0)
