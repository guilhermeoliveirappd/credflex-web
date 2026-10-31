import Link from "next/link";
import { ReviewMark } from "@/components/brand/ReviewMark";
import { SectionHeading } from "@/components/ui/SectionHeading";

const topics = [
  {
    title: "O papel da CredFlex",
    text: "Somos correspondente bancário: apresentamos e intermediamos produtos de instituições financeiras parceiras. Não somos banco e não concedemos crédito com recursos próprios.",
  },
  {
    title: "Sempre existe análise de crédito",
    text: "Nenhuma modalidade é garantida antes da análise. A pré-análise do site organiza as informações; a decisão é da instituição parceira.",
  },
  {
    title: "Como as condições são definidas",
    text: "Taxa, prazo e valor dependem do seu perfil, da modalidade, das normas vigentes e da política de cada instituição.",
  },
  {
    title: "CET: o número que importa",
    text: "O Custo Efetivo Total reúne juros, tarifas, tributos e seguros. É ele que permite comparar propostas de verdade.",
  },
];

const checklist = ["Taxa de juros mensal e anual", "Custo Efetivo Total (CET)", "Número e valor das parcelas", "Valor total a pagar", "Nome da instituição que concede o crédito"];

export function TransparencyBlock() {
  return (
    <section aria-labelledby="transparencia-title" className="bg-paper py-[var(--section-y)]">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            id="transparencia-title"
            title="O que a CredFlex é — e o que não é."
            lead="Crédito exige informação clara. Por isso explicamos o nosso papel antes de qualquer conversa sobre valores."
          />
          <div className="mt-10 rounded-[var(--radius-md)] bg-paper-2 p-6">
            <p className="font-bold text-brand-950">Antes de assinar qualquer proposta, peça por escrito:</p>
            <ul className="mt-4 space-y-2.5">
              {checklist.map((c) => (
                <li key={c} className="flex items-start gap-3 text-ink-2">
                  <span aria-hidden className="mt-[0.6em] h-[2px] w-3 flex-none bg-accent-500" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <ol data-reveal="stagger" className="divide-y divide-sand border-y border-sand">
            {topics.map((t, i) => (
              <li key={t.title} className="grid gap-2 py-7 sm:grid-cols-[3rem_1fr]">
                <span aria-hidden className="t-num text-[0.85rem] font-bold text-brand-500 sm:pt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="t-h3 text-brand-950">{t.title}</h3>
                  <p className="mt-2 text-ink-2">{t.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="t-small mt-6 text-stone">
            <ReviewMark note="Redação regulatória e lista de instituições parceiras pendentes de validação jurídica." /> Instituições
            parceiras serão listadas aqui após confirmação.{" "}
            <Link href="/seguranca" className="font-semibold text-brand-700 underline">
              Como identificar os canais oficiais
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
