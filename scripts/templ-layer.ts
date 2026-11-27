// templates/templ is a layer over the empty workspace (ADR 0004): the fastygo/starter files at one pinned commit,
// recorded as path -> sha256 in templates/templ/layer.json. Hosts download the GitHub archive of that commit and
// accept it only when every file matches (no file more, none less). The starter is not copied into this repository:
// it is a Go module (go.mod), and a host embedding this repository with go:embed cannot embed a nested module.
//
//   bun scripts/templ-layer.ts                 rewrite layer.json from the commit in it (network)
//   bun scripts/templ-layer.ts --check [dir]   download, compare with layer.json; keep the checked tree in dir
import { createHash } from "node:crypto"
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, relative } from "node:path"

const LAYER = "templates/templ/layer.json"
type Layer = {
  schemaVersion: 1
  base: string
  source: { kind: "github-archive"; repo: string; commit: string; exclude: string[] }
  go: string
  files: Record<string, string>
  executables: string[]
}
const layer = JSON.parse(readFileSync(LAYER, "utf8")) as Layer
const check = process.argv.includes("--check")
const keep = check ? process.argv[process.argv.indexOf("--check") + 1] : undefined

if (!/^[0-9a-f]{40}$/.test(layer.source.commit)) throw new Error(`${LAYER}: source.commit must be a full commit sha`)
const url = `https://codeload.github.com/${layer.source.repo}/tar.gz/${layer.source.commit}`
const res = await fetch(url)
if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`)
const tmp = mkdtempSync(join(tmpdir(), "templ-layer-"))
try {
  writeFileSync(join(tmp, "a.tgz"), new Uint8Array(await res.arrayBuffer()))
  const out = keep && !keep.startsWith("--") ? keep : join(tmp, "tree")
  mkdirSync(out, { recursive: true })
  const tar = Bun.spawnSync(["tar", "-xzf", join(tmp, "a.tgz"), "-C", out, "--strip-components=1", "--no-same-owner"])
  if (tar.exitCode !== 0) throw new Error(`tar: ${tar.stderr.toString()}`)
  const excluded = (p: string) => layer.source.exclude.some((e) => (e.endsWith("/") ? p.startsWith(e) : p === e))
  const walk = (d: string): string[] =>
    readdirSync(d, { withFileTypes: true }).flatMap((e) => {
      const p = join(d, e.name)
      if (e.isSymbolicLink()) throw new Error(`symbolic link in the archive: ${relative(out, p)}`)
      return e.isDirectory() ? walk(p) : [p]
    })
  const files: Record<string, string> = {}
  const executables: string[] = []
  for (const p of walk(out).sort()) {
    const rel = relative(out, p)
    if (excluded(rel)) {
      rmSync(p)
      continue
    }
    files[rel] = createHash("sha256").update(readFileSync(p)).digest("hex")
    if (statSync(p).mode & 0o100) executables.push(rel)
  }
  if (!check) {
    writeFileSync(LAYER, `${JSON.stringify({ ...layer, files, executables }, null, 2)}\n`)
    console.log(`${LAYER}: ${layer.source.repo}@${layer.source.commit.slice(0, 7)}, ${Object.keys(files).length} files`)
  } else {
    const fail: string[] = []
    for (const [p, h] of Object.entries(files)) if (layer.files[p] !== h) fail.push(layer.files[p] ? `differs: ${p}` : `not in layer.json: ${p}`)
    for (const p of Object.keys(layer.files)) if (!(p in files)) fail.push(`missing in the archive: ${p}`)
    if (JSON.stringify(executables) !== JSON.stringify(layer.executables)) fail.push(`executables differ: ${executables.join(", ")}`)
    for (const p of executables) chmodSync(join(out, p), 0o755)
    if (fail.length) {
      console.error(fail.join("\n"))
      process.exit(1)
    }
    console.log(`${LAYER}: ${Object.keys(files).length} files match ${layer.source.repo}@${layer.source.commit.slice(0, 7)}${existsSync(out) && keep ? ` (tree in ${out})` : ""}`)
  }
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
