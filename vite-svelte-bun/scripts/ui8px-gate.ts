// lint:px — the 8+4 spacing gate (ui8px) for the blocks layer: the registry blocks (src/blocks) and the blocks
// written for this project (src/sections). ui8px reads .html, not .svelte, so the class sets are mirrored first
// (as codegen-x/ui8kit ui8px-extract.mjs does): every static class="..." and every class-list string of a script
// becomes one <i data-src class> in .ui8px/extract/<dir>/<file>.html. Then `ui8px lint` runs on the extract and the
// gate fails over .ui8px/gate.json `max` (0) on the blocking rules, plus GRID: arbitrary [..] spacing values.
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

const SOURCES = ["src/blocks", "src/sections"]
const OUT = ".ui8px/extract"
const gate = JSON.parse(readFileSync(".ui8px/gate.json", "utf8")) as { max: number; blocking: string[] }

const TOKEN = /^[!-]?[a-z][a-z0-9:/._%[\]()#-]*$/
const looksLikeClasses = (s: string) => {
  const parts = s.trim().split(/\s+/).filter(Boolean)
  return parts.length > 0 && parts.every((p) => TOKEN.test(p)) && parts.some((p) => p.includes("-") || p.includes(":"))
}
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")

rmSync(OUT, { recursive: true, force: true })
const sets: { file: string; classes: string }[] = []
for (const dir of SOURCES) {
  let files: string[] = []
  try {
    files = readdirSync(dir).filter((f) => f.endsWith(".svelte"))
  } catch {
    continue
  }
  for (const f of files) {
    const src = readFileSync(join(dir, f), "utf8")
    const found = new Set<string>()
    for (const m of src.matchAll(/\bclass="([^"{}]*)"/g)) found.add(m[1])
    for (const m of src.matchAll(/"([^"\n]{2,})"/g)) if (looksLikeClasses(m[1])) found.add(m[1])
    const lines = [...found].filter((c) => c.trim()).map((c) => `<i data-src="${esc(join(dir, f))}" class="${esc(c.trim())}"></i>`)
    if (!lines.length) continue
    mkdirSync(join(OUT, dir), { recursive: true })
    writeFileSync(join(OUT, dir, f.replace(/\.svelte$/, ".html")), lines.join("\n") + "\n")
    for (const c of found) sets.push({ file: join(dir, f), classes: c })
  }
}
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
  findings = Array.isArray(parsed) ? parsed : parsed.findings ?? parsed.diagnostics ?? parsed.results ?? []
} catch {
  console.error(run.stdout)
  process.exit(2)
}
const blocking = findings.filter((f) => gate.blocking.includes(f.rule ?? f.code ?? ""))
// GRID: arbitrary spacing values ([..] in gap/p/m/space/inset/size utilities) are off the 8+4 grid by definition.
const SPACING = /^(?:[a-z0-9-]+:)*-?(?:gap|gap-x|gap-y|p|px|py|pt|pb|ps|pe|pl|pr|m|mx|my|mt|mb|ms|me|ml|mr|space-x|space-y|inset|top|bottom|start|end|left|right)-\[/
for (const s of sets) for (const c of s.classes.split(/\s+/)) if (SPACING.test(c)) blocking.push({ rule: "GRID", file: s.file, className: c, message: "arbitrary spacing value" })
mkdirSync(".ui8px/reports", { recursive: true })
writeFileSync(".ui8px/reports/lint.json", JSON.stringify({ findings, blocking }, null, 2) + "\n")
const report = findings.filter((f) => !gate.blocking.includes(f.rule ?? f.code ?? ""))
for (const f of blocking) console.error(`✗ ${f.rule ?? f.code} ${f.file ?? f.path ?? ""} ${f.className ?? f.class ?? ""} ${f.message ?? ""}`)
console.log(`lint:px: ${sets.length} class sets from ${SOURCES.join(", ")}; blocking ${blocking.length} (max ${gate.max}); report-only ${report.length}`)
process.exit(blocking.length > gate.max ? 1 : 0)
