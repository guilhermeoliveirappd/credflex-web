import { CFPath } from "@/components/brand/CFPath";
import { PhotoSlot } from "@/components/brand/PhotoSlot";
import type { ProductLayout } from "@/content/products";

/**
 * Visual próprio de cada modalidade — diagramas que explicam o MECANISMO,
 * sem números inventados (barras representam proporções ilustrativas).
 */
export function HeroVisual({ layout }: { layout: ProductLayout }) {
  switch (layout) {
    case "payroll":
      return <Payslip />;
    case "benefit":
      return (
        <div className="relative">
          <PhotoSlot
            alt="Atendimento presencial a um(a) aposentado(a) no escritório da CredFlex"
            brief="Atendimento real a cliente aposentado(a), com autorização de imagem. Vertical 4:5."
            className="aspect-[4/3] rounded-[var(--radius-md)] rounded-tr-[38%] lg:aspect-[4/5]"
            tone="sand"
          />
          <div className="absolute -bottom-6 left-4 right-4 rounded-[var(--radius-sm)] bg-navy-900 p-5 text-white sm:left-auto sm:max-w-[290px]">
            <span className="fbars" aria-hidden />
            <p className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold leading-snug">Pode trazer alguém de confiança para a conversa.</p>
          </div>
        </div>
      );
    case "portability":
      return <PortabilityDiagram />;
    case "public":
      return <Spheres />;
    case "fgts":
      return <FgtsCalendar />;
    case "energy":
      return <EnergyBill />;
    default:
      return <CFPath className="w-full max-w-md" stroke="var(--color-navy-300)" />;
  }
}

function Frame({ children, caption }: { children: React.ReactNode; caption: string }) {
  return (
    <figure className="rounded-[var(--radius-md)] border border-sand bg-white p-6 shadow-[0_30px_70px_-45px_rgb(8_20_40/0.5)] sm:p-8">
      {children}
      <figcaption className="t-small mt-6 border-t border-sand pt-4 text-stone">{caption}</figcaption>
    </figure>
  );
}

function Bar({ w, tone = "sand" }: { w: string; tone?: "sand" | "navy" | "gold" }) {
  const c = tone === "navy" ? "bg-navy-800" : tone === "gold" ? "bg-gold-400" : "bg-sand";
  return <span aria-hidden className={`block h-2.5 rounded-[2px] ${c}`} style={{ width: w }} />;
}

function Payslip() {
  return (
    <Frame caption="Ilustração: a parcela aparece como um desconto no seu contracheque, dentro da margem permitida.">
      <div className="flex items-center justify-between">
        <p className="t-eyebrow text-stone">Contracheque</p>
        <span className="fbars" aria-hidden />
      </div>
      <dl className="mt-6 space-y-5">
        {[
          ["Salário", "88%", "navy"],
          ["Descontos legais", "36%", "sand"],
          ["Parcela do consignado", "22%", "gold"],
        ].map(([label, w, tone]) => (
          <div key={label} className="grid grid-cols-[1fr_1.3fr] items-center gap-4">
            <dt className={`font-semibold ${tone === "gold" ? "text-navy-950" : "text-ink-2"}`}>{label}</dt>
            <dd>
              <Bar w={w} tone={tone as "navy"} />
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 rounded-[var(--radius-sm)] bg-gold-100 px-4 py-3 text-[0.95rem] font-semibold text-navy-900">
        Desconto automático, todo mês, direto na folha.
      </div>
    </Frame>
  );
}

function PortabilityDiagram() {
  return (
    <Frame caption="Portabilidade: o mesmo contrato muda de instituição. Não há dinheiro novo envolvido.">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="rounded-[var(--radius-sm)] border border-sand p-4">
          <p className="t-eyebrow text-stone">Hoje</p>
          <p className="mt-2 font-bold text-navy-950">Instituição atual</p>
          <div className="mt-4 space-y-2">
            <Bar w="90%" />
            <Bar w="70%" />
          </div>
        </div>
        <svg aria-hidden viewBox="0 0 60 30" className="w-12 text-gold-500">
          <path d="M2 10h50M2 20h40M44 4l8 6-8 6" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
        <div className="rounded-[var(--radius-sm)] border-2 border-navy-800 p-4">
          <p className="t-eyebrow text-navy-500">Depois</p>
          <p className="mt-2 font-bold text-navy-950">Nova instituição</p>
          <div className="mt-4 space-y-2">
            <Bar w="90%" tone="navy" />
            <Bar w="55%" tone="gold" />
          </div>
        </div>
      </div>
    </Frame>
  );
}

function Spheres() {
  const items = [
    ["Federal", "Órgãos e autarquias da União"],
    ["Estadual", "Secretarias, autarquias e fundações"],
    ["Municipal", "Prefeituras e câmaras"],
  ];
  return (
    <Frame caption="A disponibilidade depende do convênio entre o seu órgão e a instituição parceira.">
      <ul className="space-y-3">
        {items.map(([t, d], i) => (
          <li key={t} className="flex items-center gap-4 rounded-[var(--radius-sm)] border border-sand p-4">
            <span className="t-num flex h-10 w-10 flex-none items-center justify-center rounded-full bg-navy-900 text-[0.85rem] font-bold text-gold-300">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>
              <span className="block font-bold text-navy-950">{t}</span>
              <span className="t-small block text-stone">{d}</span>
            </span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

function FgtsCalendar() {
  const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return (
    <Frame caption="Ilustração: no saque-aniversário, o valor fica disponível uma vez por ano, no mês do seu aniversário. A antecipação adianta esses valores.">
      <p className="t-eyebrow text-stone">Um ano do saque-aniversário</p>
      <ol className="mt-5 grid grid-cols-6 gap-2 sm:grid-cols-12">
        {months.map((m, i) => (
          <li key={m} className="text-center">
            <span aria-hidden className={`mx-auto block h-16 w-full rounded-[3px] ${i === 7 ? "bg-gold-400" : "bg-sand"}`} />
            <span className={`mt-2 block text-[0.78rem] font-semibold uppercase ${i === 7 ? "text-navy-950" : "text-stone"}`}>{m}</span>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-[0.95rem] text-ink-2">
        <span className="mr-2 inline-block h-2.5 w-2.5 rounded-[2px] bg-gold-400 align-middle" aria-hidden />
        Mês de aniversário (exemplo)
      </p>
    </Frame>
  );
}

function EnergyBill() {
  return (
    <Frame caption="Ilustração: a parcela é cobrada junto com a fatura de energia, em regiões com distribuidora participante.">
      <div className="flex items-center justify-between">
        <p className="t-eyebrow text-stone">Fatura de energia</p>
        <span className="fbars" aria-hidden />
      </div>
      <dl className="mt-6 divide-y divide-sand border-y border-sand">
        {[
          ["Consumo do mês", "70%", "sand"],
          ["Tributos e encargos", "40%", "sand"],
          ["Parcela do crédito", "30%", "gold"],
        ].map(([l, w, tone]) => (
          <div key={l} className="grid grid-cols-[1fr_1fr] items-center gap-4 py-4">
            <dt className={`font-semibold ${tone === "gold" ? "text-navy-950" : "text-ink-2"}`}>{l}</dt>
            <dd>
              <Bar w={w} tone={tone as "gold"} />
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex items-center justify-between font-bold text-navy-950">
        <span>Total da fatura</span>
        <Bar w="40%" tone="navy" />
      </div>
    </Frame>
  );
}
