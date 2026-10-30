import { z } from "zod";
import { products, type ProductSlug } from "@/content/products";
import { getFlow, termOptions } from "./flows";

/** Dígitos de um telefone brasileiro (sem +55). */
export function phoneDigits(input: string): string {
  let d = input.replace(/\D/g, "");
  if (d.length === 13 && d.startsWith("55")) d = d.slice(2);
  return d;
}

/** Celular com DDD válido (11–99) e nono dígito. */
export function isValidMobile(input: string): boolean {
  const d = phoneDigits(input);
  if (d.length !== 11) return false;
  const ddd = Number(d.slice(0, 2));
  if (ddd < 11 || ddd > 99 || d[2] !== "9") return false;
  return !/^(\d)\1+$/.test(d.slice(2));
}

export function maskPhone(input: string): string {
  const d = phoneDigits(input).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** "R$ 12.500" ⇄ 12500 */
export function parseAmount(input: string): number | null {
  const d = input.replace(/\D/g, "");
  return d ? Number(d) : null;
}
export function maskAmount(input: string): string {
  const n = parseAmount(input.slice(0, 14));
  return n === null ? "" : n.toLocaleString("pt-BR");
}

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Informe como podemos chamar você.")
  .max(80, "Use no máximo 80 caracteres.")
  .regex(/^[\p{L}][\p{L}'’ .-]*$/u, "Use apenas letras no nome.");

export const whatsappSchema = z
  .string()
  .trim()
  .refine(isValidMobile, "Informe um celular com DDD, por exemplo (18) 99999-9999.");

export const contactSchema = z.object({
  name: nameSchema,
  whatsapp: whatsappSchema,
  bestTime: z.enum(["manha", "tarde", "indiferente"]).default("indiferente"),
  consentContact: z.literal(true, { error: "Precisamos da sua autorização para entrar em contato." }),
  consentMarketing: z.boolean().default(false),
});

const termValues = termOptions.map((o) => o.value) as [string, ...string[]];

export const amountTermSchema = z.object({
  amount: z.number().int().min(1).max(5_000_000).nullable().default(null),
  amountUnknown: z.boolean().default(false),
  term: z.enum(termValues).nullable().default(null),
});

const utmSchema = z
  .object({
    utm_source: z.string().max(100).optional(),
    utm_medium: z.string().max(100).optional(),
    utm_campaign: z.string().max(150).optional(),
    utm_content: z.string().max(150).optional(),
    utm_term: z.string().max(150).optional(),
  })
  .strict()
  .optional();

const productEnum = z.enum(Object.keys(products) as [ProductSlug, ...ProductSlug[]]);

/** Payload aceito pelo POST /api/leads. Validado também no servidor. */
export const leadPayloadSchema = z
  .object({
    idempotencyKey: z.string().uuid(),
    product: productEnum,
    /** Modalidade inicialmente escolhida (antes de eventuais desvios). */
    originProduct: productEnum,
    answers: z.record(z.string().max(40), z.string().max(80)),
    amountTerm: amountTermSchema.optional(),
    contact: contactSchema,
    sourcePath: z.string().max(200).regex(/^\/[\w\-/]*$/).default("/simulacao"),
    utm: utmSchema,
    /** Honeypot: humanos não preenchem. */
    website: z.string().max(0).optional().default(""),
    /** ms desde o início do formulário — submissões instantâneas são bots. */
    elapsedMs: z.number().int().nonnegative(),
  })
  .superRefine((val, ctx) => {
    const flow = getFlow(val.originProduct === val.product ? val.product : val.originProduct);
    const target = getFlow(val.product);
    // Respostas devem pertencer às perguntas do fluxo de origem ou de destino.
    const known = new Map(
      [...(flow?.questions ?? []), ...(target?.questions ?? [])].map((q) => [q.id, q] as const),
    );
    for (const [id, value] of Object.entries(val.answers)) {
      const q = known.get(id);
      if (!q) {
        ctx.addIssue({ code: "custom", path: ["answers", id], message: "Pergunta desconhecida." });
        continue;
      }
      if (q.kind === "choice" && !q.options.some((o) => o.value === value)) {
        ctx.addIssue({ code: "custom", path: ["answers", id], message: "Opção inválida." });
      }
      if (q.kind === "text" && value.trim().length > q.maxLength) {
        ctx.addIssue({ code: "custom", path: ["answers", id], message: "Texto muito longo." });
      }
    }
    if (products[val.product].status !== "active" && val.product !== "bpc-loas") {
      ctx.addIssue({ code: "custom", path: ["product"], message: "Modalidade indisponível." });
    }
  });

export type LeadPayload = z.infer<typeof leadPayloadSchema>;
export type ContactInput = z.input<typeof contactSchema>;
