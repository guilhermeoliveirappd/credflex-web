const KEY = "cf_utm";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>;

/**
 * Persiste UTMs da sessão (sessionStorage, nunca cookie de terceiros) somente
 * com consentimento de analytics. Decisão a validar com o jurídico:
 * docs/integrations.md › Atribuição.
 */
export function captureUtm(search: string, analyticsConsent: boolean) {
  if (!analyticsConsent) return;
  const params = new URLSearchParams(search);
  const utm: Utm = {};
  for (const k of UTM_KEYS) {
    const v = params.get(k);
    if (v) utm[k] = v.slice(0, 150);
  }
  if (Object.keys(utm).length === 0) return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(utm));
  } catch {}
}

export function readUtm(): Utm | undefined {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Utm) : undefined;
  } catch {
    return undefined;
  }
}
