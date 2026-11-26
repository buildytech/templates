// The app frame: the header, the primary content and the footer; data from src/fixtures, words from src/i18n.
import { Block } from "./compose"
import { FooterSimple } from "./blocks/footer-simple"
import { SiteHeader } from "./layouts/site-header"
import { PageMain } from "./layouts/page-main"
import { dictionary, home, site } from "./app/content"

export function App() {
  return (
    <Block className="flex min-h-dvh flex-col" data-slot="app">
      <SiteHeader brand={site.brand} homeHref={site.homeHref} nav={site.nav} messages={dictionary.messages} />
      <PageMain page={home} />
      <FooterSimple id="contact" brand={site.brand} {...site.footer} landmarkLabel={dictionary.messages["footer.label"]} />
    </Block>
  )
}
