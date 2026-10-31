"use client";

import { AlertCircle, Check } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";
import type { ChoiceOption } from "@/lib/prequal/flows";

/**
 * Grupo de rádios nativos (setas do teclado e leitores de tela funcionam
 * sem código extra), com área de toque completa por opção.
 */
export function ChoiceGroup({
  name,
  legend,
  help,
  options,
  value,
  register,
  error,
  columns = 1,
}: {
  name: string;
  legend: string;
  help?: string;
  options: ChoiceOption[];
  value: string | undefined;
  register: UseFormRegisterReturn;
  error?: string;
  columns?: 1 | 2 | 3 | 6;
}) {
  const errId = `${name}-error`;
  const helpId = `${name}-help`;
  const grid = { 1: "", 2: "sm:grid-cols-2", 3: "grid-cols-2 sm:grid-cols-3", 6: "grid-cols-3 xs:grid-cols-5 sm:grid-cols-7" }[columns];
  return (
    <fieldset aria-describedby={[help ? helpId : "", error ? errId : ""].filter(Boolean).join(" ") || undefined} aria-invalid={!!error}>
      <legend className="text-[1.15rem] font-bold leading-snug text-brand-950">{legend}</legend>
      {help && (
        <p id={helpId} className="field-help !mt-1">
          {help}
        </p>
      )}
      <div className={`mt-4 grid gap-2 ${grid}`}>
        {options.map((o) => {
          const checked = value === o.value;
          const compact = columns === 6;
          return (
            <label
              key={o.value}
              className={`group relative flex cursor-pointer items-center gap-3 rounded-[var(--radius-sm)] border-[1.5px] transition-[border-color,background-color,box-shadow] duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-700 ${
                compact ? "min-h-12 justify-center px-2" : "min-h-[58px] px-4 py-3"
              } ${
                checked
                  ? "border-brand-800 bg-brand-100/50 shadow-[inset_3px_0_0_var(--color-accent-400)]"
                  : error
                    ? "border-error/60 bg-white hover:border-brand-500"
                    : "border-sand-600 bg-white hover:border-brand-500"
              }`}
            >
              <input type="radio" value={o.value} className="sr-only" {...register} />
              {!compact && (
                <span
                  aria-hidden
                  className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border-2 transition-colors ${
                    checked ? "border-brand-800 bg-brand-800 text-white" : "border-sand-600 bg-white text-transparent group-hover:border-brand-500"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3.5} />
                </span>
              )}
              <span className={compact ? `font-bold ${checked ? "text-brand-900" : "text-ink-2"}` : ""}>
                <span className={`block font-semibold leading-snug ${checked ? "text-brand-950" : "text-ink"}`}>{o.label}</span>
                {o.hint && <span className="mt-0.5 block text-[0.9rem] text-stone">{o.hint}</span>}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id={errId} className="field-error" role="alert">
          <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 flex-none" /> {error}
        </p>
      )}
    </fieldset>
  );
}
