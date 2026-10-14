// Contexto do documento: proposta + config + cálculo + edição inline.
import { createContext, useContext, type CSSProperties, type ReactNode } from "react";

import { calcular, type Calculo } from "./pricing";
import type { Config, Proposta } from "./types";

export interface DocCtx {
  p: Proposta;
  cfg: Config;
  calc: Calculo;
  /** true no editor (campos editáveis inline); false na impressão */
  editable: boolean;
  setField: (patch: Partial<Proposta>) => void;
  setOverride: (key: string, value: string | null) => void;
}

const Ctx = createContext<DocCtx | null>(null);

export function DocProvider({
  p,
  cfg,
  editable,
  setField,
  setOverride,
  children,
}: {
  p: Proposta;
  cfg: Config;
  editable: boolean;
  setField?: DocCtx["setField"];
  setOverride?: DocCtx["setOverride"];
  children: ReactNode;
}) {
  const calc = calcular(p, cfg);
  const value: DocCtx = {
    p,
    cfg,
    calc,
    editable,
    setField: setField ?? (() => {}),
    setOverride: setOverride ?? (() => {}),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDoc(): DocCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useDoc fora de DocProvider");
  return c;
}

/** Valor exibido para um elemento: override (se houver) ou o padrão. */
export function useValor(key: string, def: string): { text: string; overridden: boolean } {
  const { p } = useDoc();
  const o = p.overrides[key];
  return o !== undefined ? { text: o, overridden: true } : { text: def, overridden: false };
}

export interface EProps {
  /** chave da sobrescrita (texto fixo ou valor calculado) */
  k?: string;
  /** campo direto da proposta (edição altera o campo, não cria override) */
  field?: keyof Proposta;
  /** texto padrão (calculado ou fixo) */
  def: string;
  style?: CSSProperties;
  className?: string;
  /** transforma o texto digitado antes de salvar (ex.: caixa alta) */
  normalize?: (s: string) => string;
  /** tratamento próprio do texto editado (tem prioridade sobre `field`/`k`) */
  onCommit?: (text: string) => void;
}

/**
 * Texto editável inline. No editor é `contentEditable`; na impressão é texto puro.
 * Marca (•) quando o valor foi sobrescrito manualmente.
 */
export function E({ k, field, def, style, className, normalize, onCommit }: EProps) {
  const { p, editable, setField, setOverride } = useDoc();
  const override = k ? p.overrides[k] : undefined;
  const text = override !== undefined ? override : def;
  if (!editable) {
    return (
      <span className={className} style={style}>
        {text}
      </span>
    );
  }
  return (
    <span
      className={`doc-e ${override !== undefined ? "doc-e-over" : ""} ${className ?? ""}`}
      style={style}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      data-key={k ?? field}
      onKeyDown={(ev) => {
        if (ev.key === "Enter" && !ev.shiftKey) {
          ev.preventDefault();
          (ev.currentTarget as HTMLElement).blur();
        }
        if (ev.key === "Escape") {
          (ev.currentTarget as HTMLElement).textContent = text;
          (ev.currentTarget as HTMLElement).blur();
        }
      }}
      onBlur={(ev) => {
        const raw = (ev.currentTarget.textContent ?? "").replace(/\u00a0/g, " ");
        const v = normalize ? normalize(raw) : raw;
        if (onCommit) {
          onCommit(v);
          return;
        }
        if (field) {
          setField({ [field]: v } as Partial<Proposta>);
          return;
        }
        if (!k) return;
        if (v === def) setOverride(k, null);
        else setOverride(k, v);
      }}
    >
      {text}
    </span>
  );
}
