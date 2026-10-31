import type { ReactNode } from "react";
import { CFPath } from "@/components/brand/CFPath";
import { Breadcrumbs } from "./Breadcrumbs";

export function PageHero({
  title,
  lead,
  path,
  crumb,
  tone = "accent",
  children,
}: {
  title: ReactNode;
  lead?: ReactNode;
  path: string;
  crumb: string;
  tone?: "accent" | "navy" | "white";
  children?: ReactNode;
}) {
  const dark = tone === "navy";
  return (
    <section aria-labelledby="page-title" className={`relative overflow-hidden ${dark ? "bg-brand-950 text-white" : tone === "accent" ? "bg-accent-400 text-brand-950" : "bg-white"}`}>
      <CFPath className={`pointer-events-none absolute -right-[12%] top-0 hidden h-full w-[55%] lg:block ${dark ? "opacity-50" : "opacity-40"}`} stroke={dark ? "var(--color-accent-400)" : tone === "accent" ? "var(--color-brand-900)" : "var(--color-sand-600)"} weight={1.2} />
      <div className="container-x relative pb-16 pt-8 lg:pb-24 lg:pt-10">
        <Breadcrumbs items={[{ name: crumb, path }]} tone={dark ? "light" : "dark"} />
        <div className="mt-12 max-w-3xl">
          <h1 id="page-title" className={`t-h1 ${dark ? "text-white" : "text-brand-950"}`}>
            {title}
          </h1>
          {lead && <p className={`t-lead mt-6 max-w-[48ch] ${dark ? "text-brand-100" : "text-brand-950"}`}>{lead}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
