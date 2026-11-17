import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { DEFAULT_CONFIG, loadPrintPayload } from "@/doc/config";
import { origemExtensaoPai, receberDaExtensao, type PrintPayload } from "@/doc/extensao";
import { DocProvider } from "@/doc/context";
import { Documento } from "@/doc/Documento";
import { FIXTURES } from "@/doc/fixtures";
import { fmtDataHora } from "@/doc/historico";
import { tipoEvento } from "@/doc/pages/P1Capa";
import { calcular } from "@/doc/pricing";
import type { Proposta } from "@/doc/types";
import { APP_VERSAO } from "@/versao";

type Search = { fixture?: string; auto?: string; v?: string };

export const Route = createFileRoute("/imprimir")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>): Search => ({
    ...(typeof s["fixture"] === "string" ? { fixture: s["fixture"] } : {}),
    ...(typeof s["auto"] === "string" ? { auto: s["auto"] } : {}),
    ...(typeof s["v"] === "string" ? { v: s["v"] } : {}),
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
  const [data, setData] = useState<PrintPayload | null>(null);
  const [pronto, setPronto] = useState(false);

  const [aguardandoExt, setAguardandoExt] = useState(false);

  useEffect((): (() => void) | undefined => {
    const fx = fixture ? FIXTURES[fixture] : undefined;
    if (fx) {
      setData({ proposta: fx(), config: DEFAULT_CONFIG });
      return undefined;
    }
    // Aberta pela aba de impressão da extensão: o orçamento chega por mensagem.
    if (origemExtensaoPai()) {
      setAguardandoExt(true);
      return receberDaExtensao((payload) => {
        setAguardandoExt(false);
        setData(payload);
      });
    }
    setData(loadPrintPayload());
    return undefined;
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

  if (!data && aguardandoExt) {
    return <div className="p-8 text-sm text-neutral-600">Preparando o orçamento…</div>;
  }
  if (!data) {
    return (
      <div className="p-8 text-sm text-neutral-600">
        Nenhum orçamento para imprimir. Volte ao editor e clique em <b>Gerar PDF</b>.
      </div>
    );
  }
  const calc = calcular(data.proposta, data.config);
  const regimeTxt =
    calc.regime === "semAlcool"
      ? "drinks sem álcool (2 cards, valores digitados)"
      : calc.regime === "openbar"
        ? "open bar (4 opções)"
        : "coquetéis limitados";
  const versaoDiferente = !!data.versao && data.versao !== APP_VERSAO;
  return (
    <div className="doc-print" data-pronto={pronto ? "1" : "0"} style={{ background: "#fff" }}>
      {/* faixa de conferência — não sai no PDF (.no-print) */}
      <div
        className="no-print"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "8px 16px",
          padding: "8px 16px",
          background: versaoDiferente ? "#fef3c7" : "#f5f5f4",
          borderBottom: "1px solid #e7e5e4",
          font: "13px system-ui, sans-serif",
          color: "#292524",
        }}
      >
        <span>
          <b>{data.proposta.nome.trim() || "(sem nome)"}</b>
          {" · "}
          {tipoEvento(data.proposta.evento, data.proposta.eventoOutro) || "evento"}
          {data.proposta.data ? ` · ${data.proposta.data}` : ""}
          {" · página 4: "}
          <b>{regimeTxt}</b>
        </span>
        <span style={{ color: "#78716c" }}>
          {data.geradoEm ? `gerado ${fmtDataHora(new Date(data.geradoEm).toISOString())}` : ""}
          {" · "}
          {APP_VERSAO}
        </span>
        {versaoDiferente ? (
          <span style={{ color: "#92400e" }}>
            Esta página está em outra versão ({APP_VERSAO}) que o editor ({data.versao}). Recarregue
            com Ctrl+Shift+R.
          </span>
        ) : null}
        <span style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => window.print()}
            style={{
              padding: "4px 12px",
              borderRadius: 6,
              border: 0,
              background: "#c2695c",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Imprimir / salvar PDF
          </button>
          <button
            type="button"
            onClick={() => window.close()}
            style={{
              padding: "4px 12px",
              borderRadius: 6,
              border: "1px solid #d6d3d1",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Fechar
          </button>
        </span>
      </div>
      <DocProvider p={data.proposta} cfg={data.config} editable={false}>
        <Documento />
      </DocProvider>
    </div>
  );
}
