// The primary content of the home page (one main per page): the hero, the features and the call to action, all from
// src/fixtures/home.json.
import { Block } from "../compose"
import { CtaSimple } from "../blocks/cta-simple"
import { HeroSimple } from "../blocks/hero-simple"
import { FeatureCards } from "../sections/feature-cards"
import type { Home } from "../app/content"

export function PageMain({ page }: { page: Home }) {
  return (
    <Block tag="main" id="main-content" tabIndex={-1} className="flex-1 outline-none" data-slot="page-main">
      <HeroSimple {...page.hero} level={1} align="center" media="bottom" />
      <FeatureCards {...page.features} />
      <CtaSimple {...page.cta} align="center" surface="muted" />
    </Block>
  )
}
