// Primitivas de layout do documento. Unidade: pontos PDF (1 pt = 1/72 in).
// Página A4 = 595.5 × 842.25 pt (idêntico ao PDF exportado pelo Canva).
import type { CSSProperties, ReactNode } from "react";

export const PAGE_W = 595.5;
export const PAGE_H = 842.25;

export const COR = {
  terra: "#c2695c",
  terraClara: "#da7d70",
  cinza: "#545454",
  preto: "#000000",
  branco: "#ffffff",
  verde: "#8dcd59",
  verdeEscuro: "#75bd39",
  grafite: "#393939",
} as const;

/** Métricas (em) medidas nos PDFs / Chromium — usadas para posicionar pela linha de base. */
export const FONTES = {
  mont: { family: "Montserrat", asc: 0.968, desc: 0.251 },
  julius: { family: "Julius Sans One", asc: 0.863, desc: 0.228 },
  questrial: { family: "Questrial", asc: 0.82, desc: 0.21 },
  /** substituta de The Seasons Bold (preços do open bar) */
  serif: { family: "Cormorant Garamond", asc: 0.92, desc: 0.29 },
} as const;
export type FonteKey = keyof typeof FONTES;

export const pt = (v: number) => `${v}pt`;

export interface TxtProps {
  /** borda esquerda (pt) — ou da caixa, se `w` for dado */
  x: number;
  /** linha de base da primeira linha (pt) */
  y: number;
  size: number;
  font?: FonteKey;
  weight?: 300 | 400 | 700;
  italic?: boolean;
  color?: string;
  /** largura da caixa (pt); com `w`, o texto quebra linha */
  w?: number;
  /** entrelinha (pt) — distância entre linhas de base. Padrão: (asc+desc)×size */
  lh?: number;
  align?: "left" | "center" | "right";
  /** letter-spacing em pt */
  tracking?: number;
  /**
   * text-shadow explícito, SEM blur (ex.: "-0.5pt -0.5pt 0 #fff" para "engrossar" o traço).
   * Nunca use sombra com blur: o Chrome exporta como soft mask e o visualizador de PDF do
   * iPhone/iPad desenha uma caixa escura atrás do texto.
   */
  shadow?: string;
  upper?: boolean;
  nowrap?: boolean;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}

/** Calcula o `top` CSS para que a linha de base caia exatamente em `y`. */
export function topFromBaseline(y: number, size: number, font: FonteKey, lh?: number): number {
  const m = FONTES[font];
  const content = (m.asc + m.desc) * size;
  const L = lh ?? content;
  return y - (L - content) / 2 - m.asc * size;
}

export function txtStyle(p: TxtProps): CSSProperties {
  const font = p.font ?? "mont";
  const m = FONTES[font];
  const L = p.lh ?? (m.asc + m.desc) * p.size;
  const shadow = p.shadow;
  const s: CSSProperties = {
    position: "absolute",
    left: pt(p.x),
    top: pt(topFromBaseline(p.y, p.size, font, p.lh)),
    fontFamily: `"${m.family}"`,
    fontSize: pt(p.size),
    fontWeight: p.weight ?? 400,
    fontStyle: p.italic ? "italic" : "normal",
    lineHeight: pt(L),
    color: p.color ?? COR.preto,
    whiteSpace: p.nowrap !== false && !p.w ? "pre" : "pre-wrap",
    margin: 0,
    textAlign: p.align ?? "left",
    ...(p.w !== undefined ? { width: pt(p.w) } : {}),
    ...(p.tracking !== undefined ? { letterSpacing: pt(p.tracking) } : {}),
    // letter-spacing adiciona espaço após o último caractere; compensa para centralizar o tinta
    ...(p.tracking !== undefined && p.align === "center" ? { paddingLeft: pt(p.tracking) } : {}),
    ...(shadow ? { textShadow: shadow } : {}),
    ...(p.upper ? { textTransform: "uppercase" } : {}),
    ...p.style,
  };
  return s;
}

export function Txt(p: TxtProps) {
  return (
    <div className={p.className} style={txtStyle(p)}>
      {p.children}
    </div>
  );
}

export interface BoxProps {
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: string;
  stroke?: string;
  strokeW?: number;
  r?: number | string;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}

/** Caixa posicionada (retângulo com cantos arredondados / moldura). */
export function Box(p: BoxProps) {
  const s: CSSProperties = {
    position: "absolute",
    left: pt(p.x),
    top: pt(p.y),
    width: pt(p.w),
    height: pt(p.h),
    boxSizing: "border-box",
    ...(p.fill ? { background: p.fill } : {}),
    ...(p.stroke ? { border: `${pt(p.strokeW ?? 1.5)} solid ${p.stroke}` } : {}),
    ...(p.r !== undefined ? { borderRadius: typeof p.r === "number" ? pt(p.r) : p.r } : {}),
    ...p.style,
  };
  return (
    <div className={p.className} style={s}>
      {p.children}
    </div>
  );
}

export interface ImgProps {
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  style?: CSSProperties;
  fit?: CSSProperties["objectFit"];
}

export function Img(p: ImgProps) {
  return (
    <img
      src={p.src}
      alt=""
      draggable={false}
      style={{
        position: "absolute",
        left: pt(p.x),
        top: pt(p.y),
        width: pt(p.w),
        height: pt(p.h),
        objectFit: p.fit ?? "fill",
        ...p.style,
      }}
    />
  );
}

/** Marcador circular (bullet) como no Canva: círculo preenchido. */
export function Dot({ x, y, d, color }: { x: number; y: number; d: number; color: string }) {
  return <Box x={x} y={y} w={d} h={d} fill={color} r="50%" />;
}

export function Page({
  n,
  children,
  className,
}: {
  n: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-page={n}
      className={`doc-page ${className ?? ""}`}
      style={{
        width: pt(PAGE_W),
        height: pt(PAGE_H),
        position: "relative",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {children}
    </div>
  );
}

/** Topo/base da caixa de linha de um texto posicionado pela linha de base. */
export function lineBox(
  baseline: number,
  size: number,
  font: FonteKey,
  lh?: number,
): { top: number; bottom: number } {
  const m = FONTES[font];
  const content = (m.asc + m.desc) * size;
  const L = lh ?? content;
  const half = (L - content) / 2;
  return { top: baseline - half - m.asc * size, bottom: baseline + half + m.desc * size };
}

/** Margem (pt) entre dois blocos de texto para que as linhas de base fiquem nas posições medidas. */
export function marginBetween(
  prev: { baseline: number; size: number; lh?: number; font?: FonteKey },
  next: { baseline: number; size: number; lh?: number; font?: FonteKey },
): number {
  const b = lineBox(prev.baseline, prev.size, prev.font ?? "mont", prev.lh).bottom;
  const t = lineBox(next.baseline, next.size, next.font ?? "mont", next.lh).top;
  return t - b;
}
