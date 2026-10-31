// Uso: node scripts/screenshots.mjs [baseUrl] [outDir] [paths...]
import { chromium } from "playwright";
import fs from "node:fs";

const base = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] ?? "screenshots";
const paths = process.argv.slice(4).length ? process.argv.slice(4) : ["/"];
const widths = (process.env.WIDTHS ?? "390,1440").split(",").map(Number);
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const errors = [];
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 }, deviceScaleFactor: 1 });
  // Pré-define consentimento recusado para o banner não cobrir as capturas (exceto se CONSENT=show).
  if (process.env.CONSENT !== "show") {
    await ctx.addCookies([{ name: "cf_consent", value: encodeURIComponent(JSON.stringify({ v: 1, necessary: true, analytics: false, marketing: false, at: "2026-01-01" })), url: base }]);
  }
  // Pula a intro da home nas capturas (ela tem script próprio: scripts/_intro.mjs)
  await ctx.addInitScript(() => { try { sessionStorage.setItem("cf_intro", "1"); } catch {} });
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && errors.push(`[${w}] ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`[${w}] ${e.message}`));
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    // Percorre a página para disparar as animações de scroll
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += Math.round(innerHeight * 0.6)) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 220)); }
      scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) errors.push(`[${w}] ${p} overflow horizontal de ${overflow}px`);
    const name = `${p === "/" ? "home" : p.slice(1).replace(/\//g, "_")}-${w}.png`;
    await page.screenshot({ path: `${out}/${name}`, fullPage: process.env.FULL !== "0" });
  }
  await ctx.close();
}
await browser.close();
console.log(errors.length ? errors.join("\n") : "sem erros de console/overflow");
