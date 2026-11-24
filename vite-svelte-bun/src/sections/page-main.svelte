<!-- The primary content: the registry blocks of src/content/page.json in order (header and footer render outside). -->
<script lang="ts">
  import type { PageBlock } from "../app/page";
  import Block from "../compose/Block.svelte";
  import CtaSimple from "../blocks/cta-simple.svelte";
  import FaqSimple from "../blocks/faq-simple.svelte";
  import FeaturesSimple from "../blocks/features-simple.svelte";
  import HeroSimple from "../blocks/hero-simple.svelte";
  import LogosSimple from "../blocks/logos-simple.svelte";
  import NewsletterForm from "../blocks/newsletter-form.svelte";
  import PricingSimple from "../blocks/pricing-simple.svelte";
  import StatsSimple from "../blocks/stats-simple.svelte";
  import StepsSimple from "../blocks/steps-simple.svelte";
  import TeamSimple from "../blocks/team-simple.svelte";
  import TestimonialsSimple from "../blocks/testimonials-simple.svelte";

  let { blocks }: { blocks: PageBlock[] } = $props();
</script>

<Block tag="main" id="main-content">
  {#each blocks as block (block.id)}
    {#if block.item === "hero-simple"}
      <HeroSimple {...block.props as any} />
    {:else if block.item === "features-simple"}
      <FeaturesSimple {...block.props as any} />
    {:else if block.item === "steps-simple"}
      <StepsSimple {...block.props as any} />
    {:else if block.item === "stats-simple"}
      <StatsSimple {...block.props as any} />
    {:else if block.item === "logos-simple"}
      <LogosSimple {...block.props as any} />
    {:else if block.item === "pricing-simple"}
      <PricingSimple {...block.props as any} />
    {:else if block.item === "testimonials-simple"}
      <TestimonialsSimple {...block.props as any} />
    {:else if block.item === "team-simple"}
      <TeamSimple {...block.props as any} />
    {:else if block.item === "faq-simple"}
      <FaqSimple {...block.props as any} />
    {:else if block.item === "newsletter-form"}
      <NewsletterForm {...block.props as any} />
    {:else if block.item === "cta-simple"}
      <CtaSimple {...block.props as any} />
    {/if}
  {/each}
</Block>
