// Blocos de "OUTROS SERVIÇOS" (páginas 6 e 7): fluxo vertical com margens medidas no PDF.
import type { CSSProperties, ReactNode } from "react";

import { E, useDoc } from "../context";
import { COR, Dot, FONTES, pt } from "../layout";
import type { ServicoId } from "../types";

const TERRA = COR.terra;

/** Linha de texto no fluxo (fonte/tamanho/entrelinha), com margem superior em pt. */
export function Linha({
  size,
  lh,
  mt = 0,
  x = 0,
  w,
  weight = 400,
  bullet,
  bulletD = 3.8,
  children,
  style,
}: {
  size: number;
  lh: number;
  mt?: number;
  x?: number;
  w?: number;
  weight?: 300 | 400 | 700;
  /** distância do centro do bullet até o início do texto (pt) */
  bullet?: number;
  bulletD?: number;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const m = FONTES.mont;
  const dotCenter = (lh - (m.asc + m.desc) * size) / 2 + m.asc * size - 3.4;
  return (
    <div
      style={{
        position: "relative",
        marginTop: pt(mt),
        marginLeft: pt(x),
        ...(w !== undefined ? { width: pt(w) } : {}),
        fontFamily: '"Montserrat"',
        fontSize: pt(size),
        lineHeight: pt(lh),
        fontWeight: weight,
        color: TERRA,
        whiteSpace: "pre-wrap",
        ...style,
      }}
    >
      {bullet !== undefined ? (
        <Dot x={-bullet - bulletD / 2} y={dotCenter - bulletD / 2} d={bulletD} color={TERRA} />
      ) : null}
      {children}
    </div>
  );
}

export const B = ({ children }: { children: ReactNode }) => (
  <span style={{ fontWeight: 700 }}>{children}</span>
);

export function Bloco({ id, children }: { id: ServicoId; children: ReactNode }) {
  const { p } = useDoc();
  if (!p.servicos[id]) return null;
  return <>{children}</>;
}

/** Texto editável simples com chave. */
export const T = ({ k, def }: { k: string; def: string }) => <E k={k} def={def} />;
