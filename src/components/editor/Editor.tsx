// Tela principal: painel à esquerda, preview A4 à direita, ações no topo.
import { Link } from "@tanstack/react-router";
import { FilePlus2, Printer, Settings2, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { savePrintPayload } from "@/doc/config";
import { DocProvider } from "@/doc/context";
import { Documento } from "@/doc/Documento";
import { PAGE_W } from "@/doc/layout";

import { Painel } from "./Painel";
import { useProposta } from "./useProposta";

export function Editor() {
  const { cfg, p, setField, setOverride, setBebidas, nova, limparOverrides } = useProposta();
  const previewRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.9);
  const carregado = p !== null;

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

  if (!cfg || !p) {
    return <div className="p-8 text-sm text-neutral-500">Carregando…</div>;
  }

  const gerarPdf = () => {
    savePrintPayload(p, cfg);
    window.open("/imprimir", "_blank");
  };

  return (
    <div className="flex h-screen flex-col bg-neutral-100 text-neutral-900">
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-neutral-200 bg-white px-4">
        <span className="text-sm font-semibold tracking-tight">
          Gerador de Orçamentos · Coktelitas
        </span>
        <span className="ml-2 hidden text-xs text-neutral-400 sm:inline">
          clique em qualquer texto do preview para editar
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
              if (window.confirm("Começar um orçamento novo? Os campos atuais serão apagados."))
                nova();
            }}
          >
            <FilePlus2 /> Novo
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/tabela">
              <Settings2 /> Tabela de preços
            </Link>
          </Button>
          <Button
            size="sm"
            onClick={gerarPdf}
            className="bg-[#c2695c] text-white hover:bg-[#a9574b]"
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
    </div>
  );
}
