import { describe, expect, it } from "vitest";

import { DEFAULT_CONFIG, novaProposta } from "./config";
import {
  duplicarProposta,
  exportarHistorico,
  importarHistorico,
  removerOrcamento,
  salvarVersao,
  temAlteracoes,
  ultimaVersao,
  type OrcamentoSalvo,
} from "./historico";

const cfg = DEFAULT_CONFIG;

function proposta(nome = "Sarah") {
  return { ...novaProposta(cfg), nome, convidados: 90, duracao: 4, data: "24/07/2027" };
}

describe("histórico de orçamentos", () => {
  it("salva, versiona só quando muda e reabre com desconto como nova versão", () => {
    const p = proposta();
    let h: OrcamentoSalvo[] = [];

    const r1 = salvarVersao(p, cfg, h);
    h = r1.historico;
    expect(r1.novaVersao).toBe(true);
    expect(h).toHaveLength(1);
    expect(ultimaVersao(h[0]!).valores[0]).toBe(6050);
    expect(temAlteracoes(p, h)).toBe(false);

    // salvar de novo sem mudar nada: não cria versão
    const r2 = salvarVersao(p, cfg, h);
    h = r2.historico;
    expect(r2.novaVersao).toBe(false);
    expect(h[0]!.versoes).toHaveLength(1);

    // cliente pediu desconto: mesmo id, ajuste -10 %
    const comDesconto = { ...p, ajuste: { tipo: "pct" as const, valor: -10 } };
    expect(temAlteracoes(comDesconto, h)).toBe(true);
    const r3 = salvarVersao(comDesconto, cfg, h);
    h = r3.historico;
    expect(h).toHaveLength(1);
    expect(h[0]!.versoes).toHaveLength(2);
    expect(ultimaVersao(h[0]!).valores[0]).toBe(5445);
    expect(h[0]!.versoes[0]!.valores[0]).toBe(6050); // versão antiga preservada
  });

  it("duplicar gera outro orçamento; remover tira do histórico", () => {
    const p = proposta();
    let h = salvarVersao(p, cfg, []).historico;
    const copia = duplicarProposta(p);
    expect(copia.id).not.toBe(p.id);
    expect(copia.nome).toBe(p.nome);
    h = salvarVersao(copia, cfg, h).historico;
    expect(h).toHaveLength(2);
    h = removerOrcamento(p.id, h);
    expect(h.map((e) => e.id)).toEqual([copia.id]);
  });

  it("exporta e importa mesclando pelo id", () => {
    const a = proposta("A");
    const b = proposta("B");
    const h1 = salvarVersao(a, cfg, []).historico;
    const h2 = salvarVersao(b, cfg, salvarVersao(a, cfg, []).historico).historico;
    const mesclado = importarHistorico(exportarHistorico(h2), h1);
    expect(mesclado.map((e) => e.id).sort()).toEqual([a.id, b.id].sort());
    expect(() => importarHistorico('{"x":1}', [])).not.toThrow();
    expect(() => importarHistorico('{"historico": 5}', [])).toThrow();
  });

  it("proposta nova sem nada preenchido não conta como alterada", () => {
    expect(temAlteracoes(novaProposta(cfg), [])).toBe(false);
    expect(temAlteracoes({ ...novaProposta(cfg), nome: "X" }, [])).toBe(true);
  });
});
