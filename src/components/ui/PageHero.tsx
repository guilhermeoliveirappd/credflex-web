import type { ReactNode } from "react";
import { CFPath } from "@/components/brand/CFPath";
import { Breadcrumbs } from "./Breadcrumbs";
import { Eyebrow } from "./SectionHeading";

export function PageHero({
  eyebrow,
  title,
  lead,
  path,
  crumb,
  tone = "paper",
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  path: string;
  crumb: string;
  tone?: "paper" | "navy";
  children?: ReactNode;
}) {
  const dark = tone === "navy";
  return (
    <section aria-labelledby="page-title" className={`relative overflow-hidden ${dark ? "bg-navy-950 text-white" : "bg-paper"}`}>
      <CFPath className="pointer-events-none absolute -right-[12%] top-0 hidden h-full w-[55%] opacity-50 lg:block" stroke={dark ? "var(--color-gold-400)" : "var(--color-sand-600)"} weight={1.2} />
      <div className="container-x relative pb-16 pt-8 lg:pb-24 lg:pt-10">
        <Breadcrumbs items={[{ name: crumb, path }]} tone={dark ? "light" : "dark"} />
        <div className="mt-12 max-w-3xl">
          <Eyebrow tone={dark ? "light" : "dark"}>{eyebrow}</Eyebrow>
          <h1 id="page-title" className={`t-h1 mt-6 ${dark ? "text-white" : "text-navy-950"}`}>
            {title}
          </h1>
          {lead && <p className={`t-lead mt-6 max-w-[48ch] ${dark ? "text-navy-100" : "text-ink-2"}`}>{lead}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
