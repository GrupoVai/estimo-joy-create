// Modelo de dados do orçamento e da configuração (tabela de preços / catálogo).
// Tudo que aparece no documento vem daqui; valores calculados podem ser sobrescritos
// via `overrides` (chave = id do elemento no template).

export type Bebidas = "com" | "sem" | "com_e_sem";

export interface MenuItem {
  id: string;
  nome: string;
  ingredientes: string;
  alcool: boolean;
}

export type ServicoId =
  | "fonteCachaca"
  | "torreEspumante"
  | "tequileiro"
  | "shotBalaCoco"
  | "shotBananinha"
  | "pedraFloral"
  | "receptivo"
  | "maquinaTaca";

export interface Ajuste {
  tipo: "pct" | "valor";
  valor: number;
}

export interface PrecosManuais {
  /** força o regime da página 4 (null = pelo nº de convidados) */
  regime: "limitado" | "openbar" | null;
  /** aba da planilha (convidados) usada no open bar */
  faixaOpenBar: number | null;
  /** acréscimo % sobre a base 2026 */
  acrescimoPct: number | null;
  /** unidades das opções 1 e 2 do limitado */
  limitadoUnidades: [number | null, number | null];
  /** R$/unidade por faixa de bebida do limitado */
  limitadoUnitarios: [number | null, number | null, number | null, number | null];
}

export interface Proposta {
  /** identifica o orçamento no histórico (mesmo id = mesmo orçamento, versões diferentes) */
  id: string;
  nome: string;
  evento: string; // valor do dropdown (ex.: "Formatura", "Casamento", "Outras festas")
  eventoOutro: string; // texto livre quando evento === "Outras festas"
  data: string; // dd/mm/aaaa
  local: string;
  deslocamento: string; // "" => "R$ ISENTO"; senão valor digitado (ex.: "350,00")
  convidados: number | null;
  duracao: number | null; // horas
  contato: string;
  cerimonial: string;
  bebidas: Bebidas;
  menuSubtitulo: string; // "" => sem subtítulo
  menu: MenuItem[];
  bartenders: string; // só open bar
  /** unitario null = automático pelo ano do evento (Config.porAno) */
  cafeteria: { ativo: boolean; pacote: number; unitario: number | null };
  servicos: Record<ServicoId, boolean>;
  ajuste: Ajuste | null;
  /** Parâmetros de preço ajustados à mão nesta proposta (null = automático pela tabela). */
  precos: PrecosManuais;
  /** Sobrescritas de qualquer texto/valor do documento. chave = id do elemento. */
  overrides: Record<string, string>;
}

/** Valores que mudam conforme o ano do evento. */
export interface ValoresAno {
  /** seguro de taças e copos de vidro (R$) */
  seguroCopos: number;
  /** cada quebra ou extravio fora do seguro (R$) */
  quebra: number;
  /** cafeteria: R$ por unidade */
  cafeteriaUnitario: number;
}

export interface FaixaOpenBar {
  convidados: number; // "aba" da planilha
  pessoa: [number, number, number, number]; // R$/pessoa por opção (1 Absolut, 2 Wyborowa, 3 Smirnoff, 4 cliente) — base 4h, 2026
}

export interface Config {
  eventos: string[];
  limiteOpenBar: number; // convidados >= limite => open bar
  openBar: {
    horasBase: number; // 4
    faixas: FaixaOpenBar[];
    /** acréscimo % por ano e quadrimestre [jan-abr, mai-ago, set-dez] */
    acrescimos: Record<string, [number, number, number]>;
  };
  limitado: {
    unidades: [number, number]; // opção 1 e 2
    /** R$/unidade por faixa: [cliente, smirnoff+nacional, wyborowa+gordons, absolut+premium] */
    unitarios: [number, number, number, number];
  };
  cafeteria: { pacote: number };
  /** valores por ano do evento (chave = ano); ano sem linha usa o último ano anterior cadastrado */
  porAno: Record<string, ValoresAno>;
  catalogo: MenuItem[];
  presets: { com: string[]; comESem: string[] }; // ids do catálogo
  cafes: MenuItem[];
}
