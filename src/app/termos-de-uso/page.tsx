import type { Metadata } from "next";
import { LegalDocument } from "@/components/privacy/LegalDocument";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({ title: "Termos de uso", description: "Termos de uso do site da CredFlex.", path: "/termos-de-uso" });

export default function Page() {
  return (
    <LegalDocument
      title="Termos de uso"
      crumb="Termos de uso"
      path="/termos-de-uso"
      sections={[
        { id: "objeto", title: "Sobre o site", body: <p>Este site apresenta informações sobre modalidades de crédito intermediadas pela [razão social], correspondente bancário de [instituições parceiras].</p> },
        { id: "pre-analise", title: "Pré-análise não é contratação", body: <p>O envio do formulário não constitui proposta, aprovação ou contratação de crédito. Condições são definidas pela instituição parceira após análise.</p> },
        { id: "informacoes", title: "Informações do site", body: <p>Os conteúdos têm caráter informativo e podem mudar conforme normas e políticas das instituições.</p> },
        { id: "seguranca", title: "Segurança", body: <p>A CredFlex não solicita pagamentos antecipados. Confira sempre os canais oficiais.</p> },
        { id: "foro", title: "Disposições gerais", body: <p>[Cláusulas de foro, alterações e contato a definir pelo jurídico.]</p> },
      ]}
    />
  );
}
