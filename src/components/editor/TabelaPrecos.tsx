// Tela "Tabela de preços": tudo que o motor usa, editável e salvo no navegador.
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Download, Plus, RotateCcw, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_CONFIG, loadConfig, saveConfig } from "@/doc/config";
import type { Config, MenuItem } from "@/doc/types";

function Num({
  value,
  onChange,
  step = 1,
  className,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  className?: string;
}) {
  return (
    <Input
      type="number"
      step={step}
      className={`h-8 text-xs ${className ?? ""}`}
      value={Number.isFinite(value) ? value : 0}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
    />
  );
}

function Bloco({
  titulo,
  children,
  desc,
}: {
  titulo: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-4">
      <h2 className="text-sm font-semibold">{titulo}</h2>
      {desc ? <p className="mb-3 text-xs text-neutral-500">{desc}</p> : <div className="mb-3" />}
      {children}
    </section>
  );
}

export function TabelaPrecos() {
  const [cfg, setCfg] = useState<Config | null>(null);
  const [salvo, setSalvo] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCfg(loadConfig());
  }, []);

  if (!cfg) return <div className="p-8 text-sm text-neutral-500">Carregando…</div>;
  const c = cfg;
  const up = (patch: Partial<Config>) => {
    setCfg({ ...c, ...patch });
    setSalvo(false);
  };
  const salvar = () => {
    saveConfig(c);
    setSalvo(true);
  };
  const exportar = () => {
    const blob = new Blob([JSON.stringify(c, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "coktelitas-tabela-de-precos.json";
    a.click();
  };
  const importar = (f: File) => {
    f.text().then((t) => {
      try {
        const parsed = JSON.parse(t) as Partial<Config>;
        setCfg({ ...DEFAULT_CONFIG, ...parsed });
        setSalvo(false);
      } catch {
        window.alert("Arquivo inválido.");
      }
    });
  };
  const setCatalogo = (catalogo: MenuItem[]) => up({ catalogo });
  const anos = Object.keys(c.openBar.acrescimos).sort();

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <header className="sticky top-0 z-10 flex h-12 items-center gap-2 border-b border-neutral-200 bg-white px-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">
            <ArrowLeft /> Voltar
          </Link>
        </Button>
        <span className="text-sm font-semibold">Tabela de preços e catálogo</span>
        <div className="ml-auto flex items-center gap-1">
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && importar(e.target.files[0])}
          />
          <Button variant="ghost" size="sm" onClick={() => fileRef.current?.click()}>
            <Upload /> Importar
          </Button>
          <Button variant="ghost" size="sm" onClick={exportar}>
            <Download /> Exportar backup
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (
                window.confirm(
                  "Voltar todos os valores para a tabela original (planilha 2026/2027)?",
                )
              ) {
                setCfg(DEFAULT_CONFIG);
                setSalvo(false);
              }
            }}
          >
            <RotateCcw /> Padrão
          </Button>
          <Button size="sm" onClick={salvar} className="bg-[#c2695c] text-white hover:bg-[#a9574b]">
            {salvo ? "Salvo ✓" : "Salvar"}
          </Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-4 p-4 md:grid-cols-2">
        <Bloco
          titulo="Regra geral"
          desc="A partir de quantos convidados o orçamento vira open bar."
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Limite open bar (convidados)</Label>
              <Num value={c.limiteOpenBar} onChange={(v) => up({ limiteOpenBar: Math.round(v) })} />
            </div>
            <div>
              <Label className="text-xs">Horas-base da tabela</Label>
              <Num
                value={c.openBar.horasBase}
                onChange={(v) => up({ openBar: { ...c.openBar, horasBase: v || 4 } })}
              />
            </div>
          </div>
          <div className="mt-3">
            <Label className="text-xs">Tipos de evento (um por linha)</Label>
            <textarea
              className="mt-1 w-full rounded-md border border-neutral-300 p-2 text-xs"
              rows={5}
              value={c.eventos.join("\n")}
              onChange={(e) =>
                up({
                  eventos: e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>
        </Bloco>

        <Bloco
          titulo="Acréscimo por ano e quadrimestre (%)"
          desc="Jan–Abr · Mai–Ago · Set–Dez. 2026 é a base (0%)."
        >
          {anos.map((ano) => {
            const t = c.openBar.acrescimos[ano] ?? [0, 0, 0];
            return (
              <div key={ano} className="mb-2 grid grid-cols-4 items-center gap-2">
                <span className="text-xs font-semibold">{ano}</span>
                {[0, 1, 2].map((q) => (
                  <Num
                    key={q}
                    value={t[q] ?? 0}
                    onChange={(v) => {
                      const nt: [number, number, number] = [t[0] ?? 0, t[1] ?? 0, t[2] ?? 0];
                      nt[q] = v;
                      up({
                        openBar: {
                          ...c.openBar,
                          acrescimos: { ...c.openBar.acrescimos, [ano]: nt },
                        },
                      });
                    }}
                  />
                ))}
              </div>
            );
          })}
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const last = anos[anos.length - 1];
              const novo = String((parseInt(last ?? "2027", 10) || 2027) + 1);
              const base = (last && c.openBar.acrescimos[last]) || [0, 0, 0];
              up({
                openBar: {
                  ...c.openBar,
                  acrescimos: {
                    ...c.openBar.acrescimos,
                    [novo]: [...base] as [number, number, number],
                  },
                },
              });
            }}
          >
            <Plus /> Adicionar ano
          </Button>
        </Bloco>

        <Bloco
          titulo="Open bar — R$ por pessoa (base 4h, 2026)"
          desc="Uma linha por aba da planilha. Opções: 1 Absolut · 2 Wyborowa · 3 Smirnoff · 4 bebida do cliente."
        >
          <div className="grid grid-cols-[70px_repeat(4,1fr)_28px] items-center gap-1 text-[11px] text-neutral-500">
            <span>Conv.</span>
            <span>Op. 1</span>
            <span>Op. 2</span>
            <span>Op. 3</span>
            <span>Op. 4</span>
            <span />
          </div>
          {c.openBar.faixas.map((f, i) => (
            <div
              key={i}
              className="mt-1 grid grid-cols-[70px_repeat(4,1fr)_28px] items-center gap-1"
            >
              <Num
                value={f.convidados}
                onChange={(v) =>
                  up({
                    openBar: {
                      ...c.openBar,
                      faixas: c.openBar.faixas.map((x, j) =>
                        j === i ? { ...x, convidados: Math.round(v) } : x,
                      ),
                    },
                  })
                }
              />
              {[0, 1, 2, 3].map((k) => (
                <Num
                  key={k}
                  value={f.pessoa[k] ?? 0}
                  onChange={(v) => {
                    const pessoa = [...f.pessoa] as [number, number, number, number];
                    pessoa[k] = v;
                    up({
                      openBar: {
                        ...c.openBar,
                        faixas: c.openBar.faixas.map((x, j) => (j === i ? { ...x, pessoa } : x)),
                      },
                    });
                  }}
                />
              ))}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-red-600"
                onClick={() =>
                  up({
                    openBar: { ...c.openBar, faixas: c.openBar.faixas.filter((_, j) => j !== i) },
                  })
                }
              >
                <Trash2 />
              </Button>
            </div>
          ))}
          <Button
            size="sm"
            variant="outline"
            className="mt-2"
            onClick={() => {
              const last = c.openBar.faixas[c.openBar.faixas.length - 1];
              up({
                openBar: {
                  ...c.openBar,
                  faixas: [
                    ...c.openBar.faixas,
                    {
                      convidados: (last?.convidados ?? 500) + 100,
                      pessoa: [...(last?.pessoa ?? [52, 47, 42, 35])] as [
                        number,
                        number,
                        number,
                        number,
                      ],
                    },
                  ],
                },
              });
            }}
          >
            <Plus /> Adicionar faixa
          </Button>
        </Bloco>

        <Bloco
          titulo="Coquetéis limitados (< limite)"
          desc="Unidades das duas opções e R$/unidade por faixa de bebida: cliente · Smirnoff · Wyborowa · Absolut."
        >
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Opção 1 (unidades)</Label>
              <Num
                value={c.limitado.unidades[0]}
                onChange={(v) =>
                  up({
                    limitado: { ...c.limitado, unidades: [Math.round(v), c.limitado.unidades[1]] },
                  })
                }
              />
            </div>
            <div>
              <Label className="text-xs">Opção 2 (unidades)</Label>
              <Num
                value={c.limitado.unidades[1]}
                onChange={(v) =>
                  up({
                    limitado: { ...c.limitado, unidades: [c.limitado.unidades[0], Math.round(v)] },
                  })
                }
              />
            </div>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {["Cliente", "Smirnoff", "Wyborowa", "Absolut"].map((n, k) => (
              <div key={n}>
                <Label className="text-xs">{n}</Label>
                <Num
                  step={0.5}
                  value={c.limitado.unitarios[k] ?? 0}
                  onChange={(v) => {
                    const u = [...c.limitado.unitarios] as [number, number, number, number];
                    u[k] = v;
                    up({ limitado: { ...c.limitado, unitarios: u } });
                  }}
                />
              </div>
            ))}
          </div>
          <h3 className="mt-4 text-xs font-semibold">Cafeteria (padrão de nova proposta)</h3>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Pacote mínimo</Label>
              <Num
                value={c.cafeteria.pacote}
                onChange={(v) => up({ cafeteria: { ...c.cafeteria, pacote: Math.round(v) } })}
              />
            </div>
            <p className="self-end pb-2 text-[11px] text-neutral-400">
              O R$/unidade está na tabela por ano, acima.
            </p>
          </div>
        </Bloco>

        <Bloco
          titulo="Valores por ano do evento (R$)"
          desc="Seguro de taças e copos · cada quebra/extravio fora do seguro · cafeteria por unidade. Evento em ano sem linha usa o último ano anterior."
        >
          <div className="grid grid-cols-4 items-center gap-2 text-[11px] text-neutral-500">
            <span>Ano</span>
            <span>Seguro copos</span>
            <span>Quebra</span>
            <span>Cafeteria/un.</span>
          </div>
          {Object.keys(c.porAno)
            .sort()
            .map((ano) => {
              const v = c.porAno[ano] ?? { seguroCopos: 0, quebra: 0, cafeteriaUnitario: 0 };
              const set = (patch: Partial<typeof v>) =>
                up({ porAno: { ...c.porAno, [ano]: { ...v, ...patch } } });
              return (
                <div key={ano} className="mb-2 grid grid-cols-4 items-center gap-2">
                  <span className="text-xs font-semibold">{ano}</span>
                  <Num value={v.seguroCopos} onChange={(x) => set({ seguroCopos: x })} />
                  <Num value={v.quebra} onChange={(x) => set({ quebra: x })} />
                  <Num
                    step={0.5}
                    value={v.cafeteriaUnitario}
                    onChange={(x) => set({ cafeteriaUnitario: x })}
                  />
                </div>
              );
            })}
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const anosPA = Object.keys(c.porAno).sort();
              const last = anosPA[anosPA.length - 1];
              const novo = String((parseInt(last ?? "2027", 10) || 2027) + 1);
              const base = (last && c.porAno[last]) || {
                seguroCopos: 0,
                quebra: 0,
                cafeteriaUnitario: 0,
              };
              up({ porAno: { ...c.porAno, [novo]: { ...base } } });
            }}
          >
            <Plus /> Adicionar ano
          </Button>
        </Bloco>

        <Bloco
          titulo="Catálogo de drinks"
          desc="Marque se contém álcool e em quais menus sugeridos entra (C = com álcool, M = com e sem). Sem álcool entra automaticamente no menu 'sem álcool'."
        >
          <div className="space-y-2">
            {c.catalogo.map((d, i) => (
              <div key={d.id} className="rounded-md border border-neutral-200 p-2">
                <div className="flex items-center gap-2">
                  <Input
                    className="h-8 flex-1 text-xs font-semibold uppercase"
                    value={d.nome}
                    onChange={(e) =>
                      setCatalogo(
                        c.catalogo.map((x, j) => (j === i ? { ...x, nome: e.target.value } : x)),
                      )
                    }
                  />
                  <label className="flex items-center gap-1 text-[11px]">
                    <input
                      type="checkbox"
                      checked={d.alcool}
                      onChange={(e) =>
                        setCatalogo(
                          c.catalogo.map((x, j) =>
                            j === i ? { ...x, alcool: e.target.checked } : x,
                          ),
                        )
                      }
                    />{" "}
                    álcool
                  </label>
                  <label className="flex items-center gap-1 text-[11px]" title="Menu com álcool">
                    <input
                      type="checkbox"
                      checked={c.presets.com.includes(d.id)}
                      onChange={(e) =>
                        up({
                          presets: {
                            ...c.presets,
                            com: e.target.checked
                              ? [...c.presets.com, d.id]
                              : c.presets.com.filter((x) => x !== d.id),
                          },
                        })
                      }
                    />{" "}
                    C
                  </label>
                  <label
                    className="flex items-center gap-1 text-[11px]"
                    title="Menu com e sem álcool"
                  >
                    <input
                      type="checkbox"
                      checked={c.presets.comESem.includes(d.id)}
                      onChange={(e) =>
                        up({
                          presets: {
                            ...c.presets,
                            comESem: e.target.checked
                              ? [...c.presets.comESem, d.id]
                              : c.presets.comESem.filter((x) => x !== d.id),
                          },
                        })
                      }
                    />{" "}
                    M
                  </label>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-600"
                    onClick={() => setCatalogo(c.catalogo.filter((_, j) => j !== i))}
                  >
                    <Trash2 />
                  </Button>
                </div>
                <textarea
                  className="mt-1 w-full rounded-md border border-neutral-200 p-1 text-xs"
                  rows={2}
                  value={d.ingredientes}
                  onChange={(e) =>
                    setCatalogo(
                      c.catalogo.map((x, j) =>
                        j === i ? { ...x, ingredientes: e.target.value } : x,
                      ),
                    )
                  }
                />
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setCatalogo([
                  ...c.catalogo,
                  { id: `drink-${Date.now()}`, nome: "NOVO DRINK", ingredientes: "", alcool: true },
                ])
              }
            >
              <Plus /> Novo drink
            </Button>
          </div>
        </Bloco>

        <Bloco titulo="Menu de cafés (página 5)">
          <div className="space-y-2">
            {c.cafes.map((d, i) => (
              <div key={d.id} className="rounded-md border border-neutral-200 p-2">
                <div className="flex items-center gap-2">
                  <Input
                    className="h-8 flex-1 text-xs font-semibold uppercase"
                    value={d.nome}
                    onChange={(e) =>
                      up({
                        cafes: c.cafes.map((x, j) =>
                          j === i ? { ...x, nome: e.target.value } : x,
                        ),
                      })
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-600"
                    onClick={() => up({ cafes: c.cafes.filter((_, j) => j !== i) })}
                  >
                    <Trash2 />
                  </Button>
                </div>
                <textarea
                  className="mt-1 w-full rounded-md border border-neutral-200 p-1 text-xs"
                  rows={2}
                  value={d.ingredientes}
                  onChange={(e) =>
                    up({
                      cafes: c.cafes.map((x, j) =>
                        j === i ? { ...x, ingredientes: e.target.value } : x,
                      ),
                    })
                  }
                />
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                up({
                  cafes: [
                    ...c.cafes,
                    {
                      id: `cafe-${Date.now()}`,
                      nome: "NOVO CAFÉ",
                      ingredientes: "",
                      alcool: false,
                    },
                  ],
                })
              }
            >
              <Plus /> Novo café
            </Button>
          </div>
        </Bloco>
      </div>
    </div>
  );
}
