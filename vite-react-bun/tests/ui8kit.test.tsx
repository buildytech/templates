import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, test } from "vitest"
import { Button } from "../src/ui"

describe("ui8kit integration", () => {
  test("renders a button with its semantic type and generated classes", () => {
    const html = renderToStaticMarkup(<Button variant="default">Create</Button>)

    expect(html).toContain('type="button"')
    expect(html).toContain(">Create</button>")
    expect(html).toContain("inline-flex")
  })
})
