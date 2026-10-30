import { showReviewMarkers } from "@/content/site";
import type { Fact, VerificationStatus } from "@/content/types";

/** Etiqueta visível apenas em ambientes de revisão. */
export function ReviewMark({ status = "pending", note }: { status?: VerificationStatus; note?: string }) {
  if (!showReviewMarkers || status === "confirmed") return null;
  return (
    <span className="review-mark" title={note}>
      A validar
    </span>
  );
}

export function FactText({ fact }: { fact: Fact }) {
  return (
    <>
      {fact.text} <ReviewMark status={fact.status} note={fact.note} />
    </>
  );
}
