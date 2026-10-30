import Link from "next/link";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/metadata";

export function Breadcrumbs({ items, tone = "dark" }: { items: { name: string; path: string }[]; tone?: "dark" | "light" }) {
  const all = [{ name: "Início", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Você está em" className={`t-small ${tone === "light" ? "text-navy-300" : "text-stone"}`}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {all.map((it, i) => (
            <li key={it.path} className="flex items-center gap-2">
              {i < all.length - 1 ? (
                <>
                  <Link href={it.path} className="underline-offset-4 hover:underline">
                    {it.name}
                  </Link>
                  <span aria-hidden>/</span>
                </>
              ) : (
                <span aria-current="page" className={tone === "light" ? "text-white" : "text-ink"}>
                  {it.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </>
  );
}
