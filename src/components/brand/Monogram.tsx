/**
 * Monograma CF PROVISÓRIO — redesenho geométrico para desenvolvimento.
 * Substituir pelo vetor oficial da marca (ver docs/design-system.md).
 * C: arco aberto à direita. F: haste + duas barras que "saem" pela abertura.
 */
export function Monogram({ className = "", title, onDark = false }: { className?: string; title?: string; onDark?: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <rect width="48" height="48" rx="9" fill={onDark ? "var(--color-brand-700)" : "var(--color-brand-900)"} />
      <path d="M33.5 13.6A15 15 0 1 0 33.5 34.4" fill="none" stroke="#fff" strokeWidth="4.6" strokeLinecap="square" />
      <path d="M21 17.5h20M21 26h14M21 15.2v20" fill="none" stroke="var(--color-accent-400)" strokeWidth="4.6" strokeLinecap="square" />
    </svg>
  );
}

export function Logo({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Monogram className="h-9 w-9 flex-none" onDark={tone === "light"} />
      <span
        className={`font-[family-name:var(--font-display)] text-[1.42rem] font-semibold tracking-[-0.035em] leading-none ${tone === "light" ? "text-white" : "text-brand-900"}`}
      >
        Cred<span className={tone === "light" ? "text-accent-400" : "text-brand-700"}>Flex</span>
      </span>
    </span>
  );
}
