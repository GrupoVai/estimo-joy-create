import type { Config, MenuItem, Proposta } from "./types";

// ---------- Catálogo de drinks (texto exatamente como enviado pela Coktelitas) ----------
const CATALOGO: MenuItem[] = [
  // Preset 1 — "Coquetéis com álcool" (menu da Tallita)
  {
    id: "caipiroska-morango",
    nome: "CAIPIROSKA DE MORANGO",
    ingredientes: "Vodka, morango, limão, hortelã, açúcar ou adoçante.",
    alcool: true,
  },
  {
    id: "caipiroska-kiwi",
    nome: "CAIPIROSKA DE KIWI",
    ingredientes: "Vodka, kiwi, açúcar ou adoçante.",
    alcool: true,
  },
  { id: "mojito", nome: "MOJITO", ingredientes: "Rum, Hortelã, limão e soda.", alcool: true },
  {
    id: "tangerina-pimenta-rosa",
    nome: "TANGERINA COM PIMENTA ROSA",
    ingredientes: "Vodka, tangerina, pimenta rosa, adoçante ou açúcar.",
    alcool: true,
  },
  {
    id: "fitzgerald",
    nome: "FITZGERALD",
    ingredientes: "Gin, xarope simples, limão siciliano e bitter angostura.",
    alcool: true,
  },
  {
    id: "apple-gin",
    nome: "APPLE GIN",
    ingredientes: "Gin, limão siciliano, xarope de maçã verde e citrus.",
    alcool: true,
  },
  {
    id: "aurora",
    nome: "AURORA",
    ingredientes: "Gin, grapefruit syrup, limão siciliano, hortelã e tônica.",
    alcool: true,
  },
  {
    id: "gin-tonica",
    nome: "GIN TÔNICA",
    ingredientes: "Gin, água tônica, limão siciliano e especiarias a escolha.",
    alcool: true,
  },
  // Preset 2 — "Coquetéis com e sem álcool" (menu da Alessandra)
  {
    id: "moscow-mule",
    nome: "MOSCOW MULE",
    ingredientes: "Vodka, xarope de gengibre, limão siciliano e espuma de capim santo",
    alcool: true,
  },
  {
    id: "monte-seu-gin-tonica",
    nome: "MONTE SEU GIM TÔNICA",
    ingredientes:
      "Gim, limão siciliano, água tônica e especiarias (alecrim, pepino, zimbro, cardamomo, morango, anis estrelado, hibisco, canela em pau, cravo)",
    alcool: true,
  },
  {
    id: "pantera-cor-de-rosa",
    nome: "PANTERA COR DE ROSA S/A",
    ingredientes: "Frutas vermelhas, leite condensado e creme de leite",
    alcool: false,
  },
  {
    id: "coktelitas",
    nome: "COKTELITAS",
    ingredientes: "Morango, limão, hortelã, açúcar e suco de laranja.",
    alcool: false,
  },
  {
    id: "tropicana",
    nome: "TROPICANA",
    ingredientes: "Maracujá, tropical blue e limão. (Sem álcool)",
    alcool: false,
  },
  {
    id: "sweet-blue",
    nome: "SWEET BLUE",
    ingredientes:
      "Suco de Abacaxi com Xarope azul e xarope de baunilha e decorado com algodão doce.",
    alcool: false,
  },
];

const CAFES: MenuItem[] = [
  {
    id: "alexander",
    nome: "ALEXANDER",
    ingredientes: "Brandy, licor de cacau, creme de leite e canela.",
    alcool: true,
  },
  {
    id: "cafe-cubano",
    nome: "CAFÉ CUBANO",
    ingredientes: "Expresso, licor de coco, mix cremoso e calda de chocolate.",
    alcool: true,
  },
  {
    id: "cafe-nutela",
    nome: "CAFÉ NUTELA",
    ingredientes: "Café expresso, uma deliciosa borda de Nutela e Chantily.",
    alcool: false,
  },
  {
    id: "capuccino",
    nome: "CAPUCCINO",
    ingredientes: "Expresso, Leite Vaporizado, Chocolate e Canela.",
    alcool: false,
  },
  {
    id: "chocolate-quente-italiano",
    nome: "CHOCOLATE QUENTE ITALIANO",
    ingredientes: "Chocolate Quente Italiano.",
    alcool: false,
  },
  {
    id: "chococreme",
    nome: "CHOCOCREME",
    ingredientes: "Chocolate quente, sorvete de creme.",
    alcool: false,
  },
  {
    id: "coktelitas-coffee",
    nome: "COKTELITAS COFFEE",
    ingredientes: "Expresso, licor de café e chocolate, mix cremoso e groselha.",
    alcool: true,
  },
  {
    id: "cherry-coffee",
    nome: "CHERRY COFFEE",
    ingredientes: "Expresso, licor de marula e cereja, mix cremoso e chocolate.",
    alcool: true,
  },
];

