import { NextResponse, type NextRequest } from "next/server";
import { careerFieldsSchema, MAX_RESUME_BYTES, validateResume } from "@/lib/careers/resume";
import { RateLimiter, hashClientKey } from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limiter = new RateLimiter(3, 60 * 60_000);

/**
 * Recebe candidatura. Nenhum armazenamento está configurado nesta fase:
 * - desenvolvimento: valida e DESCARTA o arquivo, sem persistir;
 * - produção sem CAREERS_STORAGE configurado: 503 (não simula sucesso).
 * Ver docs/integrations.md › Trabalhe conosco.
 */
export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (origin && origin !== req.nextUrl.origin) return NextResponse.json({ ok: false }, { status: 403 });
  if (Number(req.headers.get("content-length") ?? 0) > MAX_RESUME_BYTES + 64_000) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!limiter.check(hashClientKey(ip)).ok) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const fields = careerFieldsSchema.safeParse(Object.fromEntries([...fd.entries()].filter(([, v]) => typeof v === "string")));
  if (!fields.success) {
    return NextResponse.json({ ok: false, error: "invalid", fieldErrors: Object.fromEntries(fields.error.issues.map((i) => [i.path.join("."), i.message])) }, { status: 422 });
  }
  if (fields.data.website) return NextResponse.json({ ok: false, error: "rejected" }, { status: 400 });
  const file = fd.get("resume");
  if (!(file instanceof File)) return NextResponse.json({ ok: false, error: "invalid", fieldErrors: { resume: "Anexe o currículo em PDF." } }, { status: 422 });
  const check = validateResume(new Uint8Array(await file.arrayBuffer()));
  if (!check.ok) return NextResponse.json({ ok: false, error: "invalid", fieldErrors: { resume: check.reason } }, { status: 422 });

  const isProd = process.env.NODE_ENV === "production" && process.env.ALLOW_DEV_ADAPTER !== "true";
  if (!process.env.CAREERS_STORAGE) {
    if (isProd) return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
    console.info(`[carreiras:dev] candidatura validada e descartada (area=${fields.data.area}, ${file.size} bytes)`);
    return NextResponse.json({ ok: true, devMode: true }, { status: 201 });
  }
  return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
}
