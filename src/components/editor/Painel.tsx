// Painel lateral de campos do orçamento.
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SERVICOS_IDS } from "@/doc/config";
import { brlBR, calcular } from "@/doc/pricing";
import type { Bebidas, Config, MenuItem, Proposta, ServicoId } from "@/doc/types";

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
  setBebidas: (b: Bebidas) => void;
  limparOverrides: () => void;
}

export function Painel({ p, cfg, setField, setBebidas, limparOverrides }: PainelProps) {
  const calc = calcular(p, cfg);
  const nOver = Object.keys(p.overrides).length;
  const setMenu = (menu: MenuItem[]) => setField({ menu });
  const [novoDrink, setNovoDrink] = useState<string>("");

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
        <div className="rounded-md bg-neutral-50 p-3 text-xs">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-semibold">
              Regime:{" "}
              {calc.regime === "openbar"
                ? "OPEN BAR (≥ 70 convidados)"
                : "COQUETÉIS LIMITADOS (< 70)"}
            </span>
          </div>
          {calc.regime === "openbar" ? (
            <ul className="space-y-0.5 text-neutral-600">
              <li>
                Faixa da planilha: {calc.openBar.faixa} convidados · {p.duracao ?? 4}h · acréscimo{" "}
                {calc.openBar.acrescimoPct}%
              </li>
              {calc.openBar.valores.map((v, i) => (
                <li key={i}>
                  Opção {i + 1}: <b>{brlBR(v)}</b>
                  {p.overrides[`ob.preco.${i}`] ? (
                    <span className="text-amber-600">
                      {" "}
                      → sobrescrito: {p.overrides[`ob.preco.${i}`]}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-0.5 text-neutral-600">
              {calc.limitado.totais.map((t, op) => (
                <li key={op}>
                  Opção {op + 1} ({calc.limitado.unidades[op]} un.):{" "}
                  {t.map((v) => brlBR(v)).join(" · ")}
                </li>
              ))}
            </ul>
          )}
          {calc.avisos.map((a, i) => (
            <p key={i} className="mt-1 text-amber-700">
              ⚠ {a}
            </p>
          ))}
        </div>
        {calc.regime === "openbar" ? (
          <Campo label="Nº de bartenders e copeiros (texto)">
            <Input
              value={p.bartenders}
              onChange={(e) => setField({ bartenders: e.target.value })}
              placeholder="Ex.: 4"
            />
          </Campo>
        ) : null}
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
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>{nOver} valor(es)/texto(s) editado(s) à mão no preview</span>
          <Button size="sm" variant="ghost" disabled={!nOver} onClick={limparOverrides}>
            Voltar tudo ao calculado
          </Button>
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
          <Campo label="Valor unidade (R$)">
            <Input
              type="number"
              step="0.5"
              value={p.cafeteria.unitario}
              onChange={(e) =>
                setField({
                  cafeteria: { ...p.cafeteria, unitario: parseFloat(e.target.value) || 0 },
                })
              }
            />
          </Campo>
        </div>
        <p className="text-xs text-neutral-500">Total: {brlBR(calc.cafeteriaTotal)}</p>
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
