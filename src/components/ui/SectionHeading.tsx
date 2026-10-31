import type { ReactNode } from "react";

export function SectionHeading({
  title,
  lead,
  tone = "dark",
  id,
  as: As = "h2",
  className = "",
}: {
  title: ReactNode;
  lead?: ReactNode;
  tone?: "dark" | "light";
  id?: string;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={className}>
      <As id={id} className={`${As === "h1" ? "t-h1" : "t-h2"} ${tone === "light" ? "text-white" : "text-brand-950"}`}>
        {title}
      </As>
      {lead && <p className={`t-lead mt-5 max-w-[46ch] ${tone === "light" ? "text-brand-100" : "text-ink-2"}`}>{lead}</p>}
    </div>
  );
}
