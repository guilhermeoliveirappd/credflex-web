"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics/events";

/**
 * Delegação de cliques: componentes de servidor marcam CTAs com
 * `data-cta="id"` e continuam sem JavaScript próprio.
 */
export function CtaTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cta]");
      if (!el) return;
      track("cta_click", { cta_id: el.dataset.cta, cta_location: el.closest("section")?.getAttribute("aria-labelledby") ?? undefined });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
