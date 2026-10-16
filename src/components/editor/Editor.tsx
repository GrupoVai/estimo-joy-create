// Tela principal: painel à esquerda, preview A4 à direita, ações no topo.
import { Link } from "@tanstack/react-router";
import { FilePlus2, History, Printer, Save, Settings2, ZoomIn, ZoomOut } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { savePrintPayload } from "@/doc/config";
import { DocProvider } from "@/doc/context";
import { Documento } from "@/doc/Documento";
import {
  duplicarProposta,
  exportarHistorico,
  fmtDataHora,
  importarHistorico,
  loadHistorico,
  removerOrcamento,
  salvarVersao,
  saveHistorico,
  temAlteracoes,
  valoresResumo,
  type OrcamentoSalvo,
  type Versao,
} from "@/doc/historico";
import { PAGE_W } from "@/doc/layout";
import type { Proposta } from "@/doc/types";

import { Historico } from "./Historico";
import { Painel } from "./Painel";
import { useProposta } from "./useProposta";

export function Editor() {
  const { cfg, p, setP, setField, setOverride, setBebidas, nova, limparOverrides } = useProposta();
  const previewRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.9);
  const [historico, setHistorico] = useState<OrcamentoSalvo[]>([]);
  const [histAberto, setHistAberto] = useState(false);
  const carregado = p !== null;

  useEffect(() => {
    setHistorico(loadHistorico());
  }, []);

  // zoom inicial: ajusta a largura da página ao espaço disponível
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const fit = () => {
      const avail = el.clientWidth - 48;
      const pagePx = PAGE_W * (4 / 3);
      setZoom(Math.max(0.4, Math.min(1.4, Math.round((avail / pagePx) * 100) / 100)));
    };
    fit();
  }, [carregado]);

  const atualizarHistorico = useCallback((h: OrcamentoSalvo[]) => {
    setHistorico(h);
    saveHistorico(h);
  }, []);

  if (!cfg || !p) {
    return <div className="p-8 text-sm text-neutral-500">Carregando…</div>;
  }

  const entradaAtual = historico.find((e) => e.id === p.id);
  const alterado = temAlteracoes(p, historico);

  const salvar = (silencioso = false): boolean => {
    if (!p.nome.trim()) {
      toast.error("Informe o nome do cliente antes de salvar.");
      return false;
    }
    const r = salvarVersao(p, cfg, historico);
    atualizarHistorico(r.historico);
    if (!silencioso)
      toast.success(
        r.novaVersao
          ? `Salvo como versão ${r.entrada.versoes.length} de "${p.nome.trim()}".`
          : "Nada mudou desde a última versão.",
      );
    return true;
  };

  const gerarPdf = () => {
    if (p.nome.trim()) {
      const r = salvarVersao(p, cfg, historico);
      atualizarHistorico(r.historico);
    }
    savePrintPayload(p, cfg);
    window.open("/imprimir", "_blank");
  };

  const confirmarDescarte = () =>
    !alterado ||
    window.confirm(
      "O orçamento aberto tem alterações que não foram salvas no histórico. Continuar mesmo assim?",
    );

  const abrir = (prop: Proposta, versao: Versao) => {
    if (!confirmarDescarte()) return;
    const copia = JSON.parse(JSON.stringify(prop)) as Proposta;
    setP(copia);
    setHistAberto(false);
    // a tabela de preços pode ter mudado desde que a versão foi salva
    const agora = valoresResumo(copia, cfg);
    const mudou =
      agora.length !== versao.valores.length ||
      agora.some((v, i) => Math.abs(v - (versao.valores[i] ?? 0)) > 0.005);
    if (mudou)
      toast.warning(
        "Os valores calculados mudaram desde que esta versão foi salva (tabela de preços ou regras). Confira a página 4.",
        { duration: 8000 },
      );
    else toast.success(`Orçamento de "${copia.nome.trim() || "(sem nome)"}" aberto.`);
  };

  const duplicar = (prop: Proposta) => {
    if (!confirmarDescarte()) return;
    setP(duplicarProposta(prop));
    setHistAberto(false);
    toast.success("Cópia criada — é um orçamento novo; salve para entrar no histórico.");
  };

  const remover = (id: string) => {
    atualizarHistorico(removerOrcamento(id, historico));
    toast.success("Orçamento excluído do histórico.");
  };

  const exportar = () => {
    const blob = new Blob([exportarHistorico(historico)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `coktelitas-historico-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importar = async (file: File) => {
    try {
      const antes = historico.length;
      const h = importarHistorico(await file.text(), historico);
      atualizarHistorico(h);
      toast.success(`Backup importado: ${h.length - antes} orçamento(s) novo(s).`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível importar o arquivo.");
    }
  };

  return (
    <div className="flex h-screen flex-col bg-neutral-100 text-neutral-900">
      <Toaster position="bottom-right" richColors />
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-neutral-200 bg-white px-4">
        <span className="shrink-0 whitespace-nowrap text-sm font-semibold tracking-tight">
          Gerador de Orçamentos · Coktelitas
        </span>
        <span className="ml-2 hidden max-w-[320px] truncate text-xs text-neutral-400 xl:inline">
          {entradaAtual
            ? `${p.nome.trim() || "(sem nome)"} · v${entradaAtual.versoes.length} salva ${fmtDataHora(entradaAtual.atualizadoEm)}${alterado ? " · alterado" : ""}`
            : p.nome.trim()
              ? `${p.nome.trim()} · ainda não salvo no histórico`
              : "clique em qualquer texto do preview para editar"}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom((z) => Math.max(0.4, Math.round((z - 0.1) * 10) / 10))}
            title="Diminuir"
          >
            <ZoomOut />
          </Button>
          <span className="w-10 text-center text-xs tabular-nums text-neutral-500">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom((z) => Math.min(1.6, Math.round((z + 0.1) * 10) / 10))}
            title="Aumentar"
          >
            <ZoomIn />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirmarDescarte()) nova();
            }}
            title="Começar um orçamento novo (o atual continua no histórico se foi salvo)"
          >
            <FilePlus2 /> Novo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHistAberto(true)}
            title="Orçamentos salvos"
          >
            <History /> Histórico
            {historico.length ? (
              <span className="rounded-full bg-neutral-200 px-1.5 text-[10px] tabular-nums">
                {historico.length}
              </span>
            ) : null}
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/tabela">
              <Settings2 /> Tabela de preços
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => salvar()}
            title="Guarda uma versão deste orçamento no histórico"
            className={alterado && p.nome.trim() ? "border-amber-400 text-amber-800" : ""}
          >
            <Save /> Salvar
          </Button>
          <Button
            size="sm"
            onClick={gerarPdf}
            className="bg-[#c2695c] text-white hover:bg-[#a9574b]"
            title="Salva no histórico e abre a impressão"
          >
            <Printer /> Gerar PDF
          </Button>
        </div>
      </header>
      <div className="flex min-h-0 flex-1">
        <aside className="w-[380px] shrink-0 overflow-y-auto border-r border-neutral-200 bg-white">
          <Painel
            p={p}
            cfg={cfg}
            setField={setField}
            setOverride={setOverride}
            setBebidas={setBebidas}
            limparOverrides={limparOverrides}
          />
        </aside>
        <main ref={previewRef} className="min-w-0 flex-1 overflow-auto p-6">
          <div className="doc-preview mx-auto flex w-max flex-col gap-6" style={{ zoom }}>
            <DocProvider p={p} cfg={cfg} editable setField={setField} setOverride={setOverride}>
              <Documento />
            </DocProvider>
          </div>
        </main>
      </div>
      <Historico
        aberto={histAberto}
        onClose={() => setHistAberto(false)}
        historico={historico}
        cfg={cfg}
        atualId={p.id}
        onAbrir={abrir}
        onDuplicar={duplicar}
        onRemover={remover}
        onExportar={exportar}
        onImportar={importar}
      />
    </div>
  );
}
