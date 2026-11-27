<!--
  The page header (layouts layer): a skip link, the brand, the main navigation (md and up), the dark mode toggle and,
  on small screens, the menu button that opens the mobile Sheet with the same links. State: `dark` and `menuOpen` below, to ARIA only
  through the Button primitive's `pressed` / `expanded` props; src/app/theme.ts and src/app/modal.ts do the DOM work.
-->
<script lang="ts">
  import Block from "../compose/Block.svelte"
  import Button from "../compose/Button.svelte"
  import Container from "../compose/Container.svelte"
  import Group from "../compose/Group.svelte"
  import Link from "../compose/Link.svelte"
  import LinkPlain from "../compose/LinkPlain.svelte"
  import List from "../compose/List.svelte"
  import ListItem from "../compose/ListItem.svelte"
  import Sheet from "../compose/Sheet.svelte"
  import Stack from "../compose/Stack.svelte"
  import Text from "../compose/Text.svelte"
  import Title from "../compose/Title.svelte"
  import NavBlock from "../components/nav-block.svelte"
  import LucideIcon from "../icons/LucideIcon.svelte"
  import type { NavItem } from "../app/content"
  import { closesSheet, openModal } from "../app/modal"
  import { applyDark, initialDark, onSystemDark, storeDark } from "../app/theme"

  type Props = { brand: string; homeHref: string; nav: NavItem[]; messages: Record<string, string> }
  let { brand, homeHref, nav, messages }: Props = $props()

  let dark = $state(initialDark())
  let menuOpen = $state(false)

  $effect(() => applyDark(dark))
  $effect(() => onSystemDark((d) => (dark = d)))
  $effect(() => (menuOpen ? openModal("mobile-menu") : undefined))

  function toggleTheme() {
    dark = !dark
    storeDark(dark)
  }
</script>

<Block tag="header" class="sticky top-0 z-40 border-b border-border bg-background" data-slot="site-header">
  <LinkPlain
    href="#main-content"
    class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-background focus:px-4 focus:py-2 focus:text-sm"
    data-slot="skip-link"
  >
    {messages["a11y.skip"]}
  </LinkPlain>
  <Container class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
    <LinkPlain href={homeHref} class="flex items-center gap-2 text-foreground hover:text-primary" data-slot="brand">
      <LucideIcon name="blocks" size={24} class="size-6 text-primary" />
      <Text tag="span" size="lg" weight="bold">{brand}</Text>
    </LinkPlain>
    <NavBlock label={messages["nav.main"]} class="hidden md:block" testid="site-nav">
      <List tag="ul" class="m-0 flex list-none items-center gap-6 p-0">
        {#each nav as item (item.id)}
          <ListItem>
            <Link href={item.href} variant="muted" size="sm">{item.label}</Link>
          </ListItem>
        {/each}
      </List>
    </NavBlock>
    <Group gap="2" align="center">
      <Button variant="ghost" layout="icon" pressed={dark} aria-label={messages["theme.toggle"]} onclick={toggleTheme}>
        <LucideIcon name={dark ? "sun" : "moon"} size={24} class="size-6" />
      </Button>
      <Button
        variant="ghost"
        layout="icon"
        class="md:hidden"
        expanded={menuOpen}
        aria-haspopup="dialog"
        aria-controls="mobile-menu"
        aria-label={messages["menu.open"]}
        onclick={() => (menuOpen = true)}
      >
        <LucideIcon name="menu" size={24} class="size-6" />
      </Button>
    </Group>
  </Container>
  <Sheet
    id="mobile-menu"
    side="right"
    class="m-0 h-dvh max-h-none w-full max-w-none border-0 bg-transparent p-0 text-foreground backdrop:bg-foreground/40"
    aria-labelledby="mobile-menu-title"
    aria-describedby="mobile-menu-description"
    onclose={() => (menuOpen = false)}
    onclick={(e: MouseEvent) => closesSheet(e) && (menuOpen = false)}
  >
    <Stack gap="6" align="stretch" class="h-full w-80 max-w-full bg-background p-6 shadow-lg" data-slot="sheet-panel">
      <Group gap="4" align="center" justify="between">
        <Title as={2} size="lg" id="mobile-menu-title">{messages["menu.title"]}</Title>
        <Button variant="ghost" layout="icon" aria-label={messages["menu.close"]} onclick={() => (menuOpen = false)}>
          <LucideIcon name="x" size={24} class="size-6" />
        </Button>
      </Group>
      <Text id="mobile-menu-description" class="sr-only">{messages["menu.description"]}</Text>
      <NavBlock label={messages["nav.mobile"]} testid="mobile-nav">
        <List tag="ul" class="m-0 flex list-none flex-col gap-2 p-0">
          {#each nav as item (item.id)}
            <ListItem>
              <Link href={item.href} variant="block" size="md" class="py-2">{item.label}</Link>
            </ListItem>
          {/each}
        </List>
      </NavBlock>
    </Stack>
  </Sheet>
</Block>
