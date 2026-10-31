import Link from "next/link";
import { ReviewMark } from "@/components/brand/ReviewMark";
import { SectionHeading } from "@/components/ui/SectionHeading";

const topics = [
  { title: "Sempre há análise de crédito", text: "A decisão final é da instituição parceira." },
  { title: "Condições por escrito", text: "Taxa, prazo e CET antes de você assinar." },
  { title: "Sem pagamento antecipado", text: "Nunca pedimos depósito para liberar crédito." },
];

export function TransparencyBlock() {
  return (
    <section aria-labelledby="transparencia-title" className="bg-paper py-[var(--section-y)]">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-5">
          <SectionHeading id="transparencia-title" title="Somos correspondente bancário, não banco." />
          <p className="mt-5 max-w-[40ch] text-ink-2">
            Apresentamos o crédito de instituições financeiras parceiras e acompanhamos você até a proposta.{" "}
            <ReviewMark note="Redação regulatória e lista de instituições parceiras pendentes de validação jurídica." />
          </p>
          <Link href="/seguranca" className="link-arrow mt-6 text-brand-800">
            Como reconhecer nossos canais
          </Link>
        </div>
        <ol data-reveal="stagger" className="grid gap-px overflow-hidden rounded-[var(--radius-md)] bg-sand sm:grid-cols-3 lg:col-span-7">
          {topics.map((t, i) => (
            <li key={t.title} className="bg-paper-2 p-6">
              <span aria-hidden className="t-num text-[0.85rem] font-bold text-brand-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-[1.1rem] font-bold leading-snug text-brand-950">{t.title}</h3>
              <p className="mt-1.5 text-ink-2">{t.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
