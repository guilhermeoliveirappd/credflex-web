import { expect, test, type Page } from "@playwright/test";

const consent = (page: Page, marketing = false) =>
  page.context().addCookies([
    { name: "cf_consent", value: encodeURIComponent(JSON.stringify({ v: 1, necessary: true, analytics: false, marketing, at: "e2e" })), url: "http://localhost:3100" },
  ]);

test.describe("intro da home", () => {
  test("toca uma vez por sessão e não bloqueia cliques", async ({ page }) => {
    await consent(page);
    await page.goto("/");
    const intro = page.locator(".cf-intro");
    await expect(intro).toHaveCSS("pointer-events", "none");
    await expect(page.locator("html")).toHaveAttribute("data-intro", "done", { timeout: 4000 });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-intro", "skip");
    await expect(intro).toBeHidden();
  });

  test("movimento reduzido: sem intro", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("http://localhost:3100/");
    await expect(page.locator("html")).toHaveAttribute("data-intro", "skip");
    await expect(page.locator(".cf-intro")).toBeHidden();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await ctx.close();
  });
});

test.describe("seletor de perfil (carrossel)", () => {
  test("teclado move a seleção e o CTA leva à modalidade", async ({ page }) => {
    await consent(page);
    await page.goto("/");
    const group = page.getByRole("radiogroup", { name: "Qual dessas opções combina com você?" });
    const first = group.getByRole("radio").first();
    await first.focus();
    await page.keyboard.press("ArrowRight");
    await expect(group.getByRole("radio", { name: /aposentado/ })).toHaveAttribute("aria-checked", "true");
    await expect(group.getByRole("radio", { name: /aposentado/ })).toBeFocused();
    await page.keyboard.press("End");
    await expect(group.getByRole("radio", { name: /Não sei/ })).toHaveAttribute("aria-checked", "true");
    await page.keyboard.press("Home");
    await expect(first).toHaveAttribute("aria-checked", "true");
    await page.locator("#perfil").getByRole("link", { name: /Iniciar pré-análise CLT/ }).click();
    await expect(page).toHaveURL(/modalidade=consignado-clt/);
  });

  test("setas navegam e desabilitam nas extremidades", async ({ page, isMobile }) => {
    await consent(page);
    await page.goto("/");
    const prev = page.getByRole("button", { name: "Opções anteriores" });
    const next = page.getByRole("button", { name: "Próximas opções" });
    await expect(prev).toBeDisabled();
    const track = page.locator("#perfil-track");
    const before = await track.evaluate((el) => el.scrollLeft);
    await next.click();
    await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(before);
    await expect(prev).toBeEnabled();
    // Avança aguardando cada rolagem suave terminar, até a última posição
    for (let i = 0; i < (isMobile ? 10 : 6) && (await next.isEnabled()); i++) {
      const at = await track.evaluate((el) => el.scrollLeft);
      await next.click();
      await expect.poll(() => track.evaluate((el) => el.scrollLeft)).not.toBe(at);
      await page.waitForTimeout(450);
    }
    await expect(next).toBeDisabled();
    await expect(page.getByRole("radio", { name: /Não sei/ })).toBeInViewport();
  });
});

test.describe("mapa", () => {
  test("não carrega o Google sem ação; carrega após clique com o endereço correto", async ({ page }) => {
    await consent(page);
    await page.route(/https:\/\/(maps|www)\.google\.com(\.br)?\//, (r) => r.fulfill({ status: 200, contentType: "text/html", body: "<html><body>mapa</body></html>" }));
    await page.goto("/");
    const section = page.locator("section[aria-labelledby='local-title']");
    await section.scrollIntoViewIfNeeded();
    await expect(section.locator("iframe")).toHaveCount(0);
    const open = section.getByRole("link", { name: /Abrir no Google Maps/ });
    await expect(open).toHaveAttribute("href", /Rua\+Fernando\+Costa%2C\+495.*Osvaldo\+Cruz.*17700-000/);
    await section.getByRole("button", { name: "Mostrar mapa" }).click();
    const iframe = section.locator("iframe");
    await expect(iframe).toHaveAttribute("src", /Rua%20Fernando%20Costa%2C%20495%2C%20Centro%2C%20Osvaldo%20Cruz%20-%20SP%2C%2017700-000/);
    await expect(iframe).toHaveAttribute("src", /^https:\/\/maps\.google\.com\/maps\?/);
  });

  test("com consentimento de publicidade carrega automaticamente", async ({ page }) => {
    await consent(page, true);
    await page.route(/https:\/\/(maps|www)\.google\.com(\.br)?\//, (r) => r.fulfill({ status: 200, contentType: "text/html", body: "ok" }));
    await page.goto("/");
    await expect(page.locator("section[aria-labelledby='local-title'] iframe")).toHaveCount(1);
  });
});

test("hero com um único CTA principal", async ({ page }) => {
  await consent(page);
  await page.goto("/");
  const hero = page.locator("section[aria-labelledby='hero-title']");
  await expect(hero.getByRole("heading", { level: 1 })).toHaveText(/Crédito com gente de verdade\./);
  await expect(hero.getByRole("link")).toHaveCount(1);
  await hero.getByRole("link", { name: /Consultar meu crédito/ }).click();
  await expect(page).toHaveURL(/\/simulacao$/);
});

test("rodapé: modalidades em acordeão, e-mail em uma linha, sem endereço", async ({ page }) => {
  await consent(page);
  await page.goto("/");
  const footer = page.locator("footer");
  const link = footer.getByRole("link", { name: "Consignado CLT" });
  await expect(link).toBeHidden();
  await footer.getByText("Modalidades", { exact: true }).click();
  await expect(link).toBeVisible();
  const email = footer.getByRole("link", { name: "atendimento@credflexfinanceira.com.br" });
  const box = await email.boundingBox();
  expect(box!.height).toBeLessThan(44); // 1 linha ≈ 32px (24 + padding); 2 linhas ≈ 56px
  await expect(footer).not.toContainText("Rua Fernando Costa");
  await expect(footer).toContainText("CNPJ 23.014.866/0001-57");
  await expect(footer).toContainText("Desenvolvido por Max Performance Growth");
});

test("textos sem hifenização automática", async ({ page }) => {
  await consent(page);
  await page.goto("/quem-somos");
  const hyph = await page.evaluate(() => [...document.querySelectorAll("p, dd, [data-support]")].filter((e) => getComputedStyle(e).hyphens === "auto").length);
  expect(hyph).toBe(0);
});

test("cards de modalidade compactos levam à página interna", async ({ page }) => {
  await consent(page);
  await page.goto("/");
  const cards = page.locator("#modalidades ul > li");
  await expect(cards).toHaveCount(6);
  const h = await cards.first().evaluate((el) => el.getBoundingClientRect().height);
  expect(h).toBeLessThan(300);
  await cards.nth(1).getByRole("link").click();
  await expect(page).toHaveURL(/\/consignado-inss$/);
});
