import { describe, expect, test } from "bun:test"
import { spawnSync } from "node:child_process"
import { readFileSync, rmSync, writeFileSync } from "node:fs"

const run = (script: string) => spawnSync("bun", [script], { encoding: "utf8" })

describe("page contract", () => {
  test("page.json and ui.json validate", () => {
    const r = run("scripts/validate-content.ts")
    expect(r.stderr).toBe("")
    expect(r.status).toBe(0)
  })

  test("every installed block has a renderer and a contract", () => {
    const contracts = JSON.parse(readFileSync("contracts/blocks.json", "utf8")).items
    const main = readFileSync("src/sections/page-main.svelte", "utf8")
    for (const item of Object.keys(contracts)) {
      if (item === "header-simple" || item === "footer-simple") continue
      expect(main).toContain(`block.item === "${item}"`)
    }
  })

  test("an unknown prop fails the contract", () => {
    const path = "src/content/page.json"
    const original = readFileSync(path, "utf8")
    try {
      const page = JSON.parse(original)
      page.blocks[1].props.colour = "red"
      writeFileSync(path, JSON.stringify(page))
      const r = run("scripts/validate-content.ts")
      expect(r.status).toBe(1)
      expect(r.stderr).toContain("colour")
    } finally {
      writeFileSync(path, original)
    }
  })
})

describe("ui8px 8+4 gate and rules", () => {
  const probe = "src/sections/zz-probe.svelte"
  test("an odd spacing step in a section fails lint:px", () => {
    try {
      writeFileSync(probe, `<script lang="ts">\n  import Block from "../compose/Block.svelte";\n</script>\n\n<Block tag="section" class="gap-3 py-16"></Block>\n`)
      const r = run("scripts/ui8px-gate.ts")
      expect(r.status).toBe(1)
      expect(r.stderr).toContain("gap-3")
    } finally {
      rmSync(probe, { force: true })
    }
  })

  test("a bare tag and literal text fail rules:check", () => {
    try {
      writeFileSync(probe, `<script lang="ts">\n  import Block from "../compose/Block.svelte";\n</script>\n\n<Block tag="section"><div>Hello</div></Block>\n`)
      const r = run("scripts/rules-check.ts")
      expect(r.status).toBe(1)
      expect(r.stderr).toContain("raw-native-tag <div>")
      expect(r.stderr).toContain("literal-text")
    } finally {
      rmSync(probe, { force: true })
    }
  })

  test("the template itself is clean", () => {
    expect(run("scripts/ui8px-gate.ts").status).toBe(0)
    expect(run("scripts/rules-check.ts").status).toBe(0)
  })
})
