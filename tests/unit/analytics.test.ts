import { beforeEach, describe, expect, it } from "vitest";
import { __setSink, sanitizeProps, setAnalyticsConsent, track } from "@/lib/analytics/events";

describe("sanitizeProps", () => {
  it("descarta chaves fora da allowlist", () => {
    expect(sanitizeProps({ name: "Maria", whatsapp: "x", product: "consignado-clt" })).toEqual({ product: "consignado-clt" });
  });
  it("descarta valores com aparência de dado pessoal", () => {
    expect(sanitizeProps({ cta_id: "(18) 99999-8888", step: "123.456.789-00", route: "a@b.com" })).toEqual({});
  });
});

describe("track", () => {
  const sent: Record<string, unknown>[] = [];
  beforeEach(() => {
    sent.length = 0;
    __setSink((p) => sent.push(p));
  });

  it("nada é enviado sem consentimento", () => {
    setAnalyticsConsent(false);
    expect(track("cta_click", { cta_id: "x" })).toBe(false);
    expect(sent).toHaveLength(0);
  });

  it("generate_lead é deduplicado por protocolo", () => {
    setAnalyticsConsent(true);
    expect(track("generate_lead", { lead_protocol: "CF-AAAA-BBBB" })).toBe(true);
    expect(track("generate_lead", { lead_protocol: "CF-AAAA-BBBB" })).toBe(false);
    expect(track("generate_lead", {})).toBe(false);
    expect(sent).toHaveLength(1);
  });
});
