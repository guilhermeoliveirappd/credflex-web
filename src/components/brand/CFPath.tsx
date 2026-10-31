import { SYMBOL_PATH, SYMBOL_VIEWBOX } from "./logo-paths";

/**
 * Assinatura gráfica: o contorno do símbolo oficial (C + F) em traço fino,
 * usado em grande escala e recortado nas composições. SVG puro.
 */
export function CFPath({
  className = "",
  stroke = "var(--color-accent-400)",
  animate = false,
  weight = 2,
}: {
  className?: string;
  stroke?: string;
  animate?: boolean;
  weight?: number;
}) {
  return (
    <svg viewBox={SYMBOL_VIEWBOX} className={className} fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <path
        className={animate ? "draw-path" : undefined}
        style={{ ["--len" as string]: 5200 }}
        d={SYMBOL_PATH}
        stroke={stroke}
        strokeWidth={weight}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
