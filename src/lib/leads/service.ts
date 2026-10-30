import { randomInt } from "node:crypto";
import { leadPayloadSchema, phoneDigits } from "@/lib/prequal/schema";
import { collectFlags, decideRoute } from "@/lib/prequal/routing";
import { RateLimiter } from "@/lib/security/rate-limit";
import { LeadAdapterError, type LeadAdapter, type LeadRecord } from "./types";
import { buildWhatsappUrl } from "./whatsapp";

export const CONSENT_TEXT_VERSION = "2026-10-v1-rascunho";
const MIN_ELAPSED_MS = 3000;

export interface LeadResponseBody {
  ok: boolean;
  protocol?: string;
  route?: LeadRecord["route"];
  product?: LeadRecord["product"];
  whatsappUrl?: string | null;
  /** true quando o lead foi aceito por adaptador de desenvolvimento. */
  devMode?: boolean;
  error?: "invalid" | "rate_limited" | "unavailable" | "rejected";
  fieldErrors?: Record<string, string>;
}

interface Deps {
  adapter: LeadAdapter | null;
  limiter: RateLimiter;
  /** idempotencyKey → resposta já emitida */
  seen: Map<string, { at: number; body: LeadResponseBody }>;
  isProduction: boolean;
  now?: () => number;
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function newProtocol(): string {
  let s = "";
  for (let i = 0; i < 8; i++) s += ALPHABET[randomInt(ALPHABET.length)];
  return `CF-${s.slice(0, 4)}-${s.slice(4)}`;
}

export async function processLead(raw: unknown, clientKey: string, deps: Deps): Promise<{ status: number; body: LeadResponseBody; retryAfter?: number }> {
  const now = deps.now?.() ?? Date.now();

  const rl = deps.limiter.check(clientKey, now);
  if (!rl.ok) return { status: 429, body: { ok: false, error: "rate_limited" }, retryAfter: rl.retryAfterS };

  const parsed = leadPayloadSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path.join(".")] ??= issue.message;
    return { status: 422, body: { ok: false, error: "invalid", fieldErrors } };
  }
  const p = parsed.data;

  // Bots: honeypot preenchido ou envio instantâneo. Resposta neutra, sem registro.
  if (p.website || p.elapsedMs < MIN_ELAPSED_MS) {
    return { status: 400, body: { ok: false, error: "rejected" } };
  }

  // Idempotência: reenvio do mesmo formulário devolve a mesma resposta.
  const prev = deps.seen.get(p.idempotencyKey);
  if (prev && now - prev.at < 24 * 3600_000) return { status: 200, body: prev.body };

  if (!deps.adapter || (deps.isProduction && !deps.adapter.productionReady)) {
    // Nunca simular sucesso de captação em produção.
    return { status: 503, body: { ok: false, error: "unavailable" } };
  }

  // A rota é recalculada no servidor — o cliente não decide sozinho.
  const decision = decideRoute(p.originProduct, p.answers);
  const product = decision.kind === "switch" ? decision.to : decision.kind === "human-review" ? decision.product : p.product;
  const route: LeadRecord["route"] = decision.kind === "human-review" ? "human-review" : "prequal";

  const lead: LeadRecord = {
    protocol: newProtocol(),
    createdAt: new Date(now).toISOString(),
    product,
    originProduct: p.originProduct,
    route,
    answers: p.answers,
    flags: [...new Set([...collectFlags(p.originProduct, p.answers), ...collectFlags(product, p.answers)])],
    amount: p.amountTerm?.amountUnknown ? null : (p.amountTerm?.amount ?? null),
    term: p.amountTerm?.term ?? null,
    contact: { name: p.contact.name, whatsapp: `+55${phoneDigits(p.contact.whatsapp)}`, bestTime: p.contact.bestTime },
    consents: { contact: true, marketing: p.contact.consentMarketing, textVersion: CONSENT_TEXT_VERSION },
    sourcePath: p.sourcePath,
    utm: p.utm && Object.keys(p.utm).length ? (p.utm as Record<string, string>) : undefined,
  };

  try {
    await deps.adapter.submit(lead);
  } catch (e) {
    const retryable = e instanceof LeadAdapterError ? e.retryable : true;
    console.error(`[leads] falha no adaptador ${deps.adapter.name} (retryable=${retryable})`);
    return { status: 502, body: { ok: false, error: "unavailable" } };
  }

  const body: LeadResponseBody = {
    ok: true,
    protocol: lead.protocol,
    route,
    product,
    whatsappUrl: buildWhatsappUrl({ product, protocol: lead.protocol }),
    devMode: !deps.adapter.productionReady,
  };
  deps.seen.set(p.idempotencyKey, { at: now, body });
  if (deps.seen.size > 5000) {
    for (const [k, v] of deps.seen) if (now - v.at > 24 * 3600_000) deps.seen.delete(k);
  }
  return { status: 201, body };
}
