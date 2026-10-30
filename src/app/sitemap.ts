import type { MetadataRoute } from "next";
import { publicPaths } from "@/content/routes";
import { site } from "@/content/site";


export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.map((p) => ({ url: new URL(p, site.url).toString(), changeFrequency: "monthly", priority: p === "/" ? 1 : 0.7 }));
}
