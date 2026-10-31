import { SectionHeading } from "@/components/ui/SectionHeading";

/** Etapas espelham exatamente o fluxo implementado em /simulacao. */
const steps = [
  {
    title: "Você identifica o seu perfil",
    text: "Carteira assinada, aposentadoria, serviço público, FGTS ou conta de luz. Se não souber, ajudamos.",
  },
  {
    title: "Responde poucas perguntas",
    text: "Só o necessário para a pré-análise, mais nome e WhatsApp para contato. Sem CPF nesta etapa.",
  },
  {
    title: "Recebe orientação de uma pessoa",
    text: "A equipe retorna com as possibilidades para o seu caso e os próximos passos, com o seu protocolo.",
  },
  {
    title: "Decide com a proposta na mão",
    text: "A contratação, quando disponível, depende de análise e aprovação da instituição parceira.",
  },
];

export function HowItWorks({ tone = "accent" }: { tone?: "navy" | "accent" }) {
  const dark = tone === "navy";
  return (
    <section aria-labelledby="como-funciona-title" className={`${dark ? "noise bg-brand-900 text-white" : "bg-accent-400 text-brand-950"} overflow-hidden py-[var(--section-y)]`}>
      <div className="container-x">
        <SectionHeading
          id="como-funciona-title"
          tone={dark ? "light" : "dark"}
          title="Um caminho em quatro passos, sem atalhos escondidos."
          className="max-w-3xl"
        />
        <ol className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
          {/* conectores + itens animam separadamente: linha se desenha, etapas entram em sequência */}
          {/* O traço: linha que conecta as etapas, derivada das barras do F */}
          <span aria-hidden className={`absolute left-[19px] top-2 h-[calc(100%-1rem)] w-[2px] md:left-0 md:top-[19px] md:h-[2px] md:w-full ${dark ? "bg-white/15" : "bg-brand-900/20"}`} />
          <span aria-hidden data-reveal="line" className={`absolute left-[19px] top-2 h-[45%] w-[2px] md:left-0 md:top-[19px] md:h-[2px] md:w-[62%] ${dark ? "bg-accent-400" : "bg-brand-900"}`} />
          {steps.map((s, i) => (
            <li key={s.title} data-reveal="up" style={{ transitionDelay: `${i * 110}ms` }} className="relative grid grid-cols-[40px_1fr] gap-5 md:block">
              <span
                className={`t-num relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-[0.95rem] font-bold ${
                  i < 3 ? (dark ? "bg-accent-400 text-brand-950" : "bg-brand-900 text-white") : dark ? "border-2 border-white/30 bg-brand-900 text-white" : "border-2 border-brand-900/40 bg-accent-400 text-brand-950"
                }`}
              >
                {i + 1}
              </span>
              <div className="md:mt-8 md:pr-4">
                <h3 className={`text-[1.2rem] font-bold leading-snug ${dark ? "text-white" : "text-brand-950"}`}>{s.title}</h3>
                <p className={`mt-2 ${dark ? "text-brand-100" : "text-brand-950/85"}`}>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className={`t-small mt-14 max-w-[70ch] border-t pt-6 ${dark ? "border-white/10 text-brand-300" : "border-brand-900/20 text-brand-950"}`}>
          Os três primeiros passos acontecem com a CredFlex. O quarto depende da instituição parceira, que faz a análise de
          crédito e define as condições finais.
        </p>
      </div>
    </section>
  );
}
