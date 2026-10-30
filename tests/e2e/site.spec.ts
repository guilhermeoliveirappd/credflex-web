import { expect, test, type Page } from "@playwright/test";

const declineCookies = async (page: Page) => {
  await page.context().addCookies([
    { name: "cf_consent", value: encodeURIComponent(JSON.stringify({ v: 1, necessary: true, analytics: true, marketing: false, at: "e2e" })), url: "http://localhost:3100" },
  ]);
};

const pages = [
  "/", "/consignado-clt", "/consignado-inss", "/portabilidade-inss", "/servidor-publico", "/antecipacao-fgts",
  "/emprestimo-conta-de-luz", "/simulacao", "/obrigado", "/quem-somos", "/seguranca", "/contato", "/ajuda",
  "/trabalhe-conosco", "/politica-de-privacidade", "/politica-de-cookies", "/termos-de-uso", "/bpc-loas", "/credito-pessoal",
];

test.describe("páginas", () => {
  for (const path of pages) {
    test(`${path}: um H1, sem erros e sem overflow`, async ({ page }) => {
      await declineCookies(page);
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
    });
  }
});

test("noindex em /obrigado e rotas condicionais; canonical nas públicas", async ({ request, page }) => {
  for (const p of ["/obrigado", "/bpc-loas", "/credito-pessoal"]) {
    const r = await request.get(p);
    expect(r.headers()["x-robots-tag"]).toContain("noindex");
    await page.goto(p);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  }
  await page.goto("/consignado-clt");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/consignado-clt$/);
});

test("sitemap só com páginas públicas", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml).toContain("/consignado-inss");
  expect(xml).not.toContain("/obrigado");
  expect(xml).not.toContain("/bpc-loas");
  expect(xml).not.toContain("/credito-pessoal");
});

test("redirecionamentos 301", async ({ request }) => {
  const map: Record<string, string> = {
    "/consignado-clt-forms-antigo": "/consignado-clt",
    "/consignado-clt-forms": "/consignado-clt",
    "/auto-consignado-clt": "/consignado-clt",
    "/saque-fgts": "/antecipacao-fgts",
    "/conta-de-luz": "/emprestimo-conta-de-luz",
    "/consignado-sp": "/servidor-publico",
    "/termos-de-servicos": "/termos-de-uso",
    "/tk-page-forms": "/obrigado",
    "/consignado": "/consignado-inss",
  };
  for (const [from, to] of Object.entries(map)) {
    const r = await request.get(from, { maxRedirects: 0 });
    expect(r.status(), from).toBe(301);
    expect(r.headers().location).toBe(to);
  }
});

test("menus públicos não expõem rotas condicionais", async ({ page }) => {
  await declineCookies(page);
  await page.goto("/");
  await expect(page.locator('a[href="/bpc-loas"], a[href="/credito-pessoal"]')).toHaveCount(0);
});

test("cabeçalhos de segurança", async ({ request }) => {
  const h = (await request.get("/")).headers();
  expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["x-powered-by"]).toBeUndefined();
});

test.describe("consentimento", () => {
  test("banner com Aceitar, Recusar e Configurar; nenhum GTM antes da escolha", async ({ page }) => {
    await page.goto("/");
    const banner = page.getByRole("region", { name: "Aviso de cookies" });
    await expect(banner.getByRole("button", { name: "Aceitar" })).toBeVisible();
    await expect(banner.getByRole("button", { name: "Recusar" })).toBeVisible();
    await expect(page.locator("#gtm-script")).toHaveCount(0);
    await banner.getByRole("button", { name: "Configurar preferências" }).click();
    const dialog = page.getByRole("dialog", { name: "Preferências de cookies" });
    await dialog.getByRole("switch", { name: "Medição" }).click();
    await dialog.getByRole("button", { name: "Salvar escolhas" }).click();
    const cookie = (await page.context().cookies()).find((c) => c.name === "cf_consent");
    const v = JSON.parse(decodeURIComponent(cookie!.value));
    expect(v).toMatchObject({ analytics: true, marketing: false });
    await expect(banner).toHaveCount(0);
  });
});

