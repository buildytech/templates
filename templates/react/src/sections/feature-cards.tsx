// The features of the home page (a project block): the heading, one paragraph and the features as cards with a
// Lucide icon, one column on a phone, two on a tablet, three on a desktop.
import { Block, Card, Container, List, ListItem, Stack, Text, Title } from "../compose"
import { LucideIcon } from "../icons/LucideIcon"
import type { Feature } from "../app/content"

type Props = { id: string; title: string; description: string; items: Feature[] }

export function FeatureCards({ id, title, description, items }: Props) {
  const titleId = `${id}-title`
  return (
    <Block tag="section" id={id} className="py-16 lg:py-24" aria-labelledby={titleId} data-slot="feature-cards">
      <Container className="mx-auto w-full max-w-6xl px-4">
        <Stack gap="12" align="stretch">
          <Stack gap="4" className="max-w-2xl">
            <Title as={2} size="3xl" weight="bold" className="tracking-tight" id={titleId}>{title}</Title>
            <Text size="base" className="text-muted-foreground">{description}</Text>
          </Stack>
          <List tag="ul" className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ListItem key={item.id} className="flex" data-slot="feature">
                <Card className="w-full">
                  <Stack gap="4">
                    <LucideIcon name={item.icon} size={24} className="size-6 text-primary" />
                    <Stack gap="2">
                      <Title as={3} size="lg">{item.title}</Title>
                      <Text size="sm" className="text-muted-foreground">{item.description}</Text>
                    </Stack>
                  </Stack>
                </Card>
              </ListItem>
            ))}
          </List>
        </Stack>
      </Container>
    </Block>
  )
}
