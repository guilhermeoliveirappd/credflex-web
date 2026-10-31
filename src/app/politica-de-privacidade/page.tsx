import type { Metadata } from "next";
import { LegalDocument } from "@/components/privacy/LegalDocument";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({ title: "Política de privacidade", description: "Como a CredFlex trata dados pessoais.", path: "/politica-de-privacidade" });

export default function Page() {
  return (
    <LegalDocument
      title="Política de privacidade"
      crumb="Política de privacidade"
      path="/politica-de-privacidade"
      sections={[
        { id: "controlador", title: "Quem é o controlador", body: <p>[Razão social], inscrita no CNPJ [número], com sede em [endereço], Osvaldo Cruz/SP. Encarregado(a) pelo tratamento de dados: [nome e canal de contato].</p> },
        {
          id: "dados",
          title: "Quais dados coletamos",
          body: (
            <ul>
              <li>Na pré-análise: modalidade de interesse, respostas às perguntas do formulário, valor e prazo pretendidos (opcionais), nome e WhatsApp.</li>
              <li>Não coletamos CPF no site nesta etapa.</li>
              <li>Em Trabalhe Conosco: nome, contato e currículo enviado.</li>
              <li>Cookies e tecnologias similares, conforme a Política de Cookies e as suas preferências.</li>
            </ul>
          ),
        },
        { id: "finalidades", title: "Para que usamos", body: <p>Retornar o contato solicitado, orientar sobre modalidades de crédito e encaminhar a solicitação a instituições parceiras quando você autorizar. Envio de ofertas somente com consentimento específico e revogável. [Bases legais a definir pelo jurídico.]</p> },
        { id: "compartilhamento", title: "Com quem compartilhamos", body: <p>[Instituições financeiras parceiras, fornecedor de CRM e provedores de infraestrutura. Lista a confirmar.]</p> },
        { id: "retencao", title: "Por quanto tempo guardamos", body: <p>[Prazos de retenção a definir.]</p> },
        { id: "direitos", title: "Seus direitos", body: <p>Você pode solicitar confirmação, acesso, correção, anonimização, portabilidade, eliminação e informações sobre compartilhamento, além de revogar consentimentos, pelo canal [contato do encarregado].</p> },
        { id: "seguranca", title: "Segurança", body: <p>Os dados trafegam por conexão criptografada, são validados no servidor e não são enviados a ferramentas de medição. [Detalhar medidas após definição do CRM.]</p> },
      ]}
    />
  );
}
