import { products, type ProductSlug } from "@/content/products";
import { site } from "@/content/site";

/** Número oficial (somente dígitos, com DDI) ou null se não configurado. */
export function officialWhatsapp(value: string | null = site.channels.whatsapp): string | null {
  const d = (value ?? "").replace(/\D/g, "");
  return d.length >= 12 && d.length <= 13 ? d : null;
}

/**
 * Mensagem para o atendente: contexto + protocolo. Sem nome, telefone, CPF
 * ou respostas financeiras — o atendente consulta o CRM pelo protocolo.
 */
export function buildWhatsappMessage(opts: { product?: ProductSlug; protocol?: string }): string {
  const parts = ["Olá, CredFlex!"];
  if (opts.protocol) parts.push(`Fiz uma pré-análise no site. Protocolo: ${opts.protocol}.`);
  if (opts.product) parts.push(`Modalidade: ${products[opts.product].name}.`);
  if (!opts.protocol) parts.push("Gostaria de atendimento.");
  return parts.join(" ");
}

export function buildWhatsappUrl(opts: { product?: ProductSlug; protocol?: string }, number = officialWhatsapp()): string | null {
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(buildWhatsappMessage(opts))}`;
}
