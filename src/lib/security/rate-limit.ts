import { createHash } from "node:crypto";

/**
 * Janela deslizante em memória. Suficiente para uma instância única e para
 * desenvolvimento; em produção serverless use um store compartilhado
 * (ex.: Upstash Redis) — ver docs/integrations.md.
 */
export class RateLimiter {
  private hits = new Map<string, number[]>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  check(key: string, now = Date.now()): { ok: boolean; retryAfterS: number } {
    const recent = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    if (recent.length >= this.limit) {
      this.hits.set(key, recent);
      return { ok: false, retryAfterS: Math.ceil((this.windowMs - (now - recent[0])) / 1000) };
    }
    recent.push(now);
    this.hits.set(key, recent);
    if (this.hits.size > 10_000) this.sweep(now);
    return { ok: true, retryAfterS: 0 };
  }

  private sweep(now: number) {
    for (const [k, v] of this.hits) if (v.every((t) => now - t >= this.windowMs)) this.hits.delete(k);
  }
}

/** IP nunca é armazenado em claro. */
export function hashClientKey(ip: string, salt = process.env.RATE_LIMIT_SALT ?? "dev-salt"): string {
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}
