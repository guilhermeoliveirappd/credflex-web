import type { Metadata } from "next";
import { ThankYouExperience } from "@/components/wizard/ThankYouExperience";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Solicitação recebida",
  description: "Confirmação de recebimento da sua pré-análise na CredFlex.",
  path: "/obrigado",
  noindex: true,
});

export default function ObrigadoPage() {
  return (
    <div className="bg-paper">
      <div className="container-x py-[var(--section-y)]">
        <ThankYouExperience />
      </div>
    </div>
  );
}
