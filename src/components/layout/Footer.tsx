import Link from "next/link";
import { Logo } from "@/components/brand/Monogram";
import { ReviewMark } from "@/components/brand/ReviewMark";
import { CookiePreferencesButton } from "@/components/privacy/CookiePreferencesButton";
import { legalNav, mainNav } from "@/content/navigation";
import { activeProducts } from "@/content/products";
import { formatPhoneDisplay, site } from "@/content/site";

export function Footer() {
  const { channels, legal, location } = site;
  return (
    <footer className="bg-navy-950 text-navy-100">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-4">
          <Logo tone="light" />
          <p className="mt-5 max-w-sm text-navy-300">
            Correspondente bancário em {location.city}/{location.state}. Atendimento humano para você entender cada
            modalidade antes de decidir. <ReviewMark note="Papel institucional e redação a validar." />
          </p>
        </div>

        <nav aria-label="Modalidades" className="md:col-span-3">
          <p className="t-eyebrow mb-4 text-gold-300">Modalidades</p>
          <ul className="space-y-2.5">
            {activeProducts.map((p) => (
              <li key={p.slug}>
                <Link href={`/${p.slug}`} className="hover:text-white hover:underline">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Institucional" className="md:col-span-2">
          <p className="t-eyebrow mb-4 text-gold-300">CredFlex</p>
          <ul className="space-y-2.5">
            {mainNav.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="hover:text-white hover:underline">
                  {i.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/trabalhe-conosco" className="hover:text-white hover:underline">
                Trabalhe conosco
              </Link>
            </li>
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="t-eyebrow mb-4 text-gold-300">Canais oficiais</p>
          <ul className="space-y-2.5">
            {channels.whatsapp && <li>WhatsApp: {formatPhoneDisplay(channels.whatsapp)}</li>}
            {channels.phone && <li>Telefone: {formatPhoneDisplay(channels.phone)}</li>}
            {channels.email && (
              <li>
                <a href={`mailto:${channels.email}`} className="hover:text-white hover:underline">
                  {channels.email}
                </a>
              </li>
            )}
            {!channels.whatsapp && !channels.phone && !channels.email && (
              <li>
                <ReviewMark note="Nenhum canal oficial confirmado. O site antigo exibia números divergentes." />{" "}
                <span className="text-navy-300">Canais em confirmação.</span>
              </li>
            )}
          </ul>
          <Link href="/seguranca" className="link-arrow mt-5 text-gold-300">
            Como reconhecer nossos canais
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x space-y-4 py-8 text-[0.86rem] leading-relaxed text-navy-300">
          <p>
            A CredFlex atua como correspondente bancário, intermediando produtos de instituições financeiras parceiras.
            Toda contratação depende de análise e aprovação de crédito pela instituição. Taxas, prazos e Custo Efetivo
            Total (CET) são informados antes da contratação. A CredFlex não solicita depósitos antecipados.{" "}
            <ReviewMark note="Aviso regulatório a validar pelo jurídico; listar instituições parceiras." />
          </p>
          <p>
            {legal.razaoSocial && legal.cnpj ? (
              <>
                {legal.razaoSocial} — CNPJ {legal.cnpj}
              </>
            ) : (
              <>
                <ReviewMark note="Auditoria encontrou inconsistências de razão social. Não publicar valor presumido." />{" "}
                Razão social e CNPJ: aguardando documento oficial.
              </>
            )}
            {location.street && ` · ${location.street}, ${location.city}/${location.state}`}
          </p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {legalNav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <CookiePreferencesButton className="hover:text-white hover:underline" />
              </li>
            </ul>
            <p>© {new Date().getFullYear()} CredFlex</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
