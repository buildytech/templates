<!-- The primary content of the home page (one main per page): the hero, the features and the call to action, all
     from src/fixtures/home.json. -->
<script lang="ts">
  import Block from "../compose/Block.svelte"
  import CtaSimple from "../blocks/cta-simple.svelte"
  import HeroSimple from "../blocks/hero-simple.svelte"
  import FeatureCards from "../sections/feature-cards.svelte"
  import type { Home } from "../app/content"

  let { page }: { page: Home } = $props()
</script>

<Block tag="main" id="main-content" tabindex={-1} class="flex-1 outline-none" data-slot="page-main">
  <HeroSimple {...page.hero} level={1} align="center" media="bottom" />
  <FeatureCards {...page.features} />
  <CtaSimple {...page.cta} align="center" surface="muted" />
</Block>