// ---------- Configuração padrão (planilha CALCULOS OPEN BAR 2026-2027 + PDFs) ----------
export const DEFAULT_CONFIG: Config = {
  eventos: ["Formatura", "Casamento", "Aniversário", "Corporativo", "Outras festas"],
  limiteOpenBar: 70,
  openBar: {
    horasBase: 4,
    faixas: [
      { convidados: 100, pessoa: [55, 50, 45, 35] },
      { convidados: 110, pessoa: [55, 50, 45, 35] },
      { convidados: 120, pessoa: [54, 49, 44, 35] },
      { convidados: 130, pessoa: [54, 49, 44, 35] },
      { convidados: 140, pessoa: [54, 49, 44, 35] },
      { convidados: 150, pessoa: [54, 49, 44, 35] },
      { convidados: 160, pessoa: [54, 49, 44, 35] },
      { convidados: 170, pessoa: [54, 49, 44, 35] },
      { convidados: 180, pessoa: [54, 49, 44, 35] },
      { convidados: 200, pessoa: [54, 49, 44, 35] },
      { convidados: 250, pessoa: [53, 48, 43, 35] },
      { convidados: 300, pessoa: [53, 48, 43, 35] },
      { convidados: 350, pessoa: [53, 48, 43, 35] },
      { convidados: 400, pessoa: [52, 47, 42, 35] },
      { convidados: 500, pessoa: [52, 47, 42, 35] },
    ],
    acrescimos: { "2026": [0, 0, 0], "2027": [5, 10, 15] },
  },
  limitado: { unidades: [150, 200], unitarios: [16, 17, 18, 20] },
  cafeteria: { pacote: 150, unitario: 18 },
  catalogo: CATALOGO,
  presets: {
    com: [
      "caipiroska-morango",
      "caipiroska-kiwi",
      "mojito",
      "tangerina-pimenta-rosa",
      "fitzgerald",
      "apple-gin",
      "aurora",
      "gin-tonica",
    ],
    comESem: [
      "caipiroska-morango",
      "caipiroska-kiwi",
      "moscow-mule",
      "monte-seu-gin-tonica",
      "pantera-cor-de-rosa",
      "coktelitas",
      "tropicana",
      "sweet-blue",
    ],
  },
  cafes: CAFES,
};

export const SERVICOS_IDS = [
  "fonteCachaca",
  "torreEspumante",
  "tequileiro",
  "shotBalaCoco",
  "shotBananinha",
  "pedraFloral",
  "receptivo",
  "maquinaTaca",
] as const;

export function novaProposta(cfg: Config = DEFAULT_CONFIG): Proposta {
  return {
    nome: "",
    evento: cfg.eventos[0] ?? "Formatura",
    eventoOutro: "",
    data: "",
    local: "",
    deslocamento: "",
    convidados: null,
    duracao: 4,
    contato: "",
    cerimonial: "",
    bebidas: "com",
    menuSubtitulo: "",
    menu: menuDoPreset("com", cfg),
    bartenders: "",
    cafeteria: { ativo: true, pacote: cfg.cafeteria.pacote, unitario: cfg.cafeteria.unitario },
    servicos: {
      fonteCachaca: true,
      torreEspumante: true,
      tequileiro: true,
      shotBalaCoco: true,
      shotBananinha: true,
      pedraFloral: true,
      receptivo: true,
      maquinaTaca: true,
    },
    ajuste: null,
    overrides: {},
  };
}

/** Menu sugerido para a escolha de bebidas (R11). Devolve cópias para edição livre. */
export function menuDoPreset(
  bebidas: Proposta["bebidas"],
  cfg: Config = DEFAULT_CONFIG,
): MenuItem[] {
  const byId = new Map(cfg.catalogo.map((m) => [m.id, m]));
  let ids: string[];
  if (bebidas === "com") ids = cfg.presets.com;
  else if (bebidas === "com_e_sem") ids = cfg.presets.comESem;
  else ids = cfg.catalogo.filter((m) => !m.alcool).map((m) => m.id);
  return ids
    .map((id) => byId.get(id))
    .filter((m): m is MenuItem => !!m)
    .map((m) => ({ ...m }));
}

export function subtituloDoPreset(bebidas: Proposta["bebidas"]): string {
  if (bebidas === "com_e_sem") return "coquetéis com e sem álcool:";
  if (bebidas === "sem") return "coquetéis sem álcool:";
  return "";
}

// ---------- Persistência local (um usuário, sem login) ----------
const KEY_CONFIG = "coktelitas.config.v1";
const KEY_PROPOSTA = "coktelitas.proposta.v1";
const KEY_PRINT = "coktelitas.print.v1";

function safeGet(key: string): string | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key: string, value: string) {
  try {
    if (typeof window !== "undefined") window.localStorage.setItem(key, value);
  } catch {
    /* sem storage: segue sem persistir */
  }
}

export function loadConfig(): Config {
  const raw = safeGet(KEY_CONFIG);
  if (!raw) return DEFAULT_CONFIG;
  try {
    const saved = JSON.parse(raw) as Partial<Config>;
    return { ...DEFAULT_CONFIG, ...saved };
  } catch {
    return DEFAULT_CONFIG;
  }
}
export function saveConfig(cfg: Config) {
  safeSet(KEY_CONFIG, JSON.stringify(cfg));
}
export function resetConfig() {
  safeSet(KEY_CONFIG, JSON.stringify(DEFAULT_CONFIG));
}

export function loadProposta(cfg: Config): Proposta {
  const raw = safeGet(KEY_PROPOSTA);
  if (!raw) return novaProposta(cfg);
  try {
    return { ...novaProposta(cfg), ...(JSON.parse(raw) as Partial<Proposta>) };
  } catch {
    return novaProposta(cfg);
  }
}
export function saveProposta(p: Proposta) {
  safeSet(KEY_PROPOSTA, JSON.stringify(p));
}

/** Dados entregues à tela de impressão (/imprimir). */
export function savePrintPayload(p: Proposta, cfg: Config) {
  safeSet(KEY_PRINT, JSON.stringify({ proposta: p, config: cfg }));
}
export function loadPrintPayload(): { proposta: Proposta; config: Config } | null {
  const raw = safeGet(KEY_PRINT);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { proposta: Proposta; config: Config };
  } catch {
    return null;
  }
}
