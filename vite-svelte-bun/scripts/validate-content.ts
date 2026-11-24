// contract:validate: the page contract and the dictionary, before any markup.
//  1. src/content/page.json against page-spec/v2 (@ui8kit/contract JSON Schema) + its program checks;
//  2. every block: a registry item this page renders, props exactly its component's props (contracts/blocks.json,
//     generated from src/blocks by gen:contracts): no unknown prop, required ones present, enums respected;
//  3. src/content/ui.json as a Codex v0.4 dictionary in the same locale as the page;
//  4. fixtures/*.json the same way.
import Ajv2020 from "ajv/dist/2020"
import { checkDictionaryV04 } from "@ui8kit/contract"
import { readdirSync, readFileSync } from "node:fs"

type Field = { type: string; required: boolean; enum?: (string | number)[]; item?: Record<string, Field> }
const blocks: { items: Record<string, { props: Record<string, Field> }> } = JSON.parse(readFileSync("contracts/blocks.json", "utf8"))
const schema = JSON.parse(readFileSync(require.resolve("@ui8kit/contract/schemas/page-spec-v2.schema.json"), "utf8"))
const ajv = new Ajv2020({ allErrors: true, strict: false })
// page-spec/v2 reuses $defs (safeText, …) of page-spec/v1.
ajv.addSchema(JSON.parse(readFileSync(require.resolve("@ui8kit/contract/schemas/page-spec.schema.json"), "utf8")))
const validatePage = ajv.compile(schema)
const rendered = new Set(
  [...readFileSync("src/sections/page-main.svelte", "utf8").matchAll(/block\.item === "([\w-]+)"/g)].map((m) => m[1]).concat(["header-simple", "footer-simple"]),
)

const errors: string[] = []
const fail = (path: string, msg: string) => errors.push(`${path}: ${msg}`)

function checkFields(path: string, value: unknown, fields: Record<string, Field>) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return fail(path, "expected an object")
  const obj = value as Record<string, unknown>
  for (const key of Object.keys(obj)) if (!(key in fields)) fail(`${path}.${key}`, "unknown prop")
  for (const [key, f] of Object.entries(fields)) {
    const v = obj[key]
    const p = `${path}.${key}`
    if (v === undefined || v === null || v === "") {
      if (f.required) fail(p, "required")
      continue
    }
    if (f.enum && !f.enum.includes(v as never)) fail(p, `expected one of ${f.enum.join(", ")}, got ${JSON.stringify(v)}`)
    else if (f.type === "string" && typeof v !== "string") fail(p, "expected a string")
    else if (f.type === "number" && typeof v !== "number") fail(p, "expected a number")
    else if (f.type === "boolean" && typeof v !== "boolean") fail(p, "expected a boolean")
    else if (f.type === "array") {
      if (!Array.isArray(v)) fail(p, "expected an array")
      else if (f.item) v.forEach((x, i) => checkFields(`${p}[${i}]`, x, f.item!))
    }
  }
}

function checkPage(file: string) {
  const page = JSON.parse(readFileSync(file, "utf8"))
  if (!validatePage(page)) for (const e of validatePage.errors ?? []) fail(`${file}${e.instancePath}`, e.message ?? "invalid")
  const ids = new Set<string>()
  for (const [i, b] of (page.blocks ?? []).entries()) {
    const path = `${file}.blocks[${i}]`
    if (ids.has(b.id)) fail(path, `duplicate id ${b.id}`)
    ids.add(b.id)
    const contract = blocks.items[b.item]
    if (!contract) fail(path, `unknown item ${b.item} (installed: ${Object.keys(blocks.items).join(", ")})`)
    else if (!rendered.has(b.item)) fail(path, `item ${b.item} has no renderer in src/sections/page-main.svelte`)
    else checkFields(`${path}.props`, b.props, contract.props)
  }
  return page.locale as string
}

function checkDictionary(file: string, locale: string) {
  const dict = JSON.parse(readFileSync(file, "utf8"))
  checkDictionaryV04(dict, file, (code, path, message) => fail(path || file, `${message} (${code})`))
  if (dict.locale !== locale) fail(file, `locale ${dict.locale} differs from the page locale ${locale}`)
  for (const key of ["theme.region", "theme.toggle"]) if (!dict.messages?.[key]) fail(`${file}.messages`, `missing ${key}`)
}

const locale = checkPage("src/content/page.json")
checkDictionary("src/content/ui.json", locale)
for (const f of readdirSync("fixtures").filter((f) => f.startsWith("page.") && f.endsWith(".json"))) {
  const loc = checkPage(`fixtures/${f}`)
  checkDictionary(`fixtures/${f.replace(/^page\./, "ui.")}`, loc)
}
if (errors.length) {
  console.error(errors.join("\n"))
  console.error(`contract:validate: ${errors.length} error(s)`)
  process.exit(1)
}
console.log("contract:validate: page and dictionary are valid")
