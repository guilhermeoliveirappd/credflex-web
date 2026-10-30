import { describe, expect, it } from "vitest";
import { DevMemoryAdapter, resolveLeadAdapter } from "@/lib/leads/adapters";
import { processLead, type LeadResponseBody } from "@/lib/leads/service";
import { buildWhatsappMessage, buildWhatsappUrl } from "@/lib/leads/whatsapp";
import { LeadAdapterError, type LeadAdapter } from "@/lib/leads/types";
import { RateLimiter } from "@/lib/security/rate-limit";

const payload = (over: Record<string, unknown> = {}) => ({
  idempotencyKey: crypto.randomUUID(),
  product: "consignado-inss",
  originProduct: "consignado-inss",
  answers: { tipoBeneficio: "aposentadoria", objetivo: "novo" },
  amountTerm: { amount: 5000, amountUnknown: false, term: "13-24" },
  contact: { name: "Maria Teste", whatsapp: "(18) 99999-8888", consentContact: true },
  elapsedMs: 20_000,
  ...over,
});

function deps(adapter: LeadAdapter | null = new DevMemoryAdapter(), isProduction = false) {
  return { adapter, limiter: new RateLimiter(100, 60_000), seen: new Map<string, { at: number; body: LeadResponseBody }>(), isProduction };
}

describe("processLead", () => {
  it("registra lead e devolve protocolo", async () => {
    const a = new DevMemoryAdapter();
    const r = await processLead(payload(), "k", deps(a));
    expect(r.status).toBe(201);
    expect(r.body.protocol).toMatch(/^CF-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
    expect(a.store[0].contact.whatsapp).toBe("+5518999998888");
    expect(a.store[0].consents.marketing).toBe(false);
  });

  it("o servidor recalcula a rota: BPC enviado como INSS vira bpc-loas/human-review", async () => {
    const a = new DevMemoryAdapter();
    const r = await processLead(payload({ answers: { tipoBeneficio: "bpc-loas", objetivo: "novo" } }), "k", deps(a));
    expect(r.body.product).toBe("bpc-loas");
    expect(a.store[0].route).toBe("human-review");
  });

  it("idempotência: mesmo envio não duplica lead", async () => {
    const a = new DevMemoryAdapter();
    const d = deps(a);
    const p = payload();
    const r1 = await processLead(p, "k", d);
    const r2 = await processLead(p, "k", d);
    expect(r2.body.protocol).toBe(r1.body.protocol);
    expect(a.store).toHaveLength(1);
  });

  it("honeypot e envio instantâneo são rejeitados sem registro", async () => {
    const a = new DevMemoryAdapter();
    expect((await processLead(payload({ website: "spam" }), "k", deps(a))).status).toBe(422);
    expect((await processLead(payload({ elapsedMs: 200 }), "k", deps(a))).status).toBe(400);
    expect(a.store).toHaveLength(0);
  });

  it("rate limit", async () => {
    const d = { ...deps(), limiter: new RateLimiter(1, 60_000) };
    await processLead(payload(), "ip", d);
    const r = await processLead(payload(), "ip", d);
    expect(r.status).toBe(429);
  });

  it("produção com adaptador de desenvolvimento NÃO simula sucesso", async () => {
    const r = await processLead(payload(), "k", deps(new DevMemoryAdapter(), true));
    expect(r.status).toBe(503);
  });

  it("sem adaptador configurado → 503", async () => {
    expect((await processLead(payload(), "k", deps(null))).status).toBe(503);
  });

  it("falha do CRM → 502 e permite nova tentativa", async () => {
    const failing: LeadAdapter = { name: "x", productionReady: true, submit: async () => { throw new LeadAdapterError("down", true); } };
    const d = deps(failing);
    const p = payload();
    expect((await processLead(p, "k", d)).status).toBe(502);
    expect(d.seen.size).toBe(0);
  });
});

describe("resolveLeadAdapter", () => {
  it("produção sem configuração não tem adaptador", () => {
    expect(resolveLeadAdapter({ NODE_ENV: "production" } as NodeJS.ProcessEnv)).toBeNull();
  });
  it("webhook exige URL e segredo", () => {
    expect(resolveLeadAdapter({ NODE_ENV: "production", LEAD_ADAPTER: "webhook", CRM_WEBHOOK_URL: "https://x" } as NodeJS.ProcessEnv)).toBeNull();
    expect(resolveLeadAdapter({ NODE_ENV: "production", LEAD_ADAPTER: "webhook", CRM_WEBHOOK_URL: "https://x", CRM_WEBHOOK_SECRET: "s" } as NodeJS.ProcessEnv)?.name).toBe("webhook");
  });
});

describe("WhatsApp", () => {
  it("mensagem tem protocolo e modalidade, sem dados pessoais", () => {
    const m = buildWhatsappMessage({ product: "consignado-clt", protocol: "CF-ABCD-EFGH" });
    expect(m).toContain("CF-ABCD-EFGH");
    expect(m).toContain("Consignado CLT");
    expect(m).not.toMatch(/\d{2}\s?9\d{4}/);
  });
  it("sem número oficial não há link", () => {
    expect(buildWhatsappUrl({}, null)).toBeNull();
    expect(buildWhatsappUrl({ protocol: "CF-1" }, "5518999990000")).toMatch(/^https:\/\/wa\.me\/5518999990000\?text=/);
  });
});
