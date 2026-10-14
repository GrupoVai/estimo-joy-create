import { createFileRoute } from "@tanstack/react-router";

import { Editor } from "@/components/editor/Editor";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Gerador de Orçamentos Coktelitas" },
      { name: "description", content: "Gerador de orçamentos da Coktelitas Drinks & Cocktails" },
      { property: "og:title", content: "Gerador de Orçamentos Coktelitas" },
      {
        property: "og:description",
        content: "Gerador de orçamentos da Coktelitas Drinks & Cocktails",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Editor,
});
