import type { ProductSlug } from "@/content/products";
import { getFlow, type ChoiceOption } from "./flows";

export type Answers = Record<string, string>;

export type RouteDecision =
  /** Segue na modalidade escolhida. */
  | { kind: "continue"; product: ProductSlug }
  /** Usuário indicou que outra modalidade é a correta. */
  | { kind: "switch"; from: ProductSlug; to: ProductSlug; questionId: string }
  /** Caso precisa de atendimento humano antes de qualquer oferta (ex.: BPC/LOAS). */
  | { kind: "human-review"; product: ProductSlug; reason: string }
  /** Somente com regra validada. */
  | { kind: "ineligible"; product: ProductSlug; questionId: string };

function selectedOption(product: ProductSlug, questionId: string, answers: Answers): ChoiceOption | undefined {
  const q = getFlow(product)?.questions.find((x) => x.id === questionId);
  if (!q || q.kind !== "choice") return undefined;
  return q.options.find((o) => o.value === answers[questionId]);
}

/**
 * Avalia as respostas na ordem das perguntas. A primeira regra de desvio
 * encontrada vence. Regras `ineligible` não validadas são ignoradas.
 */
export function decideRoute(product: ProductSlug, answers: Answers): RouteDecision {
  const flow = getFlow(product);
  if (!flow) return { kind: "human-review", product, reason: "modalidade-sem-fluxo" };

  for (const q of flow.questions) {
    if (q.kind !== "choice") continue;
    const opt = selectedOption(product, q.id, answers);
    if (!opt) continue;
    if (opt.outcome === "ineligible" && opt.validated === true) {
      return { kind: "ineligible", product, questionId: q.id };
    }
    if (opt.routeTo === "human-review") {
      // BPC/LOAS é benefício assistencial: nunca seguir como consignado INSS.
      const target: ProductSlug = opt.flag === "bpc-loas" ? "bpc-loas" : product;
      return { kind: "human-review", product: target, reason: opt.flag ?? q.id };
    }
    if (opt.routeTo && opt.routeTo !== product) {
      return { kind: "switch", from: product, to: opt.routeTo, questionId: q.id };
    }
  }
  return { kind: "continue", product };
}

/** Flags internas (sem dados pessoais) para contexto do atendimento. */
export function collectFlags(product: ProductSlug, answers: Answers): string[] {
  const flow = getFlow(product);
  if (!flow) return [];
  const flags: string[] = [];
  for (const q of flow.questions) {
    if (q.kind !== "choice") continue;
    const opt = selectedOption(product, q.id, answers);
    if (opt?.flag) flags.push(opt.flag);
  }
  return flags;
}
