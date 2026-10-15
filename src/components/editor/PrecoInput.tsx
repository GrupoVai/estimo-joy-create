// Campo de valor em R$ que mostra o calculado e aceita sobrescrita manual.
// Vazio ou igual ao calculado => volta ao automático (remove a sobrescrita).
import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { brlBR, parseBR } from "@/doc/pricing";

export interface PrecoInputProps {
  label: string;
  /** valor sugerido pelo motor */
  calculado: number;
  /** texto sobrescrito (como vai para o PDF) ou undefined */
  override: string | undefined;
  /** null => volta ao calculado */
  onChange: (value: string | null) => void;
  /** formata o número para o texto do documento (padrão: "R$ 1.234,56") */
  formatar?: (v: number) => string;
  className?: string;
}

export function PrecoInput({
  label,
  calculado,
  override,
  onChange,
  formatar = brlBR,
  className = "",
}: PrecoInputProps) {
  const textoCalc = formatar(calculado);
  const [texto, setTexto] = useState(override ?? textoCalc);
  const [focado, setFocado] = useState(false);

  // acompanha mudanças externas (ex.: trocou a faixa, limpou sobrescritas) enquanto não está editando
  useEffect(() => {
    if (!focado) setTexto(override ?? textoCalc);
  }, [override, textoCalc, focado]);

  const commit = () => {
    setFocado(false);
    const t = texto.trim();
    if (!t) {
      onChange(null);
      return;
    }
    const n = parseBR(t);
    if (n === null) {
      // texto livre (ex.: "A combinar") — vai como está
      onChange(t === textoCalc ? null : t);
      return;
    }
    const norm = formatar(n);
    onChange(Math.abs(n - calculado) < 0.005 ? null : norm);
  };

  const sobrescrito = override !== undefined;
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="w-16 shrink-0 text-xs text-neutral-600">{label}</span>
      <Input
        className={`h-8 flex-1 text-xs tabular-nums ${sobrescrito ? "border-amber-400 bg-amber-50" : ""}`}
        value={texto}
        onFocus={() => setFocado(true)}
        onChange={(e) => setTexto(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          if (e.key === "Escape") {
            setTexto(override ?? textoCalc);
            (e.target as HTMLInputElement).blur();
          }
        }}
        title={
          sobrescrito ? `Calculado: ${textoCalc}` : "Valor calculado — edite para sobrescrever"
        }
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0"
        disabled={!sobrescrito}
        title={`Voltar ao calculado (${textoCalc})`}
        onClick={() => onChange(null)}
      >
        <RotateCcw className={sobrescrito ? "text-amber-600" : "text-neutral-300"} />
      </Button>
    </div>
  );
}
