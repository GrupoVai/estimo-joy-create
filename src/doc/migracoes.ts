// Migrações do localStorage entre versões do app (roda uma vez, controlada por `coktelitas.schema`).
import { safeGet, safeSet } from "./config";

const KEY_SCHEMA = "coktelitas.schema";
const VERSAO_ATUAL = 2;

/**
 * v2 — cafeteria por ano: o R$/unidade deixou de ser gravado na proposta (null = automático).
 * Propostas e versões do histórico salvas antes traziam o padrão antigo (18) gravado; vira automático.
 */
function v2() {
  const limpa = (p: { cafeteria?: { unitario?: number | null } } | null | undefined) => {
    if (p?.cafeteria && p.cafeteria.unitario === 18) p.cafeteria.unitario = null;
  };
  const prop = safeGet("coktelitas.proposta.v1");
  if (prop) {
    try {
      const p = JSON.parse(prop) as { cafeteria?: { unitario?: number | null } };
      limpa(p);
      safeSet("coktelitas.proposta.v1", JSON.stringify(p));
    } catch {
      /* ignora */
    }
  }
  const hist = safeGet("coktelitas.historico.v1");
  if (hist) {
    try {
      const h = JSON.parse(hist) as {
        versoes?: { proposta?: { cafeteria?: { unitario?: number | null } } }[];
      }[];
      if (Array.isArray(h)) for (const e of h) for (const v of e.versoes ?? []) limpa(v.proposta);
      safeSet("coktelitas.historico.v1", JSON.stringify(h));
    } catch {
      /* ignora */
    }
  }
}

/** Idempotente: aplica só as migrações ainda não aplicadas neste navegador. */
export function migrarArmazenamento() {
  if (typeof window === "undefined") return;
  const atual = parseInt(safeGet(KEY_SCHEMA) ?? "1", 10) || 1;
  if (atual >= VERSAO_ATUAL) return;
  if (atual < 2) v2();
  safeSet(KEY_SCHEMA, String(VERSAO_ATUAL));
}
