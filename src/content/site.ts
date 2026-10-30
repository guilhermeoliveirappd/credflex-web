import { pending, type Fact } from "./types";

/**
 * Dados institucionais centralizados.
 * Nada aqui foi confirmado pela CredFlex nesta fase: a auditoria
 * (auditoria-credflex.md) não estava disponível no workspace e o site atual
 * não pôde ser acessado pela política de rede do ambiente de desenvolvimento.
 * Campos `null` NÃO devem ser preenchidos com valores presumidos.
 */
export const site = {
  name: "CredFlex",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "pt-BR",

  legal: {
    /** Inconsistência apontada na auditoria — aguardando documento oficial. */
    razaoSocial: null as string | null,
    cnpj: null as string | null,
    /** Instituições parceiras das quais a CredFlex é correspondente. */
    partners: [] as string[],
    dpo: null as { name: string; email: string } | null,
  },

  location: {
    city: "Osvaldo Cruz",
    state: "SP",
    street: null as string | null,
    postalCode: null as string | null,
    openingHours: null as string | null,
    mapsUrl: null as string | null,
    status: "pending" as const,
    note: "Cidade citada no site atual. Endereço completo, horário e fotos a confirmar.",
  },

  history: {
    foundedYear: 2017,
    status: "pending" as const,
    note: "Ano de início citado no briefing; marcos históricos a confirmar.",
  },

  /**
   * Canais oficiais. O site antigo exibia números diferentes; nenhum deles é
   * usado aqui. Configure via variáveis de ambiente após confirmação.
   */
  channels: {
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || null,
    phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || null,
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || null,
  },

  antiFraudMessage: "A CredFlex não solicita depósitos antecipados para liberar crédito.",
} as const;

export const roleFacts: Fact[] = [
  pending(
    "A CredFlex atua como correspondente bancário: intermedeia a contratação de produtos de crédito oferecidos por instituições financeiras parceiras.",
    "Descrição do site atual. Confirmar instituições parceiras e redação com o jurídico (Res. CMN 4.935/2021).",
  ),
  pending(
    "As condições finais — taxa de juros, prazo, valor e Custo Efetivo Total (CET) — são definidas pela instituição parceira após análise de crédito.",
  ),
  pending("A contratação depende de aprovação e não é garantida pela pré-análise."),
];

export function formatPhoneDisplay(e164: string): string {
  const d = e164.replace(/\D/g, "").replace(/^55/, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return e164;
}

/** Marcadores de revisão: visíveis fora de produção ou quando forçados. */
export const showReviewMarkers =
  process.env.NEXT_PUBLIC_SHOW_REVIEW_MARKERS === "true" ||
  (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_SHOW_REVIEW_MARKERS !== "false");
