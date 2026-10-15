// Motor de cálculo — regras R1 a R11 da especificação.
// Funções puras: entram proposta + config, saem valores sugeridos e avisos.
import type { Ajuste, Config, Proposta } from "./types";

export type Regime = "limitado" | "openbar";

export interface CalculoOpenBar {
  faixa: number; // aba da planilha usada
  acrescimoPct: number;
  valores: [number, number, number, number]; // opção 1..4, já com ajuste geral
  valoresBase: [number, number, number, number]; // sem ajuste geral
  avisos: string[];
}

export interface CalculoLimitado {
  unidades: [number, number];
  unitarios: [number, number, number, number];
  totais: [[number, number, number, number], [number, number, number, number]]; // [opção][faixa], com ajuste
}

export interface Calculo {
  regime: Regime;
  openBar: CalculoOpenBar;
  limitado: CalculoLimitado;
  cafeteriaTotal: number;
  avisos: string[];
}

/** R1 — regime pelo número de convidados. Sem convidados => limitado. */
export function regime(convidados: number | null, cfg: Config): Regime {
  return convidados !== null && convidados >= cfg.limiteOpenBar ? "openbar" : "limitado";
}

/** Data dd/mm/aaaa => {dia, mes, ano} ou null. */
export function parseData(data: string): { dia: number; mes: number; ano: number } | null {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(data.trim());
  if (!m) return null;
  const dia = Number(m[1]);
  const mes = Number(m[2]);
  const ano = Number(m[3]);
  if (mes < 1 || mes > 12 || dia < 1 || dia > 31) return null;
  return { dia, mes, ano };
}

/** Aba mais próxima da planilha (empate => a menor). */
export function faixaOpenBar(convidados: number, cfg: Config): number {
  const faixas = cfg.openBar.faixas;
  let melhor = faixas[0]?.convidados ?? 100;
  let dist = Infinity;
  for (const f of faixas) {
    const d = Math.abs(f.convidados - convidados);
    if (d < dist) {
      dist = d;
      melhor = f.convidados;
    }
  }
  return melhor;
}

/** Acréscimo (%) pelo ano/mês da data. Ano desconhecido => usa o maior ano cadastrado e avisa. */
export function acrescimo(data: string, cfg: Config): { pct: number; aviso: string | null } {
  const d = parseData(data);
  const anos = Object.keys(cfg.openBar.acrescimos).sort();
  if (!d)
    return {
      pct: 0,
      aviso: "Data do evento não informada ou inválida — preço calculado sem acréscimo.",
    };
  const quad = d.mes <= 4 ? 0 : d.mes <= 8 ? 1 : 2;
  const tabela = cfg.openBar.acrescimos[String(d.ano)];
  if (tabela) return { pct: tabela[quad] ?? 0, aviso: null };
  const ultimo = anos[anos.length - 1];
  const fallback = ultimo ? cfg.openBar.acrescimos[ultimo] : undefined;
  return {
    pct: fallback ? (fallback[quad] ?? 0) : 0,
    aviso: `Não há tabela para ${d.ano}; usando a de ${ultimo ?? "base"} como sugestão.`,
  };
}

export function aplicarAjuste(valor: number, ajuste: Ajuste | null): number {
  if (!ajuste || !Number.isFinite(ajuste.valor) || ajuste.valor === 0) return valor;
  return ajuste.tipo === "pct" ? valor * (1 + ajuste.valor / 100) : valor + ajuste.valor;
}

/** R2 — preço = convidados_faixa × R$/pessoa ÷ horasBase × horas × (1 + acréscimo). */
export function calcularOpenBar(p: Proposta, cfg: Config): CalculoOpenBar {
  const avisos: string[] = [];
  const convidados = p.convidados ?? cfg.limiteOpenBar;
  const manual = p.precos ?? {};
  const faixa = manual.faixaOpenBar ?? faixaOpenBar(convidados, cfg);
  const row = cfg.openBar.faixas.find((f) => f.convidados === faixa) ?? cfg.openBar.faixas[0];
  const horas = p.duracao ?? cfg.openBar.horasBase;
  if (horas < 2 || horas > 8)
    avisos.push(`Duração de ${horas}h está fora da tabela (2 a 8h) — valor extrapolado.`);
  const auto = acrescimo(p.data, cfg);
  const pct = manual.acrescimoPct ?? auto.pct;
  if (manual.acrescimoPct === null || manual.acrescimoPct === undefined) {
    if (auto.aviso) avisos.push(auto.aviso);
  }
  const pessoa = row?.pessoa ?? [0, 0, 0, 0];
  const base = pessoa.map(
    (v) => ((faixa * v) / cfg.openBar.horasBase) * horas * (1 + pct / 100),
  ) as [number, number, number, number];
  const valores = base.map((v) => aplicarAjuste(v, p.ajuste)) as [number, number, number, number];
  return { faixa, acrescimoPct: pct, valores, valoresBase: base, avisos };
}

/** R3 — limitado: unidades × R$/unidade por faixa de bebida. */
export function calcularLimitado(p: Proposta, cfg: Config): CalculoLimitado {
  const manual = p.precos ?? {};
  const unidades = cfg.limitado.unidades.map((u, i) => manual.limitadoUnidades?.[i] ?? u) as [
    number,
    number,
  ];
  const unitarios = cfg.limitado.unitarios.map((v, i) => manual.limitadoUnitarios?.[i] ?? v) as [
    number,
    number,
    number,
    number,
  ];
  const totais = unidades.map((u) =>
    unitarios.map((v) => aplicarAjuste(u * v, p.ajuste)),
  ) as CalculoLimitado["totais"];
  return { unidades, unitarios, totais };
}

export function calcular(p: Proposta, cfg: Config): Calculo {
  const r = p.precos?.regime ?? regime(p.convidados, cfg);
  const ob = calcularOpenBar(p, cfg);
  const lim = calcularLimitado(p, cfg);
  const cafeteriaTotal = p.cafeteria.pacote * p.cafeteria.unitario;
  const avisos = r === "openbar" ? ob.avisos : [];
  return { regime: r, openBar: ob, limitado: lim, cafeteriaTotal, avisos };
}

// ---------- formatação ----------
const brl = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** 6050 => "6.050,00" */
export function numBR(v: number): string {
  return brl.format(Math.round(v * 100) / 100);
}
/** 6050 => "R$ 6.050,00" */
export function brlBR(v: number): string {
  return `R$ ${numBR(v)}`;
}
/** "R$ 1.234,50" / "1234,5" / "1234.5" => 1234.5 (null se vazio/inválido) */
export function parseBR(s: string): number | null {
  const t = s.replace(/[^\d,.-]/g, "").trim();
  if (!t) return null;
  const norm = t.includes(",") ? t.replace(/\./g, "").replace(",", ".") : t;
  const n = Number(norm);
  return Number.isFinite(n) ? n : null;
}
