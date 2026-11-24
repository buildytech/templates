<!-- The app frame: header, the primary content and footer from src/content/page.json, and the theme switch. -->
<script lang="ts">
  import FooterSimple from "./blocks/footer-simple.svelte";
  import HeaderSimple from "./blocks/header-simple.svelte";
  import { footerBlock, headerBlock, mainBlocks, ui } from "./app/page";
  import PageMain from "./sections/page-main.svelte";
  import ThemeSwitch from "./sections/theme-switch.svelte";
</script>

{#if headerBlock}
  <HeaderSimple {...headerBlock.props as any} />
{/if}
<PageMain blocks={mainBlocks} />
{#if footerBlock}
  <FooterSimple {...footerBlock.props as any} />
{/if}
<ThemeSwitch label={ui.messages["theme.region"]} toggleLabel={ui.messages["theme.toggle"]} />
