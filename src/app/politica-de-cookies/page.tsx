import type { Metadata } from "next";
import { LegalDocument } from "@/components/privacy/LegalDocument";
import { CookiePreferencesButton } from "@/components/privacy/CookiePreferencesButton";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({ title: "Política de cookies", description: "Quais cookies a CredFlex usa e como gerenciar suas preferências.", path: "/politica-de-cookies" });

export default function Page() {
  return (
    <LegalDocument
      title="Política de cookies"
      crumb="Política de cookies"
      path="/politica-de-cookies"
      sections={[
        { id: "o-que-sao", title: "O que são cookies", body: <p>Pequenos arquivos guardados pelo navegador que permitem lembrar escolhas e medir o uso do site.</p> },
        {
          id: "categorias",
          title: "Categorias",
          body: (
            <ul>
              <li><strong>Necessários:</strong> <code>cf_consent</code> (guarda suas preferências, 6 meses). Sempre ativos.</li>
              <li><strong>Medição:</strong> ferramentas de analytics (ex.: Google Analytics 4 via Google Tag Manager), somente após consentimento. [Lista definitiva a confirmar.]</li>
              <li><strong>Publicidade:</strong> pixels de mídia, somente após consentimento. [Lista definitiva a confirmar.]</li>
            </ul>
          ),
        },
        { id: "armazenamento-local", title: "Armazenamento na sessão", body: <p>O formulário de pré-análise guarda as respostas não identificáveis na sessão do navegador (sessionStorage) para você não perder o progresso. Nome e WhatsApp não são guardados nesse rascunho.</p> },
        { id: "gerenciar", title: "Como gerenciar", body: <p>Você pode rever sua escolha a qualquer momento: <CookiePreferencesButton className="font-semibold text-brand-700 underline" />.</p> },
      ]}
    />
  );
}
