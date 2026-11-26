<!-- The features of the home page (a project block): the heading, one paragraph and the features as cards with a
     Lucide icon, one column on a phone, two on a tablet, three on a desktop. -->
<script lang="ts">
  import Block from "../compose/Block.svelte"
  import Card from "../compose/Card.svelte"
  import Container from "../compose/Container.svelte"
  import List from "../compose/List.svelte"
  import ListItem from "../compose/ListItem.svelte"
  import Stack from "../compose/Stack.svelte"
  import Text from "../compose/Text.svelte"
  import Title from "../compose/Title.svelte"
  import LucideIcon from "../icons/LucideIcon.svelte"
  import type { Feature } from "../app/content"

  type Props = { id: string; title: string; description: string; items: Feature[] }
  let { id, title, description, items }: Props = $props()
  const titleId = $derived(id + "-title")
</script>

<Block tag="section" {id} class="py-16 lg:py-24" aria-labelledby={titleId} data-slot="feature-cards">
  <Container class="mx-auto w-full max-w-6xl px-4">
    <Stack gap="12" align="stretch">
      <Stack gap="4" class="max-w-2xl">
        <Title as={2} size="3xl" weight="bold" class="tracking-tight" id={titleId}>{title}</Title>
        <Text size="base" class="text-muted-foreground">{description}</Text>
      </Stack>
      <List tag="ul" class="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {#each items as item (item.id)}
          <ListItem class="flex" data-slot="feature">
            <Card class="w-full">
              <Stack gap="4">
                <LucideIcon name={item.icon} size={24} class="size-6 text-primary" />
                <Stack gap="2">
                  <Title as={3} size="lg">{item.title}</Title>
                  <Text size="sm" class="text-muted-foreground">{item.description}</Text>
                </Stack>
              </Stack>
            </Card>
          </ListItem>
        {/each}
      </List>
    </Stack>
  </Container>
</Block>
