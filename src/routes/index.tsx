import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gerador de Orçamentos Coktelitas" },
      {
        name: "description",
        content: "Gerador de Orçamentos Coktelitas",
      },
      { property: "og:title", content: "Gerador de Orçamentos Coktelitas" },
      {
        property: "og:description",
        content: "Gerador de Orçamentos Coktelitas",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <h1 className="text-3xl font-semibold text-foreground">
        Gerador de Orçamentos Coktelitas
      </h1>
    </div>
  );
}
