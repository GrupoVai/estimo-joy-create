// Estado do editor: proposta + config com persistência local (autosave).
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  loadConfig,
  loadProposta,
  menuDoPreset,
  novaProposta,
  saveProposta,
  subtituloDoPreset,
} from "@/doc/config";
import { migrarArmazenamento } from "@/doc/migracoes";
import type { Bebidas, Config, Proposta } from "@/doc/types";

export function useProposta() {
  const [cfg, setCfg] = useState<Config | null>(null);
  const [p, setP] = useState<Proposta | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    migrarArmazenamento();
    const c = loadConfig();
    setCfg(c);
    setP(loadProposta(c));
  }, []);

  // autosave (debounce)
  useEffect(() => {
    if (!p) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => saveProposta(p), 300);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [p]);

  const setField = useCallback((patch: Partial<Proposta>) => {
    setP((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const setOverride = useCallback((key: string, value: string | null) => {
    setP((prev) => {
      if (!prev) return prev;
      const overrides = { ...prev.overrides };
      if (value === null) delete overrides[key];
      else overrides[key] = value;
      return { ...prev, overrides };
    });
  }, []);

  const setBebidas = useCallback(
    (b: Bebidas) => {
      if (!cfg) return;
      setP((prev) =>
        prev
          ? { ...prev, bebidas: b, menu: menuDoPreset(b, cfg), menuSubtitulo: subtituloDoPreset(b) }
          : prev,
      );
    },
    [cfg],
  );

  const nova = useCallback(() => {
    if (!cfg) return;
    setP(novaProposta(cfg));
  }, [cfg]);

  const limparOverrides = useCallback(() => {
    setP((prev) => (prev ? { ...prev, overrides: {} } : prev));
  }, []);

  const api = useMemo(
    () => ({ cfg, p, setP, setField, setOverride, setBebidas, nova, limparOverrides, setCfg }),
    [cfg, p, setField, setOverride, setBebidas, nova, limparOverrides],
  );
  return api;
}
