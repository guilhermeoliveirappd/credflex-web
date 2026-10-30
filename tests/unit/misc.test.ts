import { describe, expect, it } from "vitest";
import { validateResume } from "@/lib/careers/resume";
import { parseConsent } from "@/lib/privacy/consent";
import { legacyRedirects } from "@/content/redirects";
import { publicPaths } from "@/content/routes";
import { activeProducts, products } from "@/content/products";

describe("currículo", () => {
  it("aceita somente PDF real", () => {
    expect(validateResume(new TextEncoder().encode("%PDF-1.7 ...")).ok).toBe(true);
    expect(validateResume(new TextEncoder().encode("MZ executável")).ok).toBe(false);
    expect(validateResume(new Uint8Array(0)).ok).toBe(false);
    expect(validateResume(new Uint8Array(6 * 1024 * 1024)).ok).toBe(false);
  });
});

describe("consentimento", () => {
  it("versão antiga ou inválida pede nova escolha", () => {
    expect(parseConsent(encodeURIComponent(JSON.stringify({ v: 0, analytics: true })))).toBeNull();
    expect(parseConsent("lixo")).toBeNull();
    expect(parseConsent(encodeURIComponent(JSON.stringify({ v: 1, analytics: true, marketing: false, at: "x" })))?.analytics).toBe(true);
  });
});

describe("arquitetura", () => {
  it("sitemap não contém rotas condicionais nem /obrigado", () => {
    expect(publicPaths).not.toContain("/obrigado");
    expect(publicPaths).not.toContain("/bpc-loas");
    expect(publicPaths).not.toContain("/credito-pessoal");
    for (const p of activeProducts) expect(publicPaths).toContain(`/${p.slug}`);
  });
  it("redirecionamentos apontam para rotas existentes", () => {
    const valid = new Set([...publicPaths, "/obrigado"]);
    for (const r of legacyRedirects) expect(valid.has(r.to)).toBe(true);
  });
  it("condicionais permanecem condicionais até validação", () => {
    expect(products["bpc-loas"].status).toBe("conditional");
    expect(products["credito-pessoal"].status).toBe("conditional");
  });
});
