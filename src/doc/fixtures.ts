// Propostas de referência — reproduzem os dois PDFs originais (usadas na conferência visual).
import { DEFAULT_CONFIG, menuDoPreset, novaProposta } from "./config";
import type { Proposta } from "./types";

export function fixtureTallita(): Proposta {
  return {
    ...novaProposta(DEFAULT_CONFIG),
    nome: "Tallita Almeida",
    evento: "Formatura",
    data: "07/08/2027",
    local: "Centro de evento",
    deslocamento: "",
    convidados: 20,
    duracao: 4,
    contato: "",
    cerimonial: "",
    bebidas: "com",
    menu: menuDoPreset("com").map((m) => (m.id === "apple-gin" ? { ...m, nome: "APLLE GIN" } : m)),
    overrides: {
      "p3.convidados": "15/20",
    },
  };
}

export function fixtureAlessandra(): Proposta {
  return {
    ...novaProposta(DEFAULT_CONFIG),
    nome: "Alessandra",
    evento: "Casamento",
    data: "24/07/2027",
    local: "Maraponga",
    deslocamento: "",
    convidados: 90,
    duracao: 4,
    contato: "",
    cerimonial: "",
    bebidas: "com_e_sem",
    menuSubtitulo: "coquetéis com e sem álcool:",
    menu: menuDoPreset("com_e_sem"),
    bartenders: "?????",
    overrides: {
      // valores arredondados à mão no original
      "ob.preco.0": "R$ 6.000,00",
      "ob.preco.1": "R$ 5.500,00",
      "ob.preco.2": "R$ 5.000,00",
      "ob.preco.3": "R$ 4.000,00",
    },
  };
}

export const FIXTURES: Record<string, () => Proposta> = {
  tallita: fixtureTallita,
  alessandra: fixtureAlessandra,
};
