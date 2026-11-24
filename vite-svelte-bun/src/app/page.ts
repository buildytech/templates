// The page contract (page-spec/v2 of @ui8kit/contract): src/content/page.json lists the registry blocks in order
// with their props; src/content/ui.json is the interface dictionary (Codex v0.4). Both are checked by
// `bun run contract:validate`. All visible text lives there, in the language of the page (`locale`).
import pageJson from "../content/page.json"
import uiJson from "../content/ui.json"

export type PageBlock = { id: string; item: string; variant?: string; props: Record<string, unknown> }
export type Page = {
  version: 2
  title: string
  slug: string
  locale: string
  seo?: { title?: string; description?: string }
  blocks: PageBlock[]
}

export const page = pageJson as unknown as Page
export const ui = uiJson as { locale: string; messages: Record<string, string> }

export const headerBlock = page.blocks.find((b) => b.item === "header-simple")
export const footerBlock = page.blocks.find((b) => b.item === "footer-simple")
export const mainBlocks = page.blocks.filter((b) => b.item !== "header-simple" && b.item !== "footer-simple")
