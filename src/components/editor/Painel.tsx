// Painel lateral de campos do orçamento.
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { precosAuto, SERVICOS_IDS } from "@/doc/config";
import { FAIXAS_LIMITADO } from "@/doc/pages/P4Limitado";
import { acrescimo, brlBR, calcular, faixaOpenBar, regime } from "@/doc/pricing";
import type { Bebidas, Config, MenuItem, PrecosManuais, Proposta, ServicoId } from "@/doc/types";

import { PrecoInput } from "./PrecoInput";

const SERVICO_NOME: Record<ServicoId, string> = {
  fonteCachaca: "Fonte de cachaça",
  torreEspumante: "Torre de espumante",
  tequileiro: "Tequileiro / cangaceiro",
  shotBalaCoco: "Shot bala de coco",
  shotBananinha: "Shot bananinha",
  pedraFloral: "Pedra floral",
  receptivo: "Receptivo",
  maquinaTaca: "Máquina para gelar taça",
};

function Secao({
  titulo,
  children,
  aberta = true,
}: {
  titulo: string;
  children: ReactNode;
  aberta?: boolean;
}) {
  const [open, setOpen] = useState(aberta);
  return (
    <section className="border-b border-neutral-200">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-[13px] font-semibold uppercase tracking-wide text-neutral-700 hover:bg-neutral-50"
      >
        {titulo}
        <span className="text-neutral-400">{open ? "−" : "+"}</span>
      </button>
      {open ? <div className="space-y-3 px-4 pb-4">{children}</div> : null}
    </section>
  );
}

function Campo({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-neutral-600">{label}</Label>
      {children}
      {hint ? <p className="text-[11px] text-neutral-400">{hint}</p> : null}
    </div>
  );
}

/** Input numérico em que vazio = automático (mostra o valor automático como placeholder). */
function NumAuto({
  value,
  auto,
  onChange,
  step,
  min,
  sufixo,
}: {
  value: number | null;
  auto: number;
  onChange: (v: number | null) => void;
  step?: string;
  min?: number;
  sufixo?: string;
}) {
  const manual = value !== null;
  return (
    <div className="relative">
      <Input
        type="number"
        step={step}
        min={min}
        className={`h-8 text-xs tabular-nums ${manual ? "border-amber-400 bg-amber-50 pr-7" : ""}`}
        value={value ?? ""}
        placeholder={String(auto)}
        onChange={(e) => {
          const t = e.target.value;
          if (t === "") return onChange(null);
          const n = parseFloat(t);
          onChange(Number.isFinite(n) ? n : null);
        }}
        title={manual ? `Automático: ${auto}${sufixo ?? ""}` : "Automático — digite para alterar"}
      />
      {manual ? (
        <button
          type="button"
          className="absolute top-1/2 right-1 -translate-y-1/2 rounded px-1 text-[11px] text-amber-700 hover:bg-amber-100"
          title={`Voltar ao automático (${auto}${sufixo ?? ""})`}
          onClick={() => onChange(null)}
        >
          ↺
        </button>
      ) : null}
    </div>
  );
}

const FAIXA_CURTA = ["Cliente", "Smirnoff + nacional", "Wyborowa + Gordons", "Absolut + premium"];

