/**
 * Toda afirmação comercial, institucional ou regulatória passa por este tipo.
 * `pending` = sugerida pela auditoria ou herdada do site antigo, ainda não
 * confirmada pela CredFlex. Itens pendentes aparecem marcados em ambientes
 * de revisão (ver `showReviewMarkers`) e constam em docs/launch-checklist.md.
 */
export type VerificationStatus = "confirmed" | "pending";

export interface Fact {
  text: string;
  status: VerificationStatus;
  /** Origem ou motivo da pendência, para revisão comercial/jurídica. */
  note?: string;
}

export const pending = (text: string, note?: string): Fact => ({ text, status: "pending", note });
export const confirmed = (text: string): Fact => ({ text, status: "confirmed" });

export interface FaqItem {
  q: string;
  a: string;
  status: VerificationStatus;
}
