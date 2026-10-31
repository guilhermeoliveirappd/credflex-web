import Link from "next/link";
import { Logo } from "@/components/brand/Monogram";
import { ReviewMark } from "@/components/brand/ReviewMark";
import { CookiePreferencesButton } from "@/components/privacy/CookiePreferencesButton";
import { legalNav } from "@/content/navigation";
import { activeProducts } from "@/content/products";
import { formatPhoneDisplay, site } from "@/content/site";

const linkCls =
  "relative inline-block py-1 text-brand-100 transition-colors duration-300 hover:text-white after:absolute after:inset-x-0 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent-400 after:transition-transform after:duration-300 hover:after:scale-x-100";

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <nav aria-label={title}>
      <h2 className="text-[0.95rem] font-semibold text-white">{title}</h2>
      <ul className="mt-4 space-y-1.5 text-[0.95rem]">{children}</ul>
    </nav>
  );
}

export function Footer() {
  const { channels, legal, location } = site;
  const year = new Date().getFullYear();
  return (
    <footer className="noise bg-brand-950 text-brand-100">
      <div className="container-x pb-10 pt-16 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="light" />
            <p className="no-justify mt-6 max-w-[30ch] text-[1.05rem] leading-relaxed text-brand-100">
              Crédito com gente de verdade por trás, em {location.city}/{location.state}.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-7 lg:col-start-6">
            <Column title="Modalidades">
              {activeProducts.map((p) => (
                <li key={p.slug}>
                  <Link href={`/${p.slug}`} className={linkCls}>
                    {p.name}
                  </Link>
                </li>
              ))}
            </Column>
            <Column title="Institucional">
              <li><Link href="/quem-somos" className={linkCls}>Quem somos</Link></li>
              <li><Link href="/seguranca" className={linkCls}>Segurança</Link></li>
              <li><Link href="/trabalhe-conosco" className={linkCls}>Trabalhe conosco</Link></li>
            </Column>
            <Column title="Ajuda e contato">
              <li><Link href="/ajuda" className={linkCls}>Central de ajuda</Link></li>
              <li><Link href="/contato" className={linkCls}>Contato</Link></li>
              {channels.whatsapp && (
                <li>
                  <a href={`https://wa.me/${channels.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className={`${linkCls} t-num`}>
                    {formatPhoneDisplay(channels.whatsapp)}
                  </a>
                </li>
              )}
              {channels.email && (
                <li>
                  <a href={`mailto:${channels.email}`} className={linkCls}>
                    {channels.email.split("@")[0]}@<wbr />
                    {channels.email.split("@")[1]}
                  </a>
                </li>
              )}
            </Column>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8 text-[0.86rem] leading-relaxed text-brand-300">
          <p className="max-w-[110ch]">
            A CredFlex atua como correspondente bancário, intermediando produtos de instituições financeiras parceiras. Toda
            contratação depende de análise e aprovação de crédito pela instituição; taxas, prazos e Custo Efetivo Total
            (CET) são informados antes da contratação. Não solicitamos depósitos antecipados.{" "}
            <ReviewMark note="Aviso regulatório a validar pelo jurídico; listar instituições parceiras." />
          </p>
          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="no-justify">
              © {year} CredFlex
              {legal.razaoSocial && legal.cnpj ? ` · ${legal.razaoSocial} · CNPJ ${legal.cnpj}` : ""} · {location.street}, {location.district},{" "}
              {location.city}/{location.state}, CEP {location.postalCode}
              {!legal.cnpj && (
                <>
                  {" "}
                  <ReviewMark note="Razão social e CNPJ: aguardando documento oficial (inconsistência apontada na auditoria)." />
                </>
              )}
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              {legalNav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkCls.replace("text-brand-100", "text-brand-300")}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <CookiePreferencesButton className={linkCls.replace("text-brand-100", "text-brand-300")} />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