function maskData(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

export interface PainelProps {
  p: Proposta;
  cfg: Config;
  setField: (patch: Partial<Proposta>) => void;
  setOverride: (key: string, value: string | null) => void;
  setBebidas: (b: Bebidas) => void;
  limparOverrides: () => void;
}

export function Painel({
  p,
  cfg,
  setField,
  setOverride,
  setBebidas,
  limparOverrides,
}: PainelProps) {
  const calc = calcular(p, cfg);
  const nOver = Object.keys(p.overrides).length;
  const setMenu = (menu: MenuItem[]) => setField({ menu });
  const [novoDrink, setNovoDrink] = useState<string>("");

  // página 4 — valores automáticos (para placeholder / "voltar ao automático")
  const precos = p.precos ?? precosAuto();
  const setPrecos = (patch: Partial<PrecosManuais>) =>
    setField({ precos: { ...precos, ...patch } });
  const regimeAuto = regime(p.convidados, cfg);
  const faixaAuto = faixaOpenBar(p.convidados ?? cfg.limiteOpenBar, cfg);
  const acrescimoAuto = acrescimo(p.data, cfg).pct;
  const nManual =
    (precos.regime !== null ? 1 : 0) +
    (precos.faixaOpenBar !== null ? 1 : 0) +
    (precos.acrescimoPct !== null ? 1 : 0) +
    precos.limitadoUnidades.filter((v) => v !== null).length +
    precos.limitadoUnitarios.filter((v) => v !== null).length;
  const nPrecoOver = Object.keys(p.overrides).filter(
    (k) => k.startsWith("ob.preco.") || k.startsWith("lim.total.") || k.startsWith("lim.unit."),
  ).length;

  return (
    <div className="text-sm">
      <Secao titulo="Dados do evento">
        <Campo label="Nome do cliente">
          <Input
            value={p.nome}
            onChange={(e) => setField({ nome: e.target.value })}
            placeholder="Ex.: Tallita Almeida"
          />
        </Campo>
        <Campo label="Evento">
          <select
            className="h-9 w-full rounded-md border border-neutral-300 bg-white px-2 text-sm"
            value={p.evento}
            onChange={(e) => setField({ evento: e.target.value })}
          >
            {cfg.eventos.map((ev) => (
              <option key={ev} value={ev}>
                {ev}
              </option>
            ))}
          </select>
        </Campo>
        {p.evento === "Outras festas" ? (
          <Campo label="Qual festa? (aparece na capa e na proposta)">
            <Input
              value={p.eventoOutro}
              onChange={(e) => setField({ eventoOutro: e.target.value })}
              placeholder="Ex.: 15 anos"
            />
          </Campo>
        ) : null}
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Data (dd/mm/aaaa)">
            <Input
              value={p.data}
              inputMode="numeric"
              onChange={(e) => setField({ data: maskData(e.target.value) })}
              placeholder="07/08/2027"
            />
          </Campo>
          <Campo label="Local">
            <Input value={p.local} onChange={(e) => setField({ local: e.target.value })} />
          </Campo>
          <Campo label="Convidados">
            <Input
              type="number"
              min={0}
              value={p.convidados ?? ""}
              onChange={(e) =>
                setField({
                  convidados:
                    e.target.value === "" ? null : Math.max(0, parseInt(e.target.value, 10) || 0),
                })
              }
            />
          </Campo>
          <Campo label="Duração (horas)">
            <Input
              type="number"
              min={1}
              value={p.duracao ?? ""}
              onChange={(e) =>
                setField({
                  duracao:
                    e.target.value === "" ? null : Math.max(0, parseInt(e.target.value, 10) || 0),
                })
              }
            />
          </Campo>
          <Campo label="Deslocamento (R$)" hint="Vazio = ISENTO">
            <Input
              value={p.deslocamento}
              onChange={(e) => setField({ deslocamento: e.target.value })}
              placeholder="ISENTO"
            />
          </Campo>
          <Campo label="Contato (opcional)">
            <Input value={p.contato} onChange={(e) => setField({ contato: e.target.value })} />
          </Campo>
        </div>
        <Campo label="Cerimonial (opcional)">
          <Input value={p.cerimonial} onChange={(e) => setField({ cerimonial: e.target.value })} />
        </Campo>
      </Secao>

      <Secao titulo="Bebidas e menu">
        <Campo label="Bebidas">
          <div className="flex gap-1 rounded-md bg-neutral-100 p-1">
            {(
              [
                ["com", "Com álcool"],
                ["com_e_sem", "Com e sem"],
                ["sem", "Sem álcool"],
              ] as [Bebidas, string][]
            ).map(([v, l]) => (
              <button
                key={v}
                type="button"
                onClick={() => setBebidas(v)}
                className={`flex-1 rounded px-2 py-1.5 text-xs font-medium ${p.bebidas === v ? "bg-white shadow text-neutral-900" : "text-neutral-500"}`}
              >
                {l}
              </button>
            ))}
          </div>
        </Campo>
        <Campo label="Subtítulo da caixa (opcional)">
          <Input
            value={p.menuSubtitulo}
            onChange={(e) => setField({ menuSubtitulo: e.target.value })}
            placeholder="coquetéis com e sem álcool:"
          />
        </Campo>
        <div className="space-y-2">
          {p.menu.map((item, i) => (
            <div key={item.id + i} className="rounded-md border border-neutral-200 p-2">
              <div className="flex items-center gap-1">
                <Input
                  className="h-8 flex-1 text-xs font-semibold uppercase"
                  value={item.nome}
                  onChange={(e) =>
                    setMenu(p.menu.map((x, j) => (j === i ? { ...x, nome: e.target.value } : x)))
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={i === 0}
                  onClick={() => {
                    const m = [...p.menu];
                    const a = m[i - 1];
                    const b = m[i];
                    if (a && b) {
                      m[i - 1] = b;
                      m[i] = a;
                      setMenu(m);
                    }
                  }}
                >
                  <ArrowUp />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={i === p.menu.length - 1}
                  onClick={() => {
                    const m = [...p.menu];
                    const a = m[i];
                    const b = m[i + 1];
                    if (a && b) {
                      m[i] = b;
                      m[i + 1] = a;
                      setMenu(m);
                    }
                  }}
                >
                  <ArrowDown />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-red-600"
                  onClick={() => setMenu(p.menu.filter((_, j) => j !== i))}
                >
                  <Trash2 />
                </Button>
              </div>
              <Textarea
                className="mt-1 min-h-0 text-xs"
                rows={2}
                value={item.ingredientes}
                onChange={(e) =>
                  setMenu(
                    p.menu.map((x, j) => (j === i ? { ...x, ingredientes: e.target.value } : x)),
                  )
                }
              />
              {p.bebidas === "sem" && item.alcool ? (
                <p className="mt-1 text-[11px] text-amber-600">Este drink contém álcool.</p>
              ) : null}
            </div>
          ))}
          <div className="flex gap-2">
            <select
              className="h-8 flex-1 rounded-md border border-neutral-300 bg-white px-2 text-xs"
              value={novoDrink}
              onChange={(e) => setNovoDrink(e.target.value)}
            >
              <option value="">Adicionar do catálogo…</option>
              {cfg.catalogo
                .filter((c) => !p.menu.some((m) => m.id === c.id))
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome} {c.alcool ? "" : "(sem álcool)"}
                  </option>
                ))}
            </select>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const c = cfg.catalogo.find((x) => x.id === novoDrink);
                if (c) setMenu([...p.menu, { ...c }]);
                setNovoDrink("");
              }}
              disabled={!novoDrink}
            >
              <Plus /> Add
            </Button>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="w-full"
            onClick={() =>
              setMenu([
                ...p.menu,
                {
                  id: `novo-${Date.now()}`,
                  nome: "NOVO DRINK",
                  ingredientes: "ingredientes",
                  alcool: p.bebidas !== "sem",
                },
              ])
            }
          >
            + Drink novo (texto livre)
          </Button>
        </div>
      </Secao>

      <Secao titulo="Coquetéis (página 4)">
        <p className="text-[11px] text-neutral-400">
          Tudo aqui é sugerido pela tabela e pode ser alterado. Campos em{" "}
          <span className="rounded bg-amber-50 px-1 text-amber-700">amarelo</span> estão editados à
          mão; ↺ volta ao automático.
        </p>
        <Campo label="Regime da página 4">
          <select
            className={`h-9 w-full rounded-md border bg-white px-2 text-sm ${precos.regime !== null ? "border-amber-400 bg-amber-50" : "border-neutral-300"}`}
            value={precos.regime ?? ""}
            onChange={(e) =>
              setPrecos({
                regime: e.target.value === "" ? null : (e.target.value as "limitado" | "openbar"),
              })
            }
          >
            <option value="">
              Automático —{" "}
              {regimeAuto === "openbar"
                ? `Open bar (≥ ${cfg.limiteOpenBar} convidados)`
                : `Coquetéis limitados (< ${cfg.limiteOpenBar})`}
            </option>
            <option value="openbar">Open bar (coquetéis ilimitados)</option>
            <option value="limitado">Coquetéis limitados</option>
          </select>
        </Campo>

        {calc.regime === "openbar" ? (
          <>
            <div className="grid grid-cols-3 gap-2">
              <Campo label="Faixa (planilha)">
                <select
                  className={`h-8 w-full rounded-md border bg-white px-1 text-xs ${precos.faixaOpenBar !== null ? "border-amber-400 bg-amber-50" : "border-neutral-300"}`}
                  value={precos.faixaOpenBar ?? ""}
                  onChange={(e) =>
                    setPrecos({
                      faixaOpenBar: e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                >
                  <option value="">Auto ({faixaAuto})</option>
                  {cfg.openBar.faixas.map((f) => (
                    <option key={f.convidados} value={f.convidados}>
                      {f.convidados} conv.
                    </option>
                  ))}
                </select>
              </Campo>
              <Campo label="Horas">
                <Input
                  type="number"
                  min={1}
                  className="h-8 text-xs tabular-nums"
                  value={p.duracao ?? ""}
                  placeholder={String(cfg.openBar.horasBase)}
                  title="Mesmo campo de 'Duração (horas)' acima"
                  onChange={(e) =>
                    setField({
                      duracao:
                        e.target.value === "" ? null : Math.max(0, parseFloat(e.target.value) || 0),
                    })
                  }
                />
              </Campo>
              <Campo label="Acréscimo %">
                <NumAuto
                  value={precos.acrescimoPct}
                  auto={acrescimoAuto}
                  step="0.5"
                  sufixo="%"
                  onChange={(v) => setPrecos({ acrescimoPct: v })}
                />
              </Campo>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-neutral-600">
                Investimento por opção (vai no PDF)
              </Label>
              {calc.openBar.valores.map((v, i) => (
                <PrecoInput
                  key={i}
                  label={`Opção ${i + 1}`}
                  calculado={v}
                  override={p.overrides[`ob.preco.${i}`]}
                  onChange={(val) => setOverride(`ob.preco.${i}`, val)}
                />
              ))}
              <p className="text-[11px] text-neutral-400">
                Base: {calc.openBar.faixa} conv. × R$/pessoa da tabela ÷ {cfg.openBar.horasBase}h ×{" "}
                {p.duracao ?? cfg.openBar.horasBase}h + {calc.openBar.acrescimoPct}%
                {p.ajuste && p.ajuste.valor !== 0
                  ? ` · ajuste ${p.ajuste.tipo === "pct" ? `${p.ajuste.valor}%` : brlBR(p.ajuste.valor)}`
                  : ""}
              </p>
            </div>
            <Campo label="Nº de bartenders e copeiros (texto)">
              <Input
                value={p.bartenders}
                onChange={(e) => setField({ bartenders: e.target.value })}
                placeholder="Ex.: 4"
              />
            </Campo>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
              {([0, 1] as const).map((op) => (
                <Campo key={op} label={`Opção ${op + 1} — unidades`}>
                  <NumAuto
                    value={precos.limitadoUnidades[op]}
                    auto={cfg.limitado.unidades[op]}
                    min={1}
                    onChange={(v) => {
                      const u = [...precos.limitadoUnidades] as PrecosManuais["limitadoUnidades"];
                      u[op] = v;
                      setPrecos({ limitadoUnidades: u });
                    }}
                  />
                </Campo>
              ))}
            </div>
            <div className="space-y-2">
              {FAIXAS_LIMITADO.map((nome, f) => (
                <div key={f} className="rounded-md border border-neutral-200 p-2">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-semibold" title={nome}>
                      {FAIXA_CURTA[f]}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-neutral-500">R$/un.</span>
                      <div className="w-20">
                        <NumAuto
                          value={precos.limitadoUnitarios[f] ?? null}
                          auto={cfg.limitado.unitarios[f] ?? 0}
                          step="0.5"
                          min={0}
                          onChange={(v) => {
                            const u = [
                              ...precos.limitadoUnitarios,
                            ] as PrecosManuais["limitadoUnitarios"];
                            u[f] = v;
                            setPrecos({ limitadoUnitarios: u });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {([0, 1] as const).map((op) => (
                    <PrecoInput
                      key={op}
                      label={`Opção ${op + 1}`}
                      calculado={calc.limitado.totais[op][f] ?? 0}
                      override={p.overrides[`lim.total.${op}.${f}`]}
                      onChange={(val) => setOverride(`lim.total.${op}.${f}`, val)}
                    />
                  ))}
                </div>
              ))}
              <p className="text-[11px] text-neutral-400">
                Total = unidades × R$/unidade
                {p.ajuste && p.ajuste.valor !== 0
                  ? ` · ajuste ${p.ajuste.tipo === "pct" ? `${p.ajuste.valor}%` : brlBR(p.ajuste.valor)}`
                  : ""}
                . O "R$/un." do PDF segue este campo (ou edite direto no preview).
              </p>
            </div>
          </>
        )}

        {calc.avisos.map((a, i) => (
          <p key={i} className="text-xs text-amber-700">
            ⚠ {a}
          </p>
        ))}
        <p className="text-[11px] text-neutral-400">
          Observações (tabela {calc.ano}): seguro de copos{" "}
          <b className="font-medium text-neutral-600">{brlBR(calc.valoresAno.seguroCopos)}</b> ·
          quebra/extravio{" "}
          <b className="font-medium text-neutral-600">{brlBR(calc.valoresAno.quebra)}</b>. Muda pelo
          ano da data do evento; para alterar, clique no valor no preview.
        </p>

        <Campo
          label="Ajuste geral nos valores (não aparece no PDF)"
          hint="Ex.: −10 % para cliente recorrente. Aplica em todas as opções."
        >
          <div className="flex gap-2">
            <select
              className="h-9 rounded-md border border-neutral-300 bg-white px-2 text-sm"
              value={p.ajuste?.tipo ?? "pct"}
              onChange={(e) =>
                setField({
                  ajuste: { tipo: e.target.value as "pct" | "valor", valor: p.ajuste?.valor ?? 0 },
                })
              }
            >
              <option value="pct">%</option>
              <option value="valor">R$</option>
            </select>
            <Input
              type="number"
              value={p.ajuste?.valor ?? 0}
              onChange={(e) =>
                setField({
                  ajuste: { tipo: p.ajuste?.tipo ?? "pct", valor: parseFloat(e.target.value) || 0 },
                })
              }
            />
          </div>
        </Campo>
        <div className="space-y-1 text-xs text-neutral-500">
          <p>
            {nManual + nPrecoOver} ajuste(s) manual(is) nesta seção · {nOver} edição(ões) direto no
            preview
          </p>
          <div className="flex justify-end gap-1">
            <Button
              size="sm"
              variant="ghost"
              disabled={!nManual && !nPrecoOver && !(p.ajuste && p.ajuste.valor !== 0)}
              title="Volta regime, faixa, acréscimo, unidades, R$/un., ajuste geral e os preços da página 4 ao automático"
              onClick={() => {
                const overrides = { ...p.overrides };
                for (const k of Object.keys(overrides))
                  if (
                    k.startsWith("ob.preco.") ||
                    k.startsWith("lim.total.") ||
                    k.startsWith("lim.unit.")
                  )
                    delete overrides[k];
                setField({ precos: precosAuto(), ajuste: null, overrides });
              }}
            >
              Preços automáticos
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={!nOver}
              title="Remove todas as edições feitas clicando no preview (todas as páginas)"
              onClick={limparOverrides}
            >
              Limpar edições do preview
            </Button>
          </div>
        </div>
      </Secao>

      <Secao titulo="Cafeteria (página 5)">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Incluir página da cafeteria</Label>
          <Switch
            checked={p.cafeteria.ativo}
            onCheckedChange={(v) => setField({ cafeteria: { ...p.cafeteria, ativo: v } })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Pacote mínimo (unidades)">
            <Input
              type="number"
              value={p.cafeteria.pacote}
              onChange={(e) =>
                setField({
                  cafeteria: { ...p.cafeteria, pacote: parseInt(e.target.value, 10) || 0 },
                })
              }
            />
          </Campo>
          <Campo label={`Valor unidade (R$) — tabela ${calc.ano}`}>
            <NumAuto
              value={p.cafeteria.unitario}
              auto={calc.valoresAno.cafeteriaUnitario}
              step="0.5"
              min={0}
              onChange={(v) => setField({ cafeteria: { ...p.cafeteria, unitario: v } })}
            />
          </Campo>
        </div>
        <p className="text-xs text-neutral-500">
          Total: {brlBR(calc.cafeteriaTotal)}{" "}
          <span className="text-neutral-400">
            ({p.cafeteria.pacote} × {brlBR(calc.cafeteriaUnitario)})
          </span>
        </p>
      </Secao>

      <Secao titulo="Serviços adicionais (páginas 6 e 7)">
        {SERVICOS_IDS.map((id) => (
          <div key={id} className="flex items-center justify-between">
            <Label className="text-xs">{SERVICO_NOME[id]}</Label>
            <Switch
              checked={p.servicos[id]}
              onCheckedChange={(v) => setField({ servicos: { ...p.servicos, [id]: v } })}
            />
          </div>
        ))}
        <p className="text-[11px] text-neutral-400">
          Valores e textos dos serviços: clique direto no preview para editar.
        </p>
      </Secao>
    </div>
  );
}
