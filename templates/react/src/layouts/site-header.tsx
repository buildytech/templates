// The page header (layouts layer): a skip link, the brand, the main navigation (md and up), the dark mode toggle and,
// on small screens, the menu button that opens the mobile Sheet with the same links. State: `dark` and `menuOpen` below, to ARIA only
// through the Button primitive's `pressed` / `expanded` props; src/app/theme.ts and src/app/modal.ts do the DOM work.
import { useEffect, useState } from "react"
import { Block, Button, Container, Group, Link, LinkPlain, List, ListItem, Sheet, Stack, Text, Title } from "../compose"
import { NavBlock } from "../components/nav-block"
import { LucideIcon } from "../icons/LucideIcon"
import type { NavItem } from "../app/content"
import { closesSheet, openModal } from "../app/modal"
import { applyDark, initialDark, onSystemDark, storeDark } from "../app/theme"

type Props = { brand: string; homeHref: string; nav: NavItem[]; messages: Record<string, string> }

export function SiteHeader({ brand, homeHref, nav, messages }: Props) {
  const [dark, setDark] = useState(initialDark)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => applyDark(dark), [dark])
  useEffect(() => onSystemDark(setDark), [])
  useEffect(() => (menuOpen ? openModal("mobile-menu") : undefined), [menuOpen])

  function toggleTheme() {
    setDark(!dark)
    storeDark(!dark)
  }

  return (
    <Block tag="header" className="sticky top-0 z-40 border-b border-border bg-background" data-slot="site-header">
      <LinkPlain
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-background focus:px-4 focus:py-2 focus:text-sm"
        data-slot="skip-link"
      >
        {messages["a11y.skip"]}
      </LinkPlain>
      <Container className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <LinkPlain href={homeHref} className="flex items-center gap-2 text-foreground hover:text-primary" data-slot="brand">
          <LucideIcon name="blocks" size={24} className="size-6 text-primary" />
          <Text tag="span" size="lg" weight="bold">{brand}</Text>
        </LinkPlain>
        <NavBlock label={messages["nav.main"]} className="hidden md:block" testid="site-nav">
          <List tag="ul" className="m-0 flex list-none items-center gap-6 p-0">
            {nav.map((item) => (
              <ListItem key={item.id}>
                <Link href={item.href} variant="muted" size="sm">{item.label}</Link>
              </ListItem>
            ))}
          </List>
        </NavBlock>
        <Group gap="2" align="center">
          <Button variant="ghost" layout="icon" pressed={dark} aria-label={messages["theme.toggle"]} onClick={toggleTheme}>
            <LucideIcon name={dark ? "sun" : "moon"} size={24} className="size-6" />
          </Button>
          <Button
            variant="ghost"
            layout="icon"
            className="md:hidden"
            expanded={menuOpen}
            aria-haspopup="dialog"
            aria-controls="mobile-menu"
            aria-label={messages["menu.open"]}
            onClick={() => setMenuOpen(true)}
          >
            <LucideIcon name="menu" size={24} className="size-6" />
          </Button>
        </Group>
      </Container>
      <Sheet
        id="mobile-menu"
        side="right"
        className="m-0 h-dvh max-h-none w-full max-w-none border-0 bg-transparent p-0 text-foreground backdrop:bg-foreground/40"
        aria-labelledby="mobile-menu-title"
        aria-describedby="mobile-menu-description"
        onClose={() => setMenuOpen(false)}
        onClick={(e) => closesSheet(e) && setMenuOpen(false)}
      >
        <Stack gap="6" align="stretch" className="h-full w-80 max-w-full bg-background p-6 shadow-lg" data-slot="sheet-panel">
          <Group gap="4" align="center" justify="between">
            <Title as={2} size="lg" id="mobile-menu-title">{messages["menu.title"]}</Title>
            <Button variant="ghost" layout="icon" aria-label={messages["menu.close"]} onClick={() => setMenuOpen(false)}>
              <LucideIcon name="x" size={24} className="size-6" />
            </Button>
          </Group>
          <Text id="mobile-menu-description" className="sr-only">{messages["menu.description"]}</Text>
          <NavBlock label={messages["nav.mobile"]} testid="mobile-nav">
            <List tag="ul" className="m-0 flex list-none flex-col gap-2 p-0">
              {nav.map((item) => (
                <ListItem key={item.id}>
                  <Link href={item.href} variant="block" size="md" className="py-2">{item.label}</Link>
                </ListItem>
              ))}
            </List>
          </NavBlock>
        </Stack>
      </Sheet>
    </Block>
  )
}
