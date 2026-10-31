import { SYMBOL_PATH, SYMBOL_VIEWBOX, WORDMARK_PATH, WORDMARK_VIEWBOX } from "./logo-paths";

/** Símbolo oficial (C + F). Cor herdada de `currentColor`. */
export function Monogram({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg viewBox={SYMBOL_VIEWBOX} className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <path fill="currentColor" fillRule="evenodd" d={SYMBOL_PATH} />
    </svg>
  );
}

/**
 * Assinatura horizontal (símbolo + logotipo), derivada da versão vertical
 * oficial. Amarelo oficial sobre o roxo; roxo sobre superfícies claras.
 * Versão horizontal a validar com o manual de marca.
 */
export function Logo({ tone = "light", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${tone === "light" ? "text-accent-400" : "text-brand-900"} ${className}`}>
      <Monogram className="h-10 w-auto flex-none" />
      <svg viewBox={WORDMARK_VIEWBOX} className="h-[21px] w-auto flex-none" aria-hidden>
        <path fill="currentColor" fillRule="evenodd" d={WORDMARK_PATH} />
      </svg>
      <span className="sr-only">CredFlex</span>
    </span>
  );
}
