import type { Metadata } from "next";
import { site } from "@/content/site";

export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  const url = new URL(path, site.url).toString();
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url,
      siteName: site.name,
      title,
      description,
    },
  };
}

/** JSON-LD somente com dados confirmados. Campos nulos não são emitidos. */
export function organizationJsonLd() {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: site.name,
    url: site.url,
    areaServed: "BR",
  };
  if (site.legal.razaoSocial) data.legalName = site.legal.razaoSocial;
  const tel = site.channels.phone ?? site.channels.whatsapp;
  if (tel) data.telephone = `+${tel.replace(/\D/g, "")}`;
  if (site.channels.email) data.email = site.channels.email;
  if (site.location.street && site.location.status !== "pending") {
    data.address = {
      "@type": "PostalAddress",
      streetAddress: `${site.location.street}, ${site.location.district}`,
      addressLocality: site.location.city,
      addressRegion: site.location.state,
      postalCode: site.location.postalCode ?? undefined,
      addressCountry: "BR",
    };
  }
  return data;
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: new URL(it.path, site.url).toString(),
    })),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
