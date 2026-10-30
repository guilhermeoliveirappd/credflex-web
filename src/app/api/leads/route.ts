import { NextResponse, type NextRequest } from "next/server";
import { resolveLeadAdapter } from "@/lib/leads/adapters";
import { processLead, type LeadResponseBody } from "@/lib/leads/service";
import { RateLimiter, hashClientKey } from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limiter = new RateLimiter(5, 10 * 60_000);
const seen = new Map<string, { at: number; body: LeadResponseBody }>();

export async function POST(req: NextRequest) {
  // Somente mesma origem.
  const origin = req.headers.get("origin");
  if (origin && origin !== req.nextUrl.origin) {
    return NextResponse.json({ ok: false, error: "rejected" }, { status: 403 });
  }
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > 16_000) return NextResponse.json({ ok: false, error: "invalid" }, { status: 413 });

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  const result = await processLead(raw, hashClientKey(ip), {
    adapter: resolveLeadAdapter(),
    limiter,
    seen,
    isProduction: process.env.NODE_ENV === "production" && process.env.ALLOW_DEV_ADAPTER !== "true",
  });

  const res = NextResponse.json(result.body, { status: result.status });
  if (result.retryAfter) res.headers.set("Retry-After", String(result.retryAfter));
  return res;
}
