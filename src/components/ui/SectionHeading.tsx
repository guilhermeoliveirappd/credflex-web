import type { ReactNode } from "react";

export function Eyebrow({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "light" }) {
  return (
    <p className={`t-eyebrow flex items-center gap-3 ${tone === "light" ? "text-gold-300" : "text-navy-700"}`}>
      <span className="fbars" aria-hidden />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  tone = "dark",
  id,
  as: As = "h2",
  className = "",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  tone?: "dark" | "light";
  id?: string;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={className}>
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <As id={id} className={`${As === "h1" ? "t-h1" : "t-h2"} mt-5 ${tone === "light" ? "text-white" : "text-navy-950"}`}>
        {title}
      </As>
      {lead && <p className={`t-lead mt-5 max-w-[46ch] ${tone === "light" ? "text-navy-100" : "text-ink-2"}`}>{lead}</p>}
    </div>
  );
}
