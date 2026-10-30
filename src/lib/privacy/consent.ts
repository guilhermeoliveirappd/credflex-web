/**
 * Preferências de cookies por categoria. Persistidas em cookie first-party
 * (`cf_consent`), 6 meses. Versão muda → usuário é perguntado de novo.
 */
export const CONSENT_COOKIE = "cf_consent";
export const CONSENT_VERSION = 1;

export interface ConsentState {
  v: number;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  /** ISO date */
  at: string;
}

export type ConsentChoice = Pick<ConsentState, "analytics" | "marketing">;

export const CONSENT_EVENT = "cf:consent-change";
export const OPEN_PREFERENCES_EVENT = "cf:open-cookie-preferences";

export function parseConsent(raw: string | undefined | null): ConsentState | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(decodeURIComponent(raw)) as Partial<ConsentState>;
    if (v.v !== CONSENT_VERSION) return null;
    return { v: CONSENT_VERSION, necessary: true, analytics: !!v.analytics, marketing: !!v.marketing, at: String(v.at ?? "") };
  } catch {
    return null;
  }
}

export function readConsent(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`));
  return parseConsent(m?.[1]);
}

export function writeConsent(choice: ConsentChoice): ConsentState {
  const state: ConsentState = { v: CONSENT_VERSION, necessary: true, ...choice, at: new Date().toISOString() };
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(state))}; Max-Age=${180 * 86400}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_EVENT, { detail: state }));
  applyConsentMode(state);
  return state;
}

export function openCookiePreferences() {
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}

type Gtag = (...args: unknown[]) => void;

/** Google Consent Mode v2 — atualiza os sinais após a escolha. */
export function applyConsentMode(state: ConsentChoice) {
  const w = window as unknown as { gtag?: Gtag };
  w.gtag?.("consent", "update", {
    analytics_storage: state.analytics ? "granted" : "denied",
    ad_storage: state.marketing ? "granted" : "denied",
    ad_user_data: state.marketing ? "granted" : "denied",
    ad_personalization: state.marketing ? "granted" : "denied",
  });
}
