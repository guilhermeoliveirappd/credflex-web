import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Logo } from "@/components/brand/Monogram";
import { CookiePreferencesButton } from "@/components/privacy/CookiePreferencesButton";
import { legalNav } from "@/content/navigation";
import { activeProducts } from "@/content/products";
import { site } from "@/content/site";

const link =
  "relative inline-block whitespace-nowrap py-0.5 text-brand-100 transition-colors duration-300 hover:text-white after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-accent-400 after:transition-transform after:duration-300 hover:after:scale-x-100";
const small = "text-brand-300 transition-colors hover:text-white";

/**
 * Rodapé compacto: marca + navegação essencial. Telefone, e-mail e endereço
 * ficam na seção de localização e na página Contato (sem repetição aqui).
 */
export function Footer() {
  const { legal, credits } = site;
  return (
    <footer className="noise bg-brand-950 text-[0.95rem] text-brand-100">
      <div className="container-x pb-6 pt-10 lg:pt-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <Logo tone="light" />
          <nav aria-label="Rodapé" className="grid grid-cols-2 gap-x-12 gap-y-6 sm:gap-x-16">
            <div>
              <h2 className="text-[0.85rem] font-semibold text-white">Institucional</h2>
              <ul className="mt-2 space-y-0.5">
                <li>
                  {/* Modalidades em disclosure acessível (<details>) */}
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center gap-1.5 py-0.5 text-brand-100 transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
                      Modalidades
                      <ChevronDown aria-hidden className="h-4 w-4 transition-transform duration-300 group-open:rotate-180" />
                    </summary>
                    <ul className="mb-1.5 mt-1 space-y-0.5 border-l border-white/15 pl-3 text-[0.9rem]">
                      {activeProducts.map((p) => (
                        <li key={p.slug}>
                          <Link href={`/${p.slug}`} className={link}>
                            {p.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
                <li><Link href="/quem-somos" className={link}>Quem somos</Link></li>
                <li><Link href="/seguranca" className={link}>Segurança</Link></li>
                <li><Link href="/trabalhe-conosco" className={link}>Trabalhe conosco</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="text-[0.85rem] font-semibold text-white">Atendimento</h2>
              <ul className="mt-2 space-y-0.5">
                <li><Link href="/ajuda" className={link}>Ajuda</Link></li>
                <li><Link href="/contato" className={link}>Contato</Link></li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-8 border-t border-white/10 pt-5 text-[0.78rem] leading-relaxed text-brand-300">
          {/* Aviso regulatório: 2 linhas no desktop, justificado, sem hifenização */}
          <p className="footer-legal mx-auto max-w-[1060px]">
            A CredFlex atua como correspondente bancário de instituições financeiras parceiras. A contratação depende de análise e
            aprovação de crédito pela instituição. Taxas, prazos e Custo Efetivo Total (CET) são informados antes da contratação. Não
            solicitamos depósitos antecipados.
          </p>
          <div className="mt-4 flex flex-col items-center gap-x-6 gap-y-2 text-center lg:flex-row lg:justify-between lg:text-left">
            <p className="t-num">
              © {new Date().getFullYear()} CredFlex{legal.cnpj ? ` · CNPJ ${legal.cnpj}` : ""}
            </p>
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1">
              {legalNav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={small}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <CookiePreferencesButton className={small} />
              </li>
            </ul>
            <p>
              Desenvolvido por{" "}
              {credits.url ? (
                <a href={credits.url} target="_blank" rel="noopener" className="font-semibold text-accent-300 hover:text-accent-100">
                  {credits.name}
                </a>
              ) : (
                <span className="font-semibold text-accent-300" data-credit-link="pending">
                  {credits.name}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
