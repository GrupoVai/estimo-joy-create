import { describe, expect, it } from "vitest";

import { DEFAULT_CONFIG, novaProposta } from "./config";
import {
  acrescimo,
  brlBR,
  calcular,
  calcularOpenBar,
  faixaOpenBar,
  numBR,
  parseBR,
  regime,
} from "./pricing";

const cfg = DEFAULT_CONFIG;

describe("R1 regime", () => {
  it("menos de 70 convidados => limitado; 70 ou mais => open bar", () => {
    expect(regime(20, cfg)).toBe("limitado");
    expect(regime(69, cfg)).toBe("limitado");
    expect(regime(70, cfg)).toBe("openbar");
    expect(regime(null, cfg)).toBe("limitado");
  });
});

describe("R2 open bar (planilha CALCULOS OPEN BAR)", () => {
  it("usa a aba mais próxima", () => {
    expect(faixaOpenBar(90, cfg)).toBe(100);
    expect(faixaOpenBar(125, cfg)).toBe(120);
    expect(faixaOpenBar(190, cfg)).toBe(180);
    expect(faixaOpenBar(230, cfg)).toBe(250);
    expect(faixaOpenBar(800, cfg)).toBe(500);
  });

  it("reproduz as células-base da planilha (2026, 4h)", () => {
    const p = { ...novaProposta(cfg), convidados: 150, duracao: 4, data: "10/03/2026" };
    expect(calcularOpenBar(p, cfg).valores).toEqual([8100, 7350, 6600, 5250]);
    const p2 = { ...p, convidados: 500 };
    expect(calcularOpenBar(p2, cfg).valores).toEqual([26000, 23500, 21000, 17500]);
  });

  it("horas são lineares (base 4h)", () => {
    const p = { ...novaProposta(cfg), convidados: 100, duracao: 2, data: "10/03/2026" };
    expect(calcularOpenBar(p, cfg).valores).toEqual([2750, 2500, 2250, 1750]);
    const p8 = { ...p, duracao: 8 };
    expect(calcularOpenBar(p8, cfg).valores).toEqual([11000, 10000, 9000, 7000]);
  });

  it("acréscimo 2027 por quadrimestre", () => {
    expect(acrescimo("10/02/2027", cfg).pct).toBe(5);
    expect(acrescimo("24/07/2027", cfg).pct).toBe(10);
    expect(acrescimo("01/12/2027", cfg).pct).toBe(15);
    expect(acrescimo("01/12/2026", cfg).pct).toBe(0);
    expect(acrescimo("01/01/2028", cfg).aviso).toMatch(/2028/);
  });

  it("caso real: Alessandra — 90 convidados, 4h, 24/07/2027", () => {
    const p = { ...novaProposta(cfg), convidados: 90, duracao: 4, data: "24/07/2027" };
    const c = calcularOpenBar(p, cfg);
    expect(c.faixa).toBe(100);
    expect(c.acrescimoPct).toBe(10);
    expect(c.valores.map((v) => Math.round(v))).toEqual([6050, 5500, 4950, 3850]);
  });

  it("ajuste geral aplica em todas as opções", () => {
    const p = {
      ...novaProposta(cfg),
      convidados: 100,
      duracao: 4,
      data: "10/03/2026",
      ajuste: { tipo: "pct" as const, valor: -10 },
    };
    expect(calcularOpenBar(p, cfg).valores).toEqual([4950, 4500, 4050, 3150]);
  });
});

describe("R3 limitado (PDF Tallita)", () => {
  it("150/200 unidades × R$16/17/18/20", () => {
    const c = calcular({ ...novaProposta(cfg), convidados: 20 }, cfg);
    expect(c.regime).toBe("limitado");
    expect(c.limitado.totais[0]).toEqual([2400, 2550, 2700, 3000]);
    expect(c.limitado.totais[1]).toEqual([3200, 3400, 3600, 4000]);
  });
});

describe("formatação", () => {
  it("formata em padrão brasileiro", () => {
    expect(numBR(6050)).toBe("6.050,00");
    expect(brlBR(2700)).toBe("R$ 2.700,00");
    expect(parseBR("R$ 1.234,50")).toBe(1234.5);
    expect(parseBR("350")).toBe(350);
    expect(parseBR("")).toBeNull();
  });
});

describe("parâmetros manuais (painel 'Coquetéis página 4')", () => {
  it("força o regime independente do nº de convidados", () => {
    const p = { ...novaProposta(cfg), convidados: 30 };
    expect(calcular(p, cfg).regime).toBe("limitado");
    expect(calcular({ ...p, precos: { ...p.precos, regime: "openbar" } }, cfg).regime).toBe(
      "openbar",
    );
  });

  it("faixa e acréscimo manuais substituem os automáticos", () => {
    const p = { ...novaProposta(cfg), convidados: 90, duracao: 4, data: "24/07/2027" };
    const auto = calcularOpenBar(p, cfg);
    expect(auto.faixa).toBe(100);
    expect(auto.acrescimoPct).toBe(10);
    const manual = calcularOpenBar(
      { ...p, precos: { ...p.precos, faixaOpenBar: 150, acrescimoPct: 0 } },
      cfg,
    );
    expect(manual.faixa).toBe(150);
    expect(manual.acrescimoPct).toBe(0);
    const row = cfg.openBar.faixas.find((f) => f.convidados === 150)!;
    expect(manual.valores[0]).toBeCloseTo(150 * row.pessoa[0], 6);
    // aviso de data só vale quando o acréscimo é automático
    const semData = calcularOpenBar({ ...p, data: "" }, cfg);
    expect(semData.avisos.length).toBeGreaterThan(0);
    expect(
      calcularOpenBar({ ...p, data: "", precos: { ...p.precos, acrescimoPct: 5 } }, cfg).avisos,
    ).toEqual([]);
  });

  it("unidades e R$/unidade manuais no limitado", () => {
    const p = { ...novaProposta(cfg), convidados: 30 };
    const c = calcular(
      {
        ...p,
        precos: {
          ...p.precos,
          limitadoUnidades: [100, null],
          limitadoUnitarios: [null, 20, null, null],
        },
      },
      cfg,
    );
    expect(c.limitado.unidades).toEqual([100, 200]);
    expect(c.limitado.unitarios).toEqual([16, 20, 18, 20]);
    expect(c.limitado.totais[0]).toEqual([1600, 2000, 1800, 2000]);
    expect(c.limitado.totais[1]).toEqual([3200, 4000, 3600, 4000]);
  });
});
