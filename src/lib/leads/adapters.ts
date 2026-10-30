import { createHmac } from "node:crypto";
import { LeadAdapterError, type LeadAdapter, type LeadRecord } from "./types";

/**
 * Adaptador de desenvolvimento: guarda o lead em memória e registra no log
 * apenas metadados sem dados pessoais. NÃO é um CRM.
 */
export class DevMemoryAdapter implements LeadAdapter {
  readonly name = "dev-memory";
  readonly productionReady = false;
  readonly store: LeadRecord[] = [];

  async submit(lead: LeadRecord) {
    this.store.push(lead);
    console.info(
      `[leads:dev] protocolo=${lead.protocol} modalidade=${lead.product} rota=${lead.route} flags=${lead.flags.join(",") || "-"}`,
    );
    return { externalId: `DEV-${lead.protocol}` };
  }
}

/**
 * Webhook genérico para CRM (RD Station, HubSpot, Pipedrive, n8n…).
 * Assina o corpo com HMAC-SHA256 para que o receptor valide a origem.
 */
export class WebhookAdapter implements LeadAdapter {
  readonly name = "webhook";
  readonly productionReady = true;

  constructor(
    private readonly url: string,
    private readonly secret: string,
    private readonly timeoutMs = 8000,
  ) {}

  async submit(lead: LeadRecord) {
    const body = JSON.stringify({ type: "lead.created", lead });
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = createHmac("sha256", this.secret).update(`${timestamp}.${body}`).digest("hex");

    let res: Response;
    try {
      res = await fetch(this.url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-credflex-timestamp": timestamp,
          "x-credflex-signature": `sha256=${signature}`,
          "idempotency-key": lead.protocol,
        },
        body,
        signal: AbortSignal.timeout(this.timeoutMs),
      });
    } catch {
      throw new LeadAdapterError("CRM indisponível", true);
    }
    if (!res.ok) throw new LeadAdapterError(`CRM respondeu ${res.status}`, res.status >= 500 || res.status === 429);

    const data = (await res.json().catch(() => ({}))) as { id?: unknown };
    return { externalId: typeof data.id === "string" || typeof data.id === "number" ? String(data.id) : undefined };
  }
}

let devSingleton: DevMemoryAdapter | undefined;

export function resolveLeadAdapter(env: NodeJS.ProcessEnv = process.env): LeadAdapter | null {
  const kind = env.LEAD_ADAPTER ?? (env.NODE_ENV === "production" ? "" : "dev");
  if (kind === "webhook") {
    if (!env.CRM_WEBHOOK_URL || !env.CRM_WEBHOOK_SECRET) return null;
    return new WebhookAdapter(env.CRM_WEBHOOK_URL, env.CRM_WEBHOOK_SECRET);
  }
  if (kind === "dev") return (devSingleton ??= new DevMemoryAdapter());
  return null;
}
