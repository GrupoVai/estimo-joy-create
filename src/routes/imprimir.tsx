import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { DEFAULT_CONFIG, loadPrintPayload } from "@/doc/config";
import { DocProvider } from "@/doc/context";
import { Documento } from "@/doc/Documento";
import { FIXTURES } from "@/doc/fixtures";
import type { Config, Proposta } from "@/doc/types";

type Search = { fixture?: string; auto?: string };

export const Route = createFileRoute("/imprimir")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>): Search => ({
    ...(typeof s["fixture"] === "string" ? { fixture: s["fixture"] } : {}),
    ...(typeof s["auto"] === "string" ? { auto: s["auto"] } : {}),
  }),
  component: Imprimir,
});

function nomeArquivo(p: Proposta): string {
  const nome = p.nome.trim() || "Proposta";
  return `${nome}-orçamento`;
}

/**
 * Esconde o que a hospedagem injeta na página fora do documento (ex.: o selo
 * "Edit with Lovable", fixo no canto, que sairia impresso em todas as folhas).
 * Só mexe em filhos diretos do <body> que não contêm o documento.
 */
function ocultarInjetados() {
  const doc = document.querySelector(".doc-print");
  if (!doc) return;
  for (const el of Array.from(document.body.children)) {
    if (!(el instanceof HTMLElement)) continue;
    if (el === doc || el.contains(doc)) continue;
    if (/^(SCRIPT|STYLE|LINK|TEMPLATE|NOSCRIPT)$/.test(el.tagName)) continue;
    el.style.setProperty("display", "none", "important");
  }
}

function Imprimir() {
  const { fixture, auto } = Route.useSearch();
  const [data, setData] = useState<{ proposta: Proposta; config: Config } | null>(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    const fx = fixture ? FIXTURES[fixture] : undefined;
    if (fx) setData({ proposta: fx(), config: DEFAULT_CONFIG });
    else setData(loadPrintPayload());
  }, [fixture]);

  const titulo = useMemo(() => (data ? nomeArquivo(data.proposta) : "orçamento"), [data]);

  useEffect(() => {
    if (!data) return;
    document.title = titulo;
    let cancel = false;
    (async () => {
      await document.fonts.ready;
      const imgs = Array.from(document.images);
      await Promise.all(
        imgs.map((im) =>
          im.complete
            ? Promise.resolve()
            : new Promise<void>((r) => {
                im.onload = () => r();
                im.onerror = () => r();
              }),
        ),
      );
      if (cancel) return;
      ocultarInjetados();
      setPronto(true);
      if (auto !== "0")
        setTimeout(() => {
          ocultarInjetados();
          window.print();
        }, 150);
    })();
    // o selo pode ser injetado depois de a página carregar
    const obs = new MutationObserver(() => ocultarInjetados());
    obs.observe(document.body, { childList: true });
    return () => {
      cancel = true;
      obs.disconnect();
    };
  }, [data, titulo, auto]);

  if (!data) {
    return (
      <div className="p-8 text-sm text-neutral-600">
        Nenhum orçamento para imprimir. Volte ao editor e clique em <b>Gerar PDF</b>.
      </div>
    );
  }
  return (
    <div className="doc-print" data-pronto={pronto ? "1" : "0"} style={{ background: "#fff" }}>
      <DocProvider p={data.proposta} cfg={data.config} editable={false}>
        <Documento />
      </DocProvider>
    </div>
  );
}