test.describe("pré-análise", () => {
  test("seletor da home leva à modalidade correta", async ({ page }) => {
    await declineCookies(page);
    await page.goto("/");
    await page.getByRole("radio", { name: /Sou servidor/ }).click();
    await page.locator("#perfil").getByRole("link", { name: "Verificar meu órgão" }).first().click();
    await expect(page).toHaveURL(/\/simulacao\?modalidade=servidor-publico/);
    await expect(page.getByText("Em qual esfera você trabalha?")).toBeVisible();
  });

  test("fluxo completo CLT: validação, voltar preserva dados, envio, obrigado", async ({ page }) => {
    await declineCookies(page);
    await page.goto("/simulacao");
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByText("Escolha a opção mais parecida")).toBeVisible();
    await page.getByText("Trabalho com carteira assinada").click();
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.getByText("Carteira assinada em empresa privada").click();
    await page.getByText("De 1 a 3 anos").click();
    await page.getByText("De R$ 2.001 a R$ 4.000").click();
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.getByLabel("Valor aproximado").fill("8000");
    await expect(page.getByLabel("Valor aproximado")).toHaveValue("8.000");
    await page.getByText("13 a 24 meses").click();
    await page.getByRole("button", { name: "Continuar" }).click();
    // Voltar e conferir que o valor foi preservado
    await page.getByRole("button", { name: "Voltar" }).click();
    await expect(page.getByLabel("Valor aproximado")).toHaveValue("8.000");
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByText("Informe como podemos chamar você.")).toBeVisible();
    await page.getByLabel("Seu nome").fill("Teste Automatizado");
    await page.getByLabel("WhatsApp com DDD").fill("18999990000");
    await expect(page.getByLabel("WhatsApp com DDD")).toHaveValue("(18) 99999-0000");
    await page.getByText("Autorizo a CredFlex").click();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByText("Confira antes de enviar")).toBeVisible();
    await expect(page.getByText("R$ 8.000")).toBeVisible();
    await page.waitForTimeout(3000); // proteção anti-bot exige tempo mínimo
    await page.getByRole("button", { name: "Enviar para a equipe" }).click();
    await expect(page).toHaveURL(/\/obrigado$/);
    await expect(page.getByText(/^CF-[A-Z0-9]{4}-[A-Z0-9]{4}$/)).toBeVisible();
    const dl = await page.evaluate(() => JSON.stringify((window as unknown as { dataLayer: unknown[] }).dataLayer));
    expect(dl).not.toContain("Teste Automatizado");
    expect(dl).not.toContain("99999");
  });

  test("INSS + BPC/LOAS vai para atendimento humano, não consignado", async ({ page }) => {
    await declineCookies(page);
    await page.goto("/simulacao?modalidade=consignado-inss");
    await page.getByText("BPC/LOAS (benefício assistencial)").click();
    await page.getByText("Um crédito novo").click();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByText("BPC/LOAS tem regras diferentes")).toBeVisible();
    await expect(page.getByText("Valor e prazo")).toHaveCount(0);
  });

  test("INSS + portabilidade oferece troca de modalidade", async ({ page }) => {
    await declineCookies(page);
    await page.goto("/simulacao?modalidade=consignado-inss");
    await page.getByText("Aposentadoria do INSS").click();
    await page.getByText("Transferir um consignado que já tenho").click();
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.getByRole("button", { name: "Seguir com Portabilidade" }).click();
    await expect(page.getByText("Qual contrato você quer transferir?")).toBeVisible();
  });

  test("acesso direto a /obrigado não mostra protocolo nem gera conversão", async ({ page }) => {
    await declineCookies(page);
    await page.goto("/obrigado");
    await expect(page.getByText("Não encontramos uma solicitação recente")).toBeVisible();
    const dl = await page.evaluate(() => JSON.stringify((window as unknown as { dataLayer?: unknown[] }).dataLayer ?? []));
    expect(dl).not.toContain("generate_lead");
  });
});

test("menu móvel abre, navega e fecha", async ({ page, isMobile }) => {
  test.skip(!isMobile, "somente mobile");
  await declineCookies(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir menu" }).click();
  const nav = page.getByRole("dialog", { name: "Menu" });
  await expect(nav).toBeVisible();
  await nav.getByRole("link", { name: /Consignado INSS/ }).click();
  await expect(page).toHaveURL(/\/consignado-inss$/);
  await expect(nav).toHaveCount(0);
});

test("dropdown de modalidades no desktop (teclado)", async ({ page, isMobile }) => {
  test.skip(!!isMobile, "somente desktop");
  await declineCookies(page);
  await page.goto("/");
  const btn = page.getByRole("button", { name: "Modalidades" });
  await btn.click();
  await expect(btn).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#menu-modalidades").getByRole("link", { name: /Portabilidade INSS/ })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(btn).toHaveAttribute("aria-expanded", "false");
});
