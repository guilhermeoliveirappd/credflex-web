import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Logo } from "@/components/brand/Monogram";
import { CookiePreferencesButton } from "@/components/privacy/CookiePreferencesButton";
import { legalNav } from "@/content/navigation";
import { activeProducts } from "@/content/products";
import { formatPhoneDisplay, site } from "@/content/site";

const link =
  "relative inline-block whitespace-nowrap py-1 text-brand-100 transition-colors duration-300 hover:text-white after:absolute after:inset-x-0 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent-400 after:transition-transform after:duration-300 hover:after:scale-x-100";
const small = "text-brand-300 transition-colors hover:text-white";

export function Footer() {
  const { channels, legal, credits } = site;
  return (
    <footer className="noise bg-brand-950 text-[0.95rem] text-brand-100">
      <div className="container-x pb-8 pt-14 lg:pt-16">
        <div className="grid gap-10 sm:grid-cols-[1fr_auto_auto] sm:gap-x-14 lg:gap-x-24">
          <div>
            <Logo tone="light" />
            <p className="mt-4 text-brand-300">Correspondente bancário em Osvaldo Cruz/SP.</p>
          </div>

          <nav aria-label="Institucional">
            <h2 className="font-semibold text-white">Institucional</h2>
            <ul className="mt-3 space-y-1">
              {/* Modalidades em disclosure acessível (<details>), compacto por padrão */}
              <li>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center gap-1.5 py-1 text-brand-100 transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
                    Modalidades
                    <ChevronDown aria-hidden className="h-4 w-4 transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <ul className="mb-2 mt-1 space-y-0.5 border-l border-white/15 pl-3 text-[0.9rem]">
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
          </nav>

          <nav aria-label="Ajuda e contato">
            <h2 className="font-semibold text-white">Ajuda e contato</h2>
            <ul className="mt-3 space-y-1">
              <li><Link href="/ajuda" className={link}>Ajuda</Link></li>
              <li><Link href="/contato" className={link}>Contato</Link></li>
              {channels.whatsapp && (
                <li>
                  <a href={`https://wa.me/${channels.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className={`${link} t-num`}>
                    WhatsApp {formatPhoneDisplay(channels.whatsapp)}
                  </a>
                </li>
              )}
              {channels.email && (
                <li>
                  <a href={`mailto:${channels.email}`} className={`${link} text-[0.88rem] sm:text-[0.95rem]`}>
                    {channels.email}
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </div>

        {/* Área legal: discreta, centralizada e com largura limitada */}
        <div className="mt-12 border-t border-white/10 pt-7 text-center text-[0.8rem] leading-relaxed text-brand-300">
          <p className="mx-auto max-w-[72ch]">
            A CredFlex atua como correspondente bancário de instituições financeiras parceiras. A contratação depende de
            análise e aprovação de crédito. Taxas, prazos e CET são informados antes da contratação. Não solicitamos
            depósitos antecipados.
          </p>
          <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1">
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
        </div>

        <div className="mt-7 flex flex-col items-center gap-2 border-t border-white/10 pt-6 text-[0.8rem] text-brand-300 sm:flex-row sm:justify-between">
          <p className="t-num">
            © {new Date().getFullYear()} CredFlex{legal.cnpj ? ` · CNPJ ${legal.cnpj}` : ""}
          </p>
          <p>
            Desenvolvido por{" "}
            {credits.url ? (
              <a href={credits.url} target="_blank" rel="noopener" className="font-semibold text-brand-100 hover:text-white">
                {credits.name}
              </a>
            ) : (
              <span className="font-semibold text-brand-100" data-credit-link="pending">
                {credits.name}
              </span>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
