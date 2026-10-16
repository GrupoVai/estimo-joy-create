// Painel lateral com os orçamentos salvos: reabrir (para dar desconto e gerar de novo),
// ver versões anteriores, duplicar, excluir, exportar/importar backup.
import { Copy, Download, FolderOpen, History, Trash2, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { fmtDataHora, ultimaVersao, type OrcamentoSalvo, type Versao } from "@/doc/historico";
import { tipoEvento } from "@/doc/pages/P1Capa";
import { brlBR, regime } from "@/doc/pricing";
import type { Config, Proposta } from "@/doc/types";

export interface HistoricoProps {
  aberto: boolean;
  onClose: () => void;
  historico: OrcamentoSalvo[];
  cfg: Config;
  /** id do orçamento aberto no editor */
  atualId: string;
  onAbrir: (p: Proposta, versao: Versao) => void;
  onDuplicar: (p: Proposta) => void;
  onRemover: (id: string) => void;
  onExportar: () => void;
  onImportar: (file: File) => void;
}

function resumo(p: Proposta, cfg: Config) {
  const r = p.precos?.regime ?? regime(p.convidados, cfg);
  const ev = tipoEvento(p.evento, p.eventoOutro) || "—";
  return { r, ev };
}

export function Historico({
  aberto,
  onClose,
  historico,
  cfg,
  atualId,
  onAbrir,
  onDuplicar,
  onRemover,
  onExportar,
  onImportar,
}: HistoricoProps) {
  const [busca, setBusca] = useState("");
  const [expandido, setExpandido] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase();
    const ordenada = [...historico].sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm));
    if (!q) return ordenada;
    return ordenada.filter((e) => {
      const p = ultimaVersao(e).proposta;
      const texto =
        `${p.nome} ${tipoEvento(p.evento, p.eventoOutro)} ${p.local} ${p.data}`.toLowerCase();
      return texto.includes(q);
    });
  }, [historico, busca]);

  return (
    <Sheet open={aberto} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="flex w-[440px] max-w-full flex-col gap-3 sm:max-w-[440px]"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="h-4 w-4" /> Histórico de orçamentos
          </SheetTitle>
          <SheetDescription>
            Cada "Salvar" ou "Gerar PDF" guarda uma versão. Abra um orçamento para alterar os preços
            e gerar de novo.
          </SheetDescription>
        </SheetHeader>

        <div className="flex gap-2">
          <Input
            placeholder="Buscar por cliente, evento, local…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="h-9"
          />
          <Button variant="outline" size="sm" title="Exportar backup (JSON)" onClick={onExportar}>
            <Download />
          </Button>
          <Button
            variant="outline"
            size="sm"
            title="Importar backup (JSON)"
            onClick={() => fileRef.current?.click()}
          >
            <Upload />
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onImportar(f);
              e.target.value = "";
            }}
          />
        </div>

        <div className="-mx-2 min-h-0 flex-1 overflow-y-auto px-2">
          {lista.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-400">
              {historico.length === 0
                ? "Nenhum orçamento salvo ainda. Preencha um orçamento e clique em Salvar ou Gerar PDF."
                : "Nada encontrado."}
            </p>
          ) : (
            <ul className="space-y-2">
              {lista.map((e) => {
                const v = ultimaVersao(e);
                const p = v.proposta;
                const { r, ev } = resumo(p, cfg);
                const atual = e.id === atualId;
                const aberto = expandido === e.id;
                return (
                  <li
                    key={e.id}
                    className={`rounded-md border p-3 text-sm ${atual ? "border-[#c2695c] bg-[#fdf4f2]" : "border-neutral-200"}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate font-semibold">
                          {p.nome.trim() || <span className="text-neutral-400">(sem nome)</span>}
                          {atual ? (
                            <span className="ml-2 rounded bg-[#c2695c] px-1.5 py-0.5 text-[10px] font-medium text-white">
                              aberto
                            </span>
                          ) : null}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {ev}
                          {p.data ? ` · ${p.data}` : ""}
                          {p.convidados !== null ? ` · ${p.convidados} conv.` : ""}
                          {" · "}
                          {r === "openbar" ? "open bar" : "limitado"}
                        </div>
                        <div className="mt-1 text-xs tabular-nums text-neutral-700">
                          {r === "openbar" ? "Opção 1: " : "Op. 1 (cliente): "}
                          <b>{brlBR(v.valores[0] ?? 0)}</b>
                          {p.ajuste && p.ajuste.valor !== 0 ? (
                            <span className="ml-1 text-amber-700">
                              (ajuste{" "}
                              {p.ajuste.tipo === "pct"
                                ? `${p.ajuste.valor}%`
                                : brlBR(p.ajuste.valor)}
                              )
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-1 text-[11px] text-neutral-400">
                          atualizado {fmtDataHora(e.atualizadoEm)} ·{" "}
                          <button
                            type="button"
                            className="underline-offset-2 hover:underline"
                            onClick={() => setExpandido(aberto ? null : e.id)}
                          >
                            {e.versoes.length} {e.versoes.length === 1 ? "versão" : "versões"}
                          </button>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col gap-1">
                        <Button
                          size="sm"
                          className="h-7 bg-[#c2695c] text-white hover:bg-[#a9574b]"
                          onClick={() => onAbrir(p, v)}
                          title="Abrir no editor"
                        >
                          <FolderOpen /> Abrir
                        </Button>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            title="Duplicar como novo orçamento"
                            onClick={() => onDuplicar(p)}
                          >
                            <Copy />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-red-600"
                            title="Excluir do histórico"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Excluir o orçamento de "${p.nome.trim() || "(sem nome)"}" e todas as versões?`,
                                )
                              )
                                onRemover(e.id);
                            }}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {aberto ? (
                      <ul className="mt-2 space-y-1 border-t border-neutral-200 pt-2">
                        {[...e.versoes].reverse().map((vv, i) => {
                          const n = e.versoes.length - i;
                          const ultima = i === 0;
                          return (
                            <li
                              key={vv.em}
                              className="flex items-center justify-between gap-2 text-xs"
                            >
                              <span className="tabular-nums text-neutral-600">
                                v{n} · {fmtDataHora(vv.em)} ·{" "}
                                {vv.valores.map((x) => brlBR(x)).join(" / ")}
                                {ultima ? <span className="text-neutral-400"> (atual)</span> : null}
                              </span>
                              {!ultima ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-[11px]"
                                  onClick={() => onAbrir(vv.proposta, vv)}
                                  title="Abre esta versão no editor; ao salvar vira a versão mais nova"
                                >
                                  Abrir v{n}
                                </Button>
                              ) : null}
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <p className="text-[11px] text-neutral-400">
          Fica salvo neste navegador. Para não perder, exporte o backup de vez em quando.
        </p>
      </SheetContent>
    </Sheet>
  );
}
