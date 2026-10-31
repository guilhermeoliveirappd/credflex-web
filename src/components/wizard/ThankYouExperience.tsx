"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { isProductSlug, products, type ProductSlug } from "@/content/products";
import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";
import { RECEIPT_KEY } from "@/lib/prequal/storage-keys";

interface Receipt {
  protocol: string;
  product: ProductSlug;
  route: "prequal" | "human-review";
  whatsappUrl: string | null;
  devMode: boolean;
  at: number;
}

/**
 * Lê o comprovante salvo pelo wizard. Acesso direto (sem comprovante) mostra
 * conteúdo genérico e NÃO dispara nenhuma conversão.
 */
export function ThankYouExperience() {
  const [receipt, setReceipt] = useState<Receipt | null | undefined>(undefined);

  useEffect(() => {
    try {
      const r = JSON.parse(sessionStorage.getItem(RECEIPT_KEY) ?? "null") as Receipt | null;
      setReceipt(r && isProductSlug(r.product) && Date.now() - r.at < 6 * 3600_000 ? r : null);
    } catch {
      setReceipt(null);
    }
  }, []);

  if (receipt === undefined) return <div className="min-h-[50vh]" aria-busy="true" />;

  if (!receipt) {
    return (
      <div className="max-w-2xl">
        <h1 className="t-h1 text-brand-950">Obrigado pelo interesse.</h1>
        <p className="t-lead mt-6 text-ink-2">
          Não encontramos uma solicitação recente neste navegador. Se você já enviou, a equipe vai entrar em contato pelo
          WhatsApp informado.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/simulacao" className="btn btn-primary">
            Iniciar uma pré-análise
          </Link>
          <Link href="/" className="btn btn-ghost text-brand-900">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  const p = products[receipt.product];
  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <p className="flex items-center gap-2 font-bold text-ok">
          <CheckCircle2 aria-hidden className="h-5 w-5" /> Solicitação recebida
        </p>
        <h1 className="t-h1 mt-5 text-brand-950">Recebemos o seu pedido. Agora é com a gente.</h1>
        <p className="t-lead mt-6 max-w-[44ch] text-ink-2">
          {receipt.route === "human-review"
            ? "O seu caso precisa de orientação individual. Uma pessoa da equipe vai entrar em contato pelo WhatsApp informado para explicar com calma o que é possível."
            : `Uma pessoa da equipe vai analisar as suas respostas sobre ${p.name} e entrar em contato pelo WhatsApp informado.`}
        </p>

        {receipt.devMode && (
          <p className="review-mark mt-6 !whitespace-normal !text-[0.75rem] !normal-case !tracking-normal">
            Ambiente de desenvolvimento: lead registrado apenas no adaptador local, não em um CRM.
          </p>
        )}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <WhatsAppCTA href={receipt.whatsappUrl} product={receipt.product} protocol={receipt.protocol} location="thank_you" variant="primary" />
          <Link href={`/${p.status === "active" ? p.slug : ""}`} className="btn btn-ghost text-brand-900">
            {p.status === "active" ? `Ler mais sobre ${p.shortName}` : "Voltar ao início"}
          </Link>
        </div>
      </div>

      <aside className="lg:col-span-5">
        <div className="rounded-[var(--radius-md)] bg-brand-900 p-7 text-white">
          <p className="t-eyebrow text-accent-300">Seu protocolo</p>
          <p className="t-num mt-3 font-[family-name:var(--font-display)] text-[2.2rem] font-semibold tracking-[0.02em]">{receipt.protocol}</p>
          <p className="t-small mt-2 text-brand-300">Informe este código se falar com a equipe por outro canal.</p>
          <ol className="mt-8 space-y-5 border-t border-white/10 pt-6">
            <li className="flex gap-3">
              <Clock aria-hidden className="mt-0.5 h-5 w-5 flex-none text-accent-400" />
              <span className="text-brand-100">A equipe entra em contato pelo WhatsApp informado, no horário que você preferiu.</span>
            </li>
            <li className="flex gap-3">
              <ShieldCheck aria-hidden className="mt-0.5 h-5 w-5 flex-none text-accent-400" />
              <span className="text-brand-100">
                Nunca pedimos depósito antecipado. Na dúvida, confira os{" "}
                <Link href="/seguranca" className="font-semibold text-accent-300 underline">
                  canais oficiais
                </Link>
                .
              </span>
            </li>
          </ol>
        </div>
      </aside>
    </div>
  );
}
