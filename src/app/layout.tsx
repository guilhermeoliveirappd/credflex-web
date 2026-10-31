import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { AntiFraudBar } from "@/components/layout/AntiFraudBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CookieConsent } from "@/components/privacy/CookieConsent";
import { CtaTracker } from "@/components/ui/CtaTracker";
import { site } from "@/content/site";
import { buildWhatsappUrl } from "@/lib/leads/whatsapp";
import { JsonLd, organizationJsonLd } from "@/lib/seo/metadata";
import "./globals.css";

const display = localFont({
  src: "../fonts/bricolage.woff2",
  variable: "--font-bricolage",
  weight: "200 800",
  display: "swap",
  adjustFontFallback: "Arial",
});

const sans = localFont({
  src: "../fonts/manrope.woff2",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "CredFlex — crédito com gente de verdade por trás", template: "%s | CredFlex" },
  description:
    "Correspondente bancário em Osvaldo Cruz/SP. Consignado CLT, INSS, portabilidade, servidor público, FGTS e conta de luz com atendimento humano e informação clara.",
  applicationName: "CredFlex",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0a0c3c",
  width: "device-width",
  initialScale: 1,
};

// Consent Mode v2: tudo negado por padrão, antes de qualquer tag.
const consentDefault = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable}`}>
      <head>
        {process.env.NEXT_PUBLIC_GTM_ID && <script dangerouslySetInnerHTML={{ __html: consentDefault }} />}
      </head>
      <body>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-accent-400 focus:px-4 focus:py-3 focus:font-bold focus:text-brand-950"
        >
          Pular para o conteúdo
        </a>
        <AntiFraudBar />
        <Header whatsappHref={buildWhatsappUrl({})} />
        <main id="conteudo" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <CookieConsent />
        <CtaTracker />
        <JsonLd data={organizationJsonLd()} />
      </body>
    </html>
  );
}
