// Uso: node scripts/intro-frames.mjs <pasta> [largura] [altura] — captura quadros da intro da home (servidor em :3000)
import { chromium } from "playwright";
const out = process.argv[2], w = Number(process.argv[3] ?? 1440), h = Number(process.argv[4] ?? 900);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: w, height: h } });
await ctx.addCookies([{ name: "cf_consent", value: encodeURIComponent(JSON.stringify({ v: 1, necessary: true, analytics: false, marketing: false, at: "x" })), url: "http://localhost:3000" }]);
const p = await ctx.newPage();
const errs = []; p.on("pageerror", (e) => errs.push(e.message));
await p.goto("http://localhost:3000/", { waitUntil: "commit" });
await p.waitForSelector("#hero-title", { state: "attached" });
const t0 = Date.now();
for (const t of [150, 450, 800, 1050, 1250, 1500, 1900, 2600]) {
  const wait = t - (Date.now() - t0); if (wait > 0) await p.waitForTimeout(wait);
  await p.screenshot({ path: `${out}/t${t}-${w}.png` });
}
console.log("intro attr:", await p.evaluate(() => document.documentElement.dataset.intro), "errors:", errs);
// Segunda visita na mesma sessão: intro deve ser pulada
await p.goto("http://localhost:3000/", { waitUntil: "load" });
console.log("2nd visit intro attr:", await p.evaluate(() => document.documentElement.dataset.intro));
await b.close();
