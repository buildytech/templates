<!-- The app frame: the header, the primary content and the footer; data from src/fixtures, words from src/i18n. -->
<script lang="ts">
  import Block from "./compose/Block.svelte"
  import FooterSimple from "./blocks/footer-simple.svelte"
  import SiteHeader from "./layouts/site-header.svelte"
  import PageMain from "./layouts/page-main.svelte"
  import { dictionary, home, site } from "./app/content"
</script>

<Block class="flex min-h-dvh flex-col" data-slot="app">
  <SiteHeader brand={site.brand} homeHref={site.homeHref} nav={site.nav} messages={dictionary.messages} />
  <PageMain page={home} />
  <FooterSimple id="contact" brand={site.brand} {...site.footer} landmarkLabel={dictionary.messages["footer.label"]} />
</Block>
