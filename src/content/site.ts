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
    /** Informado pela CredFlex em 31/10/2026. */
    cnpj: "23.014.866/0001-57" as string | null,
    /** Instituições parceiras das quais a CredFlex é correspondente. */
    partners: [] as string[],
    dpo: null as { name: string; email: string } | null,
  },

  /** Endereço informado pela CredFlex em 31/10/2026. */
  location: {
    city: "Osvaldo Cruz",
    state: "SP",
    street: "Rua Fernando Costa, 495" as string | null,
    district: "Centro",
    postalCode: "17700-000" as string | null,
    openingHours: null as string | null,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rua+Fernando+Costa%2C+495%2C+Centro%2C+Osvaldo+Cruz+-+SP%2C+17700-000" as string | null,
    status: "confirmed" as "confirmed" | "pending",
    note: "Endereço confirmado pela CredFlex. Horário de atendimento a confirmar.",
  },

  history: {
    foundedYear: 2017,
    status: "pending" as const,
    note: "Ano de início citado no briefing; marcos históricos a confirmar.",
  },

  /**
   * Canais oficiais informados pela CredFlex em 31/10/2026 (variáveis de
   * ambiente sobrescrevem). O telefone fixo foi recebido incompleto
   * ("(18) 3529-2…") e permanece nulo até confirmação.
   */
  channels: {
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5518981605017",
    phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || null,
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "atendimento@credflexfinanceira.com.br",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || null,
  },

  /** Crédito de desenvolvimento no rodapé. `url` fica nulo até ser informado. */
  credits: { name: "NESX Performance & Growth", url: null as string | null },

  antiFraudMessage: "A CredFlex não solicita depósitos antecipados para liberar crédito.",
} as const;

export const roleFacts: Fact[] = [
  pending(
    "A CredFlex atua como correspondente bancário: intermedeia a contratação de produtos de crédito oferecidos por instituições financeiras parceiras.",
    "Descrição do site atual. Confirmar instituições parceiras e redação com o jurídico (Res. CMN 4.935/2021).",
  ),
  pending(
    "As condições finais (taxa de juros, prazo, valor e Custo Efetivo Total, o CET) são definidas pela instituição parceira após análise de crédito.",
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
