export interface StepMeta {
  id: string;
  label: string;
}

/** Barras segmentadas — derivadas das barras do F — com rótulo textual. */
export function ProgressIndicator({ steps, current }: { steps: StepMeta[]; current: number }) {
  return (
    <div>
      <p className="t-small flex items-baseline justify-between gap-4 text-stone">
        <span>
          Etapa <span className="t-num font-bold text-navy-900">{current + 1}</span> de <span className="t-num">{steps.length}</span>
        </span>
        <span className="font-semibold text-navy-900">{steps[current]?.label}</span>
      </p>
      <ol className="mt-3 flex gap-1.5" aria-label="Progresso da pré-análise">
        {steps.map((s, i) => (
          <li key={s.id} className="flex-1" aria-current={i === current ? "step" : undefined}>
            <span className="sr-only">
              {s.label}
              {i < current ? " (concluída)" : i === current ? " (atual)" : ""}
            </span>
            <span aria-hidden className="block h-[5px] overflow-hidden rounded-[2px] bg-sand">
              <span
                className={`block h-full origin-left bg-navy-800 transition-transform duration-500 ease-[var(--ease-out)] ${
                  i < current ? "scale-x-100" : i === current ? "scale-x-50 !bg-gold-400" : "scale-x-0"
                }`}
              />
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
