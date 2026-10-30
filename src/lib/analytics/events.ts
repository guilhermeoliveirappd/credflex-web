/**
 * Camada de instrumentação. Contrato de eventos em docs/integrations.md.
 *
 * Garantias:
 *  - nada é enviado sem consentimento de analytics;
 *  - somente chaves da allowlist são aceitas;
 *  - valores com aparência de dado pessoal (telefone, CPF, e-mail) são descartados;
 *  - `generate_lead` só é emitido uma vez por protocolo.
 */
export type AnalyticsEvent =
  | "cta_click"
  | "product_select"
  | "sim_start"
  | "sim_step"
  | "sim_ineligible"
  | "sim_route_change"
  | "sim_complete"
  | "sim_error"
  | "form_start"
  | "generate_lead"
  | "whatsapp_click";

const ALLOWED_KEYS = new Set([
  "page_path",
  "product",
  "origin_product",
  "step",
  "step_index",
  "cta_id",
  "cta_location",
  "route",
  "lead_protocol",
  "error_kind",
  "utm_source",
  "utm_medium",
  "utm_campaign",
]);

const PII_PATTERNS = [
  /\d{3}\.?\d{3}\.?\d{3}-?\d{2}/, // CPF
  /\(?\d{2}\)?\s?9?\d{4}-?\d{4}/, // telefone
  /[^\s@]+@[^\s@]+\.[^\s@]+/, // e-mail
];

export type EventProps = Record<string, string | number | boolean | undefined>;

export function sanitizeProps(props: EventProps): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || !ALLOWED_KEYS.has(k)) continue;
    if (typeof v === "string") {
      // Protocolos CF-XXXX-XXXX são permitidos; o resto passa pelo filtro.
      if (k !== "lead_protocol" && PII_PATTERNS.some((re) => re.test(v))) continue;
      out[k] = v.slice(0, 100);
    } else out[k] = v;
  }
  return out;
}

type Sink = (payload: Record<string, unknown>) => void;

let consentGranted = false;
const firedLeads = new Set<string>();
let sink: Sink = (payload) => {
  const w = window as unknown as { dataLayer?: unknown[] };
  (w.dataLayer ??= []).push(payload);
};

export function setAnalyticsConsent(granted: boolean) {
  consentGranted = granted;
}

/** Apenas para testes. */
export function __setSink(s: Sink) {
  sink = s;
}

export function track(event: AnalyticsEvent, props: EventProps = {}): boolean {
  if (event === "generate_lead") {
    const id = String(props.lead_protocol ?? "");
    if (!id || firedLeads.has(id)) return false;
    firedLeads.add(id);
    try {
      const key = "cf_leads_tracked";
      const prev = JSON.parse(sessionStorage.getItem(key) ?? "[]") as string[];
      if (prev.includes(id)) return false;
      sessionStorage.setItem(key, JSON.stringify([...prev, id].slice(-20)));
    } catch {
      /* sessionStorage indisponível: o Set em memória já protege a sessão */
    }
  }
  if (!consentGranted) return false;
  const base: EventProps = typeof location !== "undefined" ? { page_path: location.pathname } : {};
  sink({ event, ...sanitizeProps({ ...base, ...props }) });
  if (process.env.NODE_ENV !== "production") console.debug("[analytics]", event, sanitizeProps(props));
  return true;
}
