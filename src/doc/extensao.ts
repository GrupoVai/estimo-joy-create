// Ponte com a extensão do Chrome (pasta extension/).
//
// Na janelinha da extensão o site roda num quadro dentro de uma página
// chrome-extension://. Ali o Chrome não abre a caixa de impressão, e uma aba
// nova do site usa outro localStorage. Por isso, nesse caso, o orçamento é
// entregue por mensagem à extensão, que abre a própria aba de impressão.
// No site normal (aba ou janela) nada disto é usado.

import type { Config, Proposta } from "./types";

export type PrintPayload = { proposta: Proposta; config: Config };

export const MSG = {
  imprimir: "coktelitas-ext-imprimir", // site (popup) -> extensão
  aceito: "coktelitas-ext-aceito", // extensão -> site (popup)
  erro: "coktelitas-ext-erro", // extensão -> site (popup)
  pronto: "coktelitas-ext-pronto", // /imprimir -> aba da extensão
  payload: "coktelitas-ext-payload", // aba da extensão -> /imprimir
  recebido: "coktelitas-ext-recebido", // /imprimir -> aba da extensão
} as const;

/** Origem chrome-extension:// do quadro pai, ou null se não estiver na extensão. */
export function origemExtensaoPai(): string | null {
  if (typeof window === "undefined" || window.parent === window) return null;
  const anc = window.location.ancestorOrigins;
  const pai = anc && anc.length > 0 ? anc[0] : null;
  return pai && pai.startsWith("chrome-extension://") ? pai : null;
}

/**
 * Envia o orçamento para a extensão imprimir. Resolve quando a extensão
 * confirma; rejeita com mensagem legível se não houver resposta ou houver erro.
 */
export function imprimirPelaExtensao(origem: string, payload: PrintPayload): Promise<void> {
  return new Promise((resolve, reject) => {
    const fim = (fn: () => void) => {
      clearTimeout(t);
      window.removeEventListener("message", onMsg);
      fn();
    };
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== origem || e.source !== window.parent) return;
      if (e.data?.tipo === MSG.aceito) fim(resolve);
      else if (e.data?.tipo === MSG.erro)
        fim(() => reject(new Error(String(e.data.mensagem || "Erro na extensão."))));
    };
    const t = setTimeout(
      () =>
        fim(() =>
          reject(
            new Error(
              "A extensão não respondeu. Atualize a extensão (versão 1.1 ou mais nova) ou use o botão Janela.",
            ),
          ),
        ),
      3000,
    );
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ tipo: MSG.imprimir, payload }, origem);
  });
}

/** Na página /imprimir aberta pela extensão: pede e recebe o orçamento. */
export function receberDaExtensao(onPayload: (p: PrintPayload) => void): () => void {
  const onMsg = (e: MessageEvent) => {
    if (e.source !== window.parent || !e.origin.startsWith("chrome-extension://")) return;
    if (e.data?.tipo !== MSG.payload || !e.data.payload) return;
    onPayload(e.data.payload as PrintPayload);
    window.parent.postMessage({ tipo: MSG.recebido }, e.origin);
  };
  window.addEventListener("message", onMsg);
  const origem = origemExtensaoPai();
  if (origem) window.parent.postMessage({ tipo: MSG.pronto }, origem);
  return () => window.removeEventListener("message", onMsg);
}
