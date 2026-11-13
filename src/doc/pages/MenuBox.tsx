// Caixa terracota "SUGESTÃO MENU" (páginas 3 e 5) com lista que reduz a fonte até caber.
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { E, useDoc } from "../context";
import { Box, COR, Dot, FONTES, pt, Txt, topFromBaseline } from "../layout";
import type { MenuItem } from "../types";

export interface MenuBoxProps {
  x?: number;
  y: number;
  w?: number;
  h: number;
  items: MenuItem[];
  /** prefixo das chaves de sobrescrita: `${prefix}.${i}.nome` / `.ing` */
  prefix: string;
  subtitulo?: string;
  /** edição do item (se omitido, usa overrides) */
  onEditItem?: (i: number, patch: Partial<MenuItem>) => void;
  subtituloField?: "menuSubtitulo";
}

export function MenuBox({
  x = 258,
  y,
  w = 297.5,
  h,
  items,
  prefix,
  subtitulo = "",
  onEditItem,
  subtituloField,
}: MenuBoxProps) {
  const { p } = useDoc();
  const ref = useRef<HTMLDivElement>(null);
  // Níveis de ajuste até a lista caber: primeiro reduz a fonte com o espaçamento normal
  // (1,5 linha + 1 linha entre itens — PDFs Tallita/Alessandra); se não couber a 10 pt,
  // passa ao espaçamento compacto do PDF da Georgia (entrelinha 1,16, 1 linha entre itens)
  // e aí sim reduz a fonte até 8 pt.
  const NIVEIS: { size: number; compact: boolean }[] = [
    { size: 11, compact: false },
    { size: 10.5, compact: false },
    { size: 10, compact: false },
    { size: 11, compact: true },
    { size: 10.5, compact: true },
    { size: 10, compact: true },
    { size: 9.5, compact: true },
    { size: 9, compact: true },
    { size: 8.5, compact: true },
    { size: 8, compact: true },
  ];
  const [nivel, setNivel] = useState(0);
  const [fontesOk, setFontesOk] = useState(false);
  const { size, compact } = NIVEIS[nivel] ?? { size: 8, compact: true };
  const lh = compact ? size * 1.16 : size * 1.5;
  const gap = lh;
  const m = FONTES.mont;
  const sub = subtitulo.trim();
  // posições relativas à caixa (medidas no PDF: título +46,6; subtítulo +64,6; 1ª linha +108,2)
  const firstBaseline = 108.2 + (sub ? 13 : 0);
  const listTop = topFromBaseline(firstBaseline, size, "mont", lh);
  const maxBottom = h - 24;
  const dotOffset = (lh - (m.asc + m.desc) * size) / 2 + m.asc * size - 3.4;

  // as medidas só valem com a Montserrat carregada
  useEffect(() => {
    let vivo = true;
    document.fonts?.ready.then(() => {
      if (vivo) setFontesOk(true);
    });
    return () => {
      vivo = false;
    };
  }, []);

  // recomeça do maior tamanho quando a lista muda; depois desce um nível por vez até caber
  const chave = `${items.length}|${sub}|${fontesOk}`;
  const chaveRef = useRef(chave);
  useLayoutEffect(() => {
    if (chaveRef.current !== chave) {
      chaveRef.current = chave;
      if (nivel !== 0) {
        setNivel(0);
        return;
      }
    }
    const el = ref.current;
    if (!el) return;
    const hpt = el.scrollHeight * 0.75;
    if (listTop + hpt > maxBottom && nivel < NIVEIS.length - 1) setNivel((n) => n + 1);
  }, [chave, items, nivel, listTop, maxBottom, NIVEIS.length]);

  return (
    <Box x={x} y={y} w={w} h={h} fill={COR.terra} r={12}>
      <Txt x={19.5} y={46.6} size={23} weight={700} color="#fff">
        <E k={`${prefix}.titulo`} def="SUGESTÃO MENU" />
      </Txt>
      <Txt x={19.5} y={64.6} size={15} italic color="#fff">
        <E k={`${prefix}.subtitulo`} def="PERSONALIZÁVEL COM CLIENTE" />
      </Txt>
      {sub ? (
        <Txt x={19.5} y={82.2} size={10.17} color="#fff" style={{ textDecoration: "underline" }}>
          {subtituloField ? <E field={subtituloField} def={sub} /> : sub}
        </Txt>
      ) : null}
      <div
        ref={ref}
        style={{
          position: "absolute",
          left: pt(38.2),
          top: pt(listTop),
          width: pt(236),
          fontFamily: '"Montserrat"',
          fontSize: pt(size),
          lineHeight: pt(lh),
          color: "#fff",
        }}
      >
        {items.map((item, i) => (
          <div key={item.id + i} style={{ position: "relative", marginBottom: pt(gap) }}>
            <Dot x={-12} y={dotOffset - 1.9} d={3.8} color="#fff" />
            <span style={{ fontWeight: 700 }}>
              <E
                k={`${prefix}.${i}.nome`}
                def={item.nome.toUpperCase()}
                normalize={(t) => t.toUpperCase()}
                {...(onEditItem ? { onCommit: (t: string) => onEditItem(i, { nome: t }) } : {})}
              />
              {": "}
            </span>
            <E
              k={`${prefix}.${i}.ing`}
              def={item.ingredientes}
              {...(onEditItem
                ? { onCommit: (t: string) => onEditItem(i, { ingredientes: t }) }
                : {})}
            />
          </div>
        ))}
      </div>
      {void p}
    </Box>
  );
}
