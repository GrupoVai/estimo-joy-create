// Histórico de orçamentos (localStorage): cada orçamento tem um id e guarda as versões
// salvas (uma por "Salvar"/"Gerar PDF"), para reabrir, dar desconto e gerar de novo.
import { novoId, safeGet, safeSet } from "./config";
import { calcular } from "./pricing";
import type { Config, Proposta } from "./types";

export interface Versao {
  /** ISO 8601 de quando foi salva */
  em: string;
  proposta: Proposta;
  /** valores da página 4 no momento do salvamento (open bar: opções 1–4; limitado: opção 1 por faixa) */
  valores: number[];
}

export interface OrcamentoSalvo {
  id: string;
  criadoEm: string;
  atualizadoEm: string;
  /** da mais antiga para a mais nova */
  versoes: Versao[];
}

const KEY = "coktelitas.historico.v1";
export const MAX_VERSOES = 20;

export function loadHistorico(): OrcamentoSalvo[] {
  const raw = safeGet(KEY);
  if (!raw) return [];
  try {
    const h = JSON.parse(raw) as unknown;
    return Array.isArray(h) ? h.filter(entradaValida) : [];
  } catch {
    return [];
  }
}

export function saveHistorico(h: OrcamentoSalvo[]) {
  safeSet(KEY, JSON.stringify(h));
}

function entradaValida(e: unknown): e is OrcamentoSalvo {
  if (!e || typeof e !== "object") return false;
  const o = e as Partial<OrcamentoSalvo>;
  return (
    typeof o.id === "string" &&
    Array.isArray(o.versoes) &&
    o.versoes.length > 0 &&
    o.versoes.every(
      (v) => v && typeof v.em === "string" && v.proposta && typeof v.proposta === "object",
    )
  );
}

/** Valores que resumem a página 4 (para listar e detectar mudança de tabela). */
export function valoresResumo(p: Proposta, cfg: Config): number[] {
  const c = calcular(p, cfg);
  const arred = (v: number) => Math.round(v * 100) / 100;
  if (c.regime === "openbar") return c.openBar.valores.map(arred);
  return c.limitado.totais[0].map(arred);
}

/** Última versão salva de um orçamento. */
export function ultimaVersao(e: OrcamentoSalvo): Versao {
  return e.versoes[e.versoes.length - 1] as Versao;
}

/** Proposta sem o que não importa para "mudou ou não" (comparação estável). */
export function assinatura(p: Proposta): string {
  return JSON.stringify(p);
}

/**
 * Salva a proposta como nova versão do orçamento (ou cria o orçamento).
 * Se nada mudou desde a última versão, só atualiza a data.
 */
export function salvarVersao(
  p: Proposta,
  cfg: Config,
  h: OrcamentoSalvo[],
): { historico: OrcamentoSalvo[]; entrada: OrcamentoSalvo; novaVersao: boolean } {
  const agora = new Date().toISOString();
  const proposta = JSON.parse(JSON.stringify(p)) as Proposta;
  const versao: Versao = { em: agora, proposta, valores: valoresResumo(p, cfg) };
  const idx = h.findIndex((e) => e.id === p.id);
  if (idx === -1) {
    const entrada: OrcamentoSalvo = {
      id: p.id,
      criadoEm: agora,
      atualizadoEm: agora,
      versoes: [versao],
    };
    return { historico: [entrada, ...h], entrada, novaVersao: true };
  }
  const atual = h[idx] as OrcamentoSalvo;
  const mudou = assinatura(ultimaVersao(atual).proposta) !== assinatura(proposta);
  const versoes = mudou ? [...atual.versoes, versao].slice(-MAX_VERSOES) : atual.versoes;
  const entrada: OrcamentoSalvo = { ...atual, atualizadoEm: agora, versoes };
  const historico = [entrada, ...h.filter((e) => e.id !== p.id)];
  return { historico, entrada, novaVersao: mudou };
}

export function removerOrcamento(id: string, h: OrcamentoSalvo[]): OrcamentoSalvo[] {
  return h.filter((e) => e.id !== id);
}

/** Cópia independente (novo id) para virar outro orçamento. */
export function duplicarProposta(p: Proposta): Proposta {
  return { ...(JSON.parse(JSON.stringify(p)) as Proposta), id: novoId() };
}

/** Houve mudanças no editor desde a última versão salva? */
export function temAlteracoes(p: Proposta, h: OrcamentoSalvo[]): boolean {
  const e = h.find((x) => x.id === p.id);
  if (!e) return p.nome.trim() !== "" || p.data !== "" || p.convidados !== null;
  return assinatura(ultimaVersao(e).proposta) !== assinatura(p);
}

export function exportarHistorico(h: OrcamentoSalvo[]): string {
  return JSON.stringify({ app: "coktelitas-orcamentos", versao: 1, historico: h }, null, 2);
}

/** Mescla um backup exportado no histórico atual (orçamentos pelo id, versões pela data). */
export function importarHistorico(json: string, h: OrcamentoSalvo[]): OrcamentoSalvo[] {
  const dados = JSON.parse(json) as { historico?: unknown } | unknown[];
  const lista = Array.isArray(dados) ? dados : ((dados as { historico?: unknown }).historico ?? []);
  if (!Array.isArray(lista)) throw new Error("Arquivo não é um backup do histórico.");
  const mapa = new Map(h.map((e) => [e.id, e]));
  for (const e of lista) {
    if (!entradaValida(e)) continue;
    const atual = mapa.get(e.id);
    if (!atual) {
      mapa.set(e.id, e);
      continue;
    }
    const porData = new Map(atual.versoes.map((v) => [v.em, v]));
    for (const v of e.versoes) if (!porData.has(v.em)) porData.set(v.em, v);
    const versoes = [...porData.values()]
      .sort((a, b) => a.em.localeCompare(b.em))
      .slice(-MAX_VERSOES);
    mapa.set(e.id, {
      ...atual,
      criadoEm: atual.criadoEm < e.criadoEm ? atual.criadoEm : e.criadoEm,
      atualizadoEm: atual.atualizadoEm > e.atualizadoEm ? atual.atualizadoEm : e.atualizadoEm,
      versoes,
    });
  }
  return [...mapa.values()].sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm));
}

export function fmtDataHora(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
