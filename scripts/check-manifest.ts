// templates.json is the one list of templates (hosts read it; CI builds its matrix from it). Checks: ids and aliases
// unique and kebab-case, every entry's dir exists under templates/ with the files a host needs, and every folder of
// templates/ is listed. Prints the CI matrix (JSON array of dirs) with --matrix.
import { existsSync, readdirSync, readFileSync } from "node:fs"

type Entry = { id: string; dir: string; name: string; stack: string; description: string; runner: string; aliases: string[] }
const m = JSON.parse(readFileSync("templates.json", "utf8")) as { schemaVersion: number; templates: Entry[] }
const errors: string[] = []
if (m.schemaVersion !== 1) errors.push(`schemaVersion ${m.schemaVersion}: expected 1`)
const seen = new Set<string>()
const RUNNERS = new Set(["vite-bun"])
for (const t of m.templates) {
  for (const id of [t.id, ...(t.aliases ?? [])]) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) errors.push(`${t.id}: id or alias "${id}" is not kebab-case`)
    if (seen.has(id)) errors.push(`${t.id}: id or alias "${id}" is used twice`)
    seen.add(id)
  }
  if (t.dir !== `templates/${t.id}`) errors.push(`${t.id}: dir must be templates/${t.id}`)
  for (const k of ["name", "stack", "description"] as const) if (!t[k]?.trim()) errors.push(`${t.id}: ${k} is empty`)
  if (!RUNNERS.has(t.runner)) errors.push(`${t.id}: unknown runner "${t.runner}" (hosts know: ${[...RUNNERS].join(", ")})`)
  for (const f of ["package.json", "bun.lock", ".bun-version", "AGENTS.md", "LICENSE", "index.html", "vite.config.ts"])
    if (!existsSync(`${t.dir}/${f}`)) errors.push(`${t.id}: ${t.dir}/${f} missing`)
  if (existsSync(`${t.dir}/package.json`)) {
    const pkg = JSON.parse(readFileSync(`${t.dir}/package.json`, "utf8"))
    if (!pkg.scripts?.verify) errors.push(`${t.id}: package.json has no verify script`)
    if (!pkg.engines?.bun) errors.push(`${t.id}: package.json has no engines.bun`)
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
if (process.argv.includes("--matrix")) console.log(JSON.stringify(m.templates.map((t) => t.dir)))
else console.log(`templates.json: ${m.templates.length} templates ok (${m.templates.map((t) => t.id).join(", ")})`)
