// Caixa terracota "SUGESTÃO MENU" (páginas 3 e 5) com lista que reduz a fonte até caber.
import { useLayoutEffect, useRef, useState } from "react";

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
  const [size, setSize] = useState(11);
  const lh = size * 1.5;
  const m = FONTES.mont;
  const sub = subtitulo.trim();
  // posições relativas à caixa (medidas no PDF: título +46,6; subtítulo +64,6; 1ª linha +108,2)
  const firstBaseline = 108.2 + (sub ? 13 : 0);
  const listTop = topFromBaseline(firstBaseline, size, "mont", lh);
  const maxBottom = h - 24;
  const dotOffset = (lh - (m.asc + m.desc) * size) / 2 + m.asc * size - 3.4;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const hpt = el.scrollHeight * 0.75;
    if (listTop + hpt > maxBottom && size > 8) setSize((s) => Math.round((s - 0.5) * 2) / 2);
  }, [items, sub, size, listTop, maxBottom]);

  // volta a crescer quando a lista diminui
  useLayoutEffect(() => {
    setSize(11);
  }, [items.length, sub]);

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
          <div key={item.id + i} style={{ position: "relative", marginBottom: pt(lh) }}>
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
