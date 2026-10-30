/**
 * "O traço" — assinatura gráfica derivada do monograma: o arco do C se
 * abre em duas linhas paralelas (as barras do F), lidas como um caminho
 * que segue adiante. SVG puro, sem bibliotecas.
 */
export function CFPath({
  className = "",
  stroke = "var(--color-gold-400)",
  animate = false,
  weight = 2,
}: {
  className?: string;
  stroke?: string;
  animate?: boolean;
  weight?: number;
}) {
  return (
    <svg viewBox="0 0 600 400" className={className} fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <path
        className={animate ? "draw-path" : undefined}
        style={{ ["--len" as string]: 1500 }}
        d="M300 60 A140 140 0 1 0 300 340"
        stroke={stroke}
        strokeWidth={weight}
        vectorEffect="non-scaling-stroke"
      />
      <path
        className={animate ? "draw-path" : undefined}
        style={{ ["--len" as string]: 900, animationDelay: "0.6s" }}
        d="M210 150 H600 M210 240 H520 M210 150 V340"
        stroke={stroke}
        strokeWidth={weight}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
