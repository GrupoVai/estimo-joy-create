import { createFileRoute } from "@tanstack/react-router";

import { TabelaPrecos } from "@/components/editor/TabelaPrecos";

export const Route = createFileRoute("/tabela")({
  ssr: false,
  head: () => ({ meta: [{ title: "Tabela de preços · Coktelitas" }] }),
  component: TabelaPrecos,
});
