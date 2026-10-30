import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  // Ambientes de homologação não devem ser indexados.
  if (process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "true") return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", // Páginas noindex NÃO são bloqueadas aqui: o crawler precisa ler o noindex.
    disallow: ["/api/"] },
    sitemap: new URL("/sitemap.xml", site.url).toString(),
  };
}
