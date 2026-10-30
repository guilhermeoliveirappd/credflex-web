import { z } from "zod";
import { nameSchema, whatsappSchema } from "@/lib/prequal/schema";

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export const careerFieldsSchema = z.object({
  name: nameSchema,
  whatsapp: whatsappSchema,
  area: z.enum(["atendimento", "comercial", "administrativo", "outra"]),
  consent: z.literal("true", { error: "É preciso autorizar o uso do currículo para o processo seletivo." }),
  website: z.string().max(0).optional().default(""),
});

/** Aceita somente PDF real (assinatura %PDF-), até 5 MB. Não confia na extensão nem no MIME do cliente. */
export function validateResume(bytes: Uint8Array): { ok: true } | { ok: false; reason: string } {
  if (bytes.byteLength === 0) return { ok: false, reason: "Arquivo vazio." };
  if (bytes.byteLength > MAX_RESUME_BYTES) return { ok: false, reason: "O arquivo deve ter até 5 MB." };
  const sig = String.fromCharCode(...bytes.slice(0, 5));
  if (sig !== "%PDF-") return { ok: false, reason: "Envie o currículo em PDF." };
  return { ok: true };
}
