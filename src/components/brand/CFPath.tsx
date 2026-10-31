import { SYMBOL_PATH, SYMBOL_VIEWBOX } from "./logo-paths";

/**
 * Contorno estático do símbolo oficial (C + F) em linha fina, usado em grande
 * escala e recortado nas composições. Sem animação de traço: o símbolo é
 * formado por vários contornos e o efeito de "desenho" gerava tracinhos soltos.
 */
export function CFPath({
  className = "",
  stroke = "var(--color-accent-400)",
  weight = 2,
}: {
  className?: string;
  stroke?: string;
  weight?: number;
}) {
  return (
    <svg viewBox={SYMBOL_VIEWBOX} className={className} fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <path d={SYMBOL_PATH} stroke={stroke} strokeWidth={weight} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
