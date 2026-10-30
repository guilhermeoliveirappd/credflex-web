import type { ProductSlug } from "@/content/products";

/** Registro enviado ao CRM. CPF não é coletado nesta fase. */
export interface LeadRecord {
  protocol: string;
  createdAt: string;
  product: ProductSlug;
  originProduct: ProductSlug;
  route: "prequal" | "human-review";
  answers: Record<string, string>;
  flags: string[];
  amount: number | null;
  term: string | null;
  contact: {
    name: string;
    /** E.164, ex.: +5518999999999 */
    whatsapp: string;
    bestTime: string;
  };
  consents: {
    contact: true;
    marketing: boolean;
    /** Versão do texto de consentimento exibido. */
    textVersion: string;
  };
  sourcePath: string;
  utm?: Record<string, string>;
}

export interface LeadAdapterResult {
  /** Identificador devolvido pelo CRM, quando houver. */
  externalId?: string;
}

export interface LeadAdapter {
  readonly name: string;
  /** Adaptadores de desenvolvimento nunca devem responder em produção. */
  readonly productionReady: boolean;
  submit(lead: LeadRecord): Promise<LeadAdapterResult>;
}

export class LeadAdapterError extends Error {
  constructor(
    message: string,
    readonly retryable: boolean,
  ) {
    super(message);
  }
}
