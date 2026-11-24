import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui"

export default function App() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <Card className="w-full max-w-xl shadow-xl">
        <CardHeader>
          <Badge className="mb-3 w-fit">BuildY · Vite · Bun</Badge>
          <CardTitle as={1}>Ready for precise UI work on Bun</CardTitle>
          <CardDescription>
            React, TypeScript, Tailwind and generated ui8kit primitives run
            through Bun without changing the browser contract.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">
            Replace this composition with your product. Keep the runtime and
            preview contracts intact.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <a href="https://bun.com/docs" target="_blank" rel="noreferrer">
              Read the Bun docs
            </a>
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
