<!-- The light / dark switch, kept in view at the end of the page bottom. -->
<script lang="ts">
  import Block from "../compose/Block.svelte";
  import ThemeToggle from "../compose/ThemeToggle.svelte";

  let { label, toggleLabel }: { label: string; toggleLabel: string } = $props();
</script>

<Block tag="aside" aria-label={label} class="fixed bottom-4 end-4 z-10">
  <ThemeToggle aria-label={toggleLabel} />
</Block>
