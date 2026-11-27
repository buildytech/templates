// templates.json is the one list of templates (hosts read it; CI builds its matrix from it). Checks: ids and aliases
// unique and kebab-case, every entry's dir exists under templates/ with the files a host needs, and every folder of
// templates/ is listed. Prints the CI matrix (JSON array of dirs that have a verify script) with --matrix.
import { existsSync, readdirSync, readFileSync } from "node:fs"

type Entry = { id: string; dir: string; name: string; stack: string; description: string; runner: string; aliases: string[] }
const m = JSON.parse(readFileSync("templates.json", "utf8")) as { schemaVersion: number; templates: Entry[] }
const errors: string[] = []
if (m.schemaVersion !== 1) errors.push(`schemaVersion ${m.schemaVersion}: expected 1`)
const seen = new Set<string>()
const RUNNERS = new Set(["vite-bun", "go-templ", "none"])
const STARTER_FILES = ["package.json", "bun.lock", ".bun-version", "AGENTS.md", "LICENSE", "index.html", "vite.config.ts"]
for (const t of m.templates) {
  for (const id of [t.id, ...(t.aliases ?? [])]) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) errors.push(`${t.id}: id or alias "${id}" is not kebab-case`)
    if (seen.has(id)) errors.push(`${t.id}: id or alias "${id}" is used twice`)
    seen.add(id)
  }
  if (t.dir !== `templates/${t.id}`) errors.push(`${t.id}: dir must be templates/${t.id}`)
  for (const k of ["name", "stack", "description"] as const) if (!t[k]?.trim()) errors.push(`${t.id}: ${k} is empty`)
  if (!RUNNERS.has(t.runner)) errors.push(`${t.id}: unknown runner "${t.runner}" (hosts know: ${[...RUNNERS].join(", ")})`)
  if (!existsSync(t.dir)) errors.push(`${t.id}: ${t.dir} missing`)
  if (t.runner === "none") {
    if (t.id !== "empty") errors.push(`${t.id}: runner "none" is only for the empty workspace`)
    const files = existsSync(t.dir) ? readdirSync(t.dir, { recursive: true, withFileTypes: true }) : []
    const shipped = files.filter((f) => f.isFile() && f.name !== ".gitkeep").map((f) => {
      const parent = (f as { parentPath?: string; path?: string }).parentPath ?? (f as { path?: string }).path ?? t.dir
      const rel = `${parent}/${f.name}`.replace(`${t.dir}/`, "")
      return rel
    })
    if (shipped.length) errors.push(`${t.id}: must ship no project files (only .gitkeep for git); found ${shipped.join(", ")}`)
  } else if (t.runner === "go-templ") {
    // A layer over the empty workspace (ADR 0004): layer.json pins the starter's files; no go.mod here (hosts embed
    // this repository with go:embed, which cannot embed a nested Go module).
    const layerFile = `${t.dir}/layer.json`
    if (!existsSync(layerFile)) errors.push(`${t.id}: ${layerFile} missing`)
    else {
      const l = JSON.parse(readFileSync(layerFile, "utf8"))
      if (l.schemaVersion !== 1 || l.base !== "empty") errors.push(`${t.id}: layer.json needs schemaVersion 1 and base "empty"`)
      if (l.source?.kind !== "github-archive" || !/^[0-9a-f]{40}$/.test(l.source?.commit ?? "")) errors.push(`${t.id}: layer.json source must pin a github-archive commit`)
      const files = Object.keys(l.files ?? {})
      if (!files.includes("go.mod") || !files.includes("go.sum") || !files.includes("cmd/site/main.go")) errors.push(`${t.id}: layer.json must list go.mod, go.sum and cmd/site/main.go`)
      if (files.some((f) => !/^[0-9a-f]{64}$/.test(l.files[f]) || f.startsWith("/") || f.split("/").includes(".."))) errors.push(`${t.id}: layer.json has a bad path or hash`)
    }
    if (existsSync(`${t.dir}/go.mod`)) errors.push(`${t.id}: must not ship go.mod (the starter comes from layer.json)`)
  } else {
    for (const f of STARTER_FILES) if (!existsSync(`${t.dir}/${f}`)) errors.push(`${t.id}: ${t.dir}/${f} missing`)
    if (existsSync(`${t.dir}/package.json`)) {
      const pkg = JSON.parse(readFileSync(`${t.dir}/package.json`, "utf8"))
      if (!pkg.scripts?.verify) errors.push(`${t.id}: package.json has no verify script`)
      if (!pkg.engines?.bun) errors.push(`${t.id}: package.json has no engines.bun`)
    }
  }
  for (const f of [".cursor/hooks.json", ".cursor/sandbox.json", ".cursor/mcp.json"])
    if (existsSync(`${t.dir}/${f}`)) errors.push(`${t.id}: ships agent config ${f}`)
}
const listed = new Set(m.templates.map((t) => t.dir))
for (const d of readdirSync("templates")) if (!listed.has(`templates/${d}`)) errors.push(`templates/${d} is not in templates.json`)
if (errors.length) {
  console.error(errors.join("\n"))
  process.exit(1)
}
if (process.argv.includes("--matrix")) {
  // CI verify job needs package.json and bun.lock: the vite-bun starters (empty and go-templ have their own jobs).
  console.log(JSON.stringify(m.templates.filter((t) => t.runner === "vite-bun").map((t) => t.dir)))
} else {
  console.log(`templates.json: ${m.templates.length} templates ok (${m.templates.map((t) => t.id).join(", ")})`)
}
