"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle, ArrowLeft, ArrowRight, Info, Loader2, Pencil, RotateCcw } from "lucide-react";
import { profileOptions } from "@/content/profiles";
import { isProductSlug, products, type ProductSlug } from "@/content/products";
import { track } from "@/lib/analytics/events";
import { readUtm } from "@/lib/analytics/utm";
import { getFlow, termOptions } from "@/lib/prequal/flows";
import { decideRoute, type RouteDecision } from "@/lib/prequal/routing";
import { amountTermSchema, contactSchema, maskAmount, maskPhone, parseAmount } from "@/lib/prequal/schema";
import type { LeadResponseBody } from "@/lib/leads/service";
import { DRAFT_KEY, RECEIPT_KEY } from "@/lib/prequal/storage-keys";
import { ChoiceGroup } from "./ChoiceGroup";
import { ProgressIndicator, type StepMeta } from "./ProgressIndicator";

type StepId = "perfil" | "perguntas" | "valor" | "contato" | "revisao";

interface WizardValues {
  profile: string;
  answers: Record<string, string>;
  amount: string;
  amountUnknown: boolean;
  term: string;
  name: string;
  whatsapp: string;
  bestTime: "manha" | "tarde" | "indiferente";
  consentContact: boolean;
  consentMarketing: boolean;
  website: string;
}

/** Rascunho SEM dados de contato: somente respostas não identificáveis. */
interface Draft {
  v: 1;
  idempotencyKey: string;
  startedAt: number;
  originProduct: ProductSlug | null;
  product: ProductSlug | null;
  profile: string;
  answers: Record<string, string>;
  amount: string;
  amountUnknown: boolean;
  term: string;
  step: StepId;
}


const prequalProfiles = profileOptions.filter((o) => o.product);

function readDraft(): Draft | null {
  try {
    const d = JSON.parse(sessionStorage.getItem(DRAFT_KEY) ?? "null") as Draft | null;
    return d?.v === 1 ? d : null;
  } catch {
    return null;
  }
}

type SubmitState = { kind: "idle" } | { kind: "submitting" } | { kind: "error"; error: string; fieldErrors?: Record<string, string> };

export function CreditPrequalificationWizard({ initialProduct }: { initialProduct?: string }) {
  const router = useRouter();
  const preset = isProductSlug(initialProduct) && getFlow(initialProduct) ? initialProduct : null;

  const [originProduct, setOriginProduct] = useState<ProductSlug | null>(preset);
  const [product, setProduct] = useState<ProductSlug | null>(preset);
  const [step, setStep] = useState<StepId>(preset ? "perguntas" : "perfil");
  const [decision, setDecision] = useState<RouteDecision | null>(null);
  const [restored, setRestored] = useState(false);
  const [submit, setSubmit] = useState<SubmitState>({ kind: "idle" });
  const meta = useRef({ idempotencyKey: "", startedAt: 0, formStarted: false, inFlight: false });
  const headingRef = useRef<HTMLHeadingElement>(null);

  const form = useForm<WizardValues>({
    defaultValues: {
      profile: preset ? (prequalProfiles.find((p) => p.product === preset)?.id ?? "") : "",
      answers: {},
      amount: "",
      amountUnknown: false,
      term: "",
      name: "",
      whatsapp: "",
      bestTime: "indiferente",
      consentContact: false,
      consentMarketing: false,
      website: "",
    },
    shouldFocusError: true,
  });
  const { register, watch, setValue, getValues, setError, clearErrors, formState } = form;
  const errors = formState.errors;

  const flow = product ? getFlow(product) : undefined;
  const humanReview = decision?.kind === "human-review";
  const displayProduct: ProductSlug | null = humanReview ? decision.product : product;

  const steps: StepMeta[] = useMemo(() => {
    const s: StepMeta[] = [
      { id: "perfil", label: "Seu perfil" },
      { id: "perguntas", label: "Perguntas" },
    ];
    if (flow?.amountAndTerm !== false && !humanReview) s.push({ id: "valor", label: "Valor e prazo" });
    s.push({ id: "contato", label: "Contato" }, { id: "revisao", label: "Revisão" });
    return s;
  }, [flow, humanReview]);
  const stepIndex = Math.max(0, steps.findIndex((s) => s.id === step));

  // Início: restaura rascunho da mesma sessão (sem dados pessoais).
  useEffect(() => {
    const d = readDraft();
    if (d && (!preset || d.originProduct === preset)) {
      meta.current.idempotencyKey = d.idempotencyKey;
      meta.current.startedAt = d.startedAt;
      setOriginProduct(d.originProduct);
      setProduct(d.product);
      setValue("profile", d.profile);
      setValue("answers", d.answers);
      setValue("amount", d.amount);
      setValue("amountUnknown", d.amountUnknown);
      setValue("term", d.term);
      if (d.product) setDecision(decideRoute(d.originProduct ?? d.product, d.answers));
      // Nunca restaura direto na revisão: dados de contato não são salvos.
      setStep(d.step === "revisao" ? "contato" : d.step);
      setRestored(Object.keys(d.answers).length > 0);
    } else {
      meta.current.idempotencyKey = crypto.randomUUID();
      meta.current.startedAt = Date.now();
    }
    track("sim_start", { product: preset ?? undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Salva rascunho a cada mudança relevante.
  const values = watch();
  useEffect(() => {
    if (!meta.current.idempotencyKey) return;
    const d: Draft = {
      v: 1,
      idempotencyKey: meta.current.idempotencyKey,
      startedAt: meta.current.startedAt,
      originProduct,
      product,
      profile: values.profile,
      answers: values.answers ?? {},
      amount: values.amount,
      amountUnknown: values.amountUnknown,
      term: values.term,
      step,
    };
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    } catch {}
  }, [values.profile, values.answers, values.amount, values.amountUnknown, values.term, step, product, originProduct]);

  const go = useCallback(
    (next: StepId) => {
      setStep(next);
      setSubmit({ kind: "idle" });
      requestAnimationFrame(() => {
        headingRef.current?.focus({ preventScroll: true });
        headingRef.current?.closest("[data-wizard]")?.scrollIntoView({ block: "start", behavior: "smooth" });
      });
    },
    [],
  );

  // sim_step após o recálculo das etapas (o índice depende da rota decidida).
  const lastTracked = useRef<string>("");
  useEffect(() => {
    if (!meta.current.idempotencyKey || lastTracked.current === step) return;
    lastTracked.current = step;
    track("sim_step", { step, step_index: stepIndex + 1, product: product ?? undefined });
  }, [step, stepIndex, product]);

  function restart() {
    try {
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {}
    meta.current.idempotencyKey = crypto.randomUUID();
    meta.current.startedAt = Date.now();
    form.reset();
    setOriginProduct(null);
    setProduct(null);
    setDecision(null);
    setRestored(false);
    go("perfil");
  }

  // ——— Validação por etapa ———
  function nextFromProfile() {
    const id = getValues("profile");
    const opt = prequalProfiles.find((p) => p.id === id);
    if (!opt?.product) {
      setError("profile", { message: "Escolha a opção mais parecida com a sua situação." });
      return;
    }
    clearErrors("profile");
    if (opt.product !== product) {
      setValue("answers", {});
      setDecision(null);
    }
    setOriginProduct(opt.product);
    setProduct(opt.product);
    track("product_select", { product: opt.product, cta_location: "wizard" });
    go("perguntas");
  }

  function nextFromQuestions() {
    if (!flow || !product) return;
    const answers = getValues("answers") ?? {};
    let ok = true;
    for (const q of flow.questions) {
      const v = (answers[q.id] ?? "").trim();
      if (q.required && !v) {
        setError(`answers.${q.id}` as const, { message: q.kind === "text" ? "Preencha este campo." : "Escolha uma opção." });
        ok = false;
      } else if (q.kind === "text" && v.length > q.maxLength) {
        setError(`answers.${q.id}` as const, { message: `Use no máximo ${q.maxLength} caracteres.` });
        ok = false;
      }
    }
    if (!ok) return;
    const d = decideRoute(product, answers);
    setDecision(d);
    if (d.kind === "switch") {
      track("sim_route_change", { origin_product: product, product: d.to });
      return; // painel de confirmação é exibido
    }
    if (d.kind === "ineligible") {
      track("sim_ineligible", { product });
      return;
    }
    if (d.kind === "human-review") {
      track("sim_route_change", { origin_product: product, product: d.product, route: "human-review" });
      go("contato");
      return;
    }
    go(flow.amountAndTerm ? "valor" : "contato");
  }

  function acceptSwitch(to: ProductSlug) {
    setProduct(to);
    setDecision(null);
    // Mantém respostas do fluxo de origem para contexto; o novo fluxo tem perguntas próprias.
    go("perguntas");
  }

  function nextFromAmount() {
    const v = getValues();
    const parsed = amountTermSchema.safeParse({
      amount: v.amountUnknown ? null : parseAmount(v.amount),
      amountUnknown: v.amountUnknown,
      term: v.term || null,
    });
    if (!v.amountUnknown && !parseAmount(v.amount)) {
      setError("amount", { message: "Informe um valor aproximado ou marque “Ainda não sei”." });
      return;
    }
    if (!parsed.success) {
      setError("amount", { message: "Informe um valor entre R$ 1 e R$ 5.000.000." });
      return;
    }
    if (!v.term) {
      setError("term", { message: "Escolha um prazo ou “Não sei”." });
      return;
    }
    go("contato");
  }

  function nextFromContact() {
    const v = getValues();
    const r = contactSchema.safeParse({
      name: v.name,
      whatsapp: v.whatsapp,
      bestTime: v.bestTime,
      consentContact: v.consentContact,
      consentMarketing: v.consentMarketing,
    });
    if (!r.success) {
      for (const issue of r.error.issues) {
        const field = issue.path[0] as keyof WizardValues;
        if (!errors[field]) setError(field, { message: issue.message });
      }
      form.setFocus((r.error.issues[0].path[0] as keyof WizardValues) ?? "name");
      return;
    }
    go("revisao");
  }

  async function send() {
    if (!product || !originProduct || meta.current.inFlight) return;
    meta.current.inFlight = true;
    setSubmit({ kind: "submitting" });
    const v = getValues();
    const payload = {
      idempotencyKey: meta.current.idempotencyKey,
      product,
      originProduct,
      answers: Object.fromEntries(Object.entries(v.answers ?? {}).filter(([, val]) => val !== "" && val != null).map(([k, val]) => [k, String(val).trim()])),
      amountTerm: steps.some((s) => s.id === "valor")
        ? { amount: v.amountUnknown ? null : parseAmount(v.amount), amountUnknown: v.amountUnknown, term: v.term || null }
        : undefined,
      contact: { name: v.name, whatsapp: v.whatsapp, bestTime: v.bestTime, consentContact: v.consentContact, consentMarketing: v.consentMarketing },
      sourcePath: "/simulacao",
      utm: readUtm(),
      website: v.website,
      elapsedMs: Date.now() - meta.current.startedAt,
    };
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({ ok: false, error: "unavailable" }))) as LeadResponseBody;
      if (!res.ok || !body.ok || !body.protocol) {
        setSubmit({ kind: "error", error: body.error ?? "unavailable", fieldErrors: body.fieldErrors });
        track("sim_error", { error_kind: body.error ?? `http_${res.status}`, product });
        meta.current.inFlight = false;
        return;
      }
      // Conversão somente após confirmação real do registro (deduplicada por protocolo).
      track("generate_lead", { lead_protocol: body.protocol, product: body.product, route: body.route });
      track("sim_complete", { product: body.product, route: body.route });
      try {
        sessionStorage.setItem(
          RECEIPT_KEY,
          JSON.stringify({ protocol: body.protocol, product: body.product, route: body.route, whatsappUrl: body.whatsappUrl ?? null, devMode: !!body.devMode, at: Date.now() }),
        );
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {}
      router.push("/obrigado");
    } catch {
      setSubmit({ kind: "error", error: "network" });
      track("sim_error", { error_kind: "network", product });
      meta.current.inFlight = false;
    }
  }

  function onContactFocus() {
    if (meta.current.formStarted) return;
    meta.current.formStarted = true;
    track("form_start", { product: product ?? undefined });
  }

  const p = displayProduct ? products[displayProduct] : null;
  const answers = watch("answers") ?? {};

  return (
    <div data-wizard className="scroll-mt-[calc(var(--header-h)+24px)] rounded-[var(--radius-md)] border border-sand bg-white shadow-[0_30px_80px_-50px_rgb(8_20_40/0.45)]">
      <div className="border-b border-sand px-5 py-5 sm:px-8">
        <ProgressIndicator steps={steps} current={stepIndex} />
      </div>

      {restored && step !== "perfil" && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand bg-paper px-5 py-3 sm:px-8">
          <p className="t-small text-ink-2">Recuperamos as respostas que você já tinha preenchido nesta sessão.</p>
          <button type="button" onClick={restart} className="inline-flex min-h-11 items-center gap-1.5 text-[0.92rem] font-semibold text-brand-700 underline">
            <RotateCcw aria-hidden className="h-4 w-4" /> Recomeçar
          </button>
        </div>
      )}

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (step === "perfil") nextFromProfile();
          else if (step === "perguntas") nextFromQuestions();
          else if (step === "valor") nextFromAmount();
          else if (step === "contato") nextFromContact();
          else send();
        }}
        className="px-5 py-7 sm:px-8 sm:py-9"
      >
        {/* Honeypot invisível para humanos */}
        <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
          <label>
            Não preencha este campo
            <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
          </label>
        </div>

        {step === "perfil" && (
          <section aria-labelledby="wz-h">
            <h2 id="wz-h" ref={headingRef} tabIndex={-1} className="t-h3 text-brand-950 outline-none">
              Qual dessas opções combina com você?
            </h2>
            <p className="mt-2 text-ink-2">Escolha a situação mais parecida com a sua. A equipe confirma depois.</p>
            <div className="mt-6">
              <ChoiceGroup
                name="profile"
                legend="Situação"
                options={prequalProfiles.map((o) => ({ value: o.id, label: o.label, hint: o.explanation }))}
                value={watch("profile")}
                register={register("profile", { onChange: () => clearErrors("profile") })}
                error={errors.profile?.message}
              />
            </div>
            <p className="t-small mt-5 text-stone">
              Não encontrou a sua situação?{" "}
              <Link href="/contato" className="font-semibold text-brand-700 underline">
                Fale com a equipe
              </Link>
              .
            </p>
          </section>
        )}

        {step === "perguntas" && flow && (
          <section aria-labelledby="wz-h">
            <h2 id="wz-h" ref={headingRef} tabIndex={-1} className="t-h3 text-brand-950 outline-none">
              {products[flow.product].name}: algumas perguntas
            </h2>
            <p className="mt-2 text-ink-2">{flow.intro}</p>
            <div className="mt-8 space-y-9">
              {flow.questions.map((q) =>
                q.kind === "choice" ? (
                  <ChoiceGroup
                    key={q.id}
                    name={`q-${q.id}`}
                    legend={q.label}
                    help={q.help}
                    options={q.options}
                    columns={q.options.length > 10 ? 6 : q.options.length === 4 && q.options.every((o) => o.label.length < 26) ? 2 : 1}
                    value={answers[q.id]}
                    register={register(`answers.${q.id}` as const, {
                      onChange: () => {
                        clearErrors(`answers.${q.id}` as const);
                        setDecision(null);
                      },
                    })}
                    error={errors.answers?.[q.id]?.message}
                  />
                ) : (
                  <div key={q.id}>
                    <label htmlFor={`q-${q.id}`} className="field-label !text-[1.15rem] text-brand-950">
                      {q.label}
                    </label>
                    {q.help && <p className="field-help !mt-0 mb-3">{q.help}</p>}
                    <input
                      id={`q-${q.id}`}
                      className="input"
                      placeholder={q.placeholder}
                      maxLength={q.maxLength}
                      aria-invalid={!!errors.answers?.[q.id]}
                      aria-describedby={errors.answers?.[q.id] ? `q-${q.id}-err` : undefined}
                      {...register(`answers.${q.id}` as const, { onChange: () => clearErrors(`answers.${q.id}` as const) })}
                    />
                    {errors.answers?.[q.id] && (
                      <p id={`q-${q.id}-err`} className="field-error" role="alert">
                        <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 flex-none" />
                        {errors.answers[q.id]?.message}
                      </p>
                    )}
                  </div>
                ),
              )}
            </div>

            {decision?.kind === "switch" && (
              <div role="status" className="mt-8 rounded-[var(--radius-sm)] border border-brand-300 bg-brand-100/50 p-5">
                <p className="flex items-start gap-2 font-bold text-brand-950">
                  <Info aria-hidden className="mt-0.5 h-5 w-5 flex-none text-brand-700" />
                  Pela sua resposta, a modalidade mais adequada é {products[decision.to].name}.
                </p>
                <p className="mt-1 pl-7 text-ink-2">{products[decision.to].mechanism}</p>
                <div className="mt-4 flex flex-col gap-2 pl-7 sm:flex-row">
                  <button type="button" className="btn btn-brand min-h-11" onClick={() => acceptSwitch(decision.to)}>
                    Seguir com {products[decision.to].shortName}
                  </button>
                  <button type="button" className="btn btn-ghost min-h-11 text-brand-900" onClick={() => setDecision(null)}>
                    Revisar respostas
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {step === "valor" && (
          <section aria-labelledby="wz-h">
            <h2 id="wz-h" ref={headingRef} tabIndex={-1} className="t-h3 text-brand-950 outline-none">
              Quanto você gostaria e em quanto tempo?
            </h2>
            <p className="mt-2 text-ink-2">
              É só uma referência para a conversa. O valor e o prazo possíveis dependem da análise e da instituição parceira.
            </p>
            <div className="mt-8 space-y-9">
              <div>
                <label htmlFor="amount" className="field-label !text-[1.15rem] text-brand-950">
                  Valor aproximado
                </label>
                <div className="relative mt-3 max-w-sm">
                  <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-stone">
                    R$
                  </span>
                  <input
                    id="amount"
                    inputMode="numeric"
                    autoComplete="off"
                    disabled={watch("amountUnknown")}
                    className="input t-num !pl-12 text-[1.25rem] font-semibold disabled:bg-paper disabled:text-stone"
                    aria-invalid={!!errors.amount}
                    aria-describedby={errors.amount ? "amount-err" : undefined}
                    {...register("amount", {
                      onChange: (e) => {
                        setValue("amount", maskAmount(e.target.value));
                        clearErrors("amount");
                      },
                    })}
                  />
                </div>
                <label className="mt-3 inline-flex min-h-11 cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-5 w-5 accent-brand-800"
                    {...register("amountUnknown", {
                      onChange: () => {
                        clearErrors("amount");
                      },
                    })}
                  />
                  <span className="font-semibold">Ainda não sei</span>
                </label>
                {errors.amount && (
                  <p id="amount-err" className="field-error" role="alert">
                    <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 flex-none" />
                    {errors.amount.message}
                  </p>
                )}
              </div>
              <ChoiceGroup
                name="term"
                legend="Prazo pretendido"
                help="Os prazos disponíveis variam conforme a modalidade."
                options={termOptions}
                columns={2}
                value={watch("term")}
                register={register("term", { onChange: () => clearErrors("term") })}
                error={errors.term?.message}
              />
            </div>
          </section>
        )}

        {step === "contato" && (
          <section aria-labelledby="wz-h" onFocusCapture={onContactFocus}>
            {humanReview && decision.product === "bpc-loas" && (
              <div role="status" className="mb-8 rounded-[var(--radius-sm)] border border-brand-300 bg-brand-100/50 p-5">
                <p className="flex items-start gap-2 font-bold text-brand-950">
                  <Info aria-hidden className="mt-0.5 h-5 w-5 flex-none text-brand-700" />
                  BPC/LOAS tem regras diferentes da aposentadoria do INSS.
                </p>
                <p className="mt-1 pl-7 text-ink-2">
                  Por isso, o seu caso não segue como consignado INSS. Uma pessoa da equipe vai entrar em contato para explicar
                  com cuidado o que é possível.
                </p>
              </div>
            )}
            <h2 id="wz-h" ref={headingRef} tabIndex={-1} className="t-h3 text-brand-950 outline-none">
              Como falamos com você?
            </h2>
            <p className="mt-2 text-ink-2">Pedimos só o necessário para retornar o seu contato. Não pedimos CPF nesta etapa.</p>
            <div className="mt-8 space-y-7">
              <div>
                <label htmlFor="name" className="field-label">
                  Seu nome
                </label>
                <input
                  id="name"
                  autoComplete="name"
                  className="input"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-err" : "name-help"}
                  {...register("name", { onChange: () => clearErrors("name") })}
                />
                {errors.name ? (
                  <p id="name-err" className="field-error" role="alert">
                    <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 flex-none" />
                    {errors.name.message}
                  </p>
                ) : (
                  <p id="name-help" className="field-help">
                    Como você prefere ser chamado(a).
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="whatsapp" className="field-label">
                  WhatsApp com DDD
                </label>
                <input
                  id="whatsapp"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder="(18) 99999-9999"
                  className="input t-num max-w-sm"
                  aria-invalid={!!errors.whatsapp}
                  aria-describedby={errors.whatsapp ? "wa-err" : "wa-help"}
                  {...register("whatsapp", {
                    onChange: (e) => {
                      setValue("whatsapp", maskPhone(e.target.value));
                      clearErrors("whatsapp");
                    },
                  })}
                />
                {errors.whatsapp ? (
                  <p id="wa-err" className="field-error" role="alert">
                    <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 flex-none" />
                    {errors.whatsapp.message}
                  </p>
                ) : (
                  <p id="wa-help" className="field-help">
                    Usado apenas para retornar sobre esta solicitação.
                  </p>
                )}
              </div>
              <ChoiceGroup
                name="bestTime"
                legend="Melhor horário para contato"
                options={[
                  { value: "manha", label: "Manhã" },
                  { value: "tarde", label: "Tarde" },
                  { value: "indiferente", label: "Tanto faz" },
                ]}
                columns={3}
                value={watch("bestTime")}
                register={register("bestTime")}
              />
              <div className="space-y-3 rounded-[var(--radius-sm)] bg-paper p-4 sm:p-5">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 flex-none accent-brand-800"
                    aria-invalid={!!errors.consentContact}
                    aria-describedby={errors.consentContact ? "cc-err" : undefined}
                    {...register("consentContact", { onChange: () => clearErrors("consentContact") })}
                  />
                  <span className="text-[0.97rem] leading-relaxed">
                    <strong>Autorizo a CredFlex a usar meu nome e WhatsApp</strong> para entrar em contato sobre esta
                    solicitação de pré-análise, conforme a{" "}
                    <Link href="/politica-de-privacidade" target="_blank" className="font-semibold text-brand-700 underline">
                      Política de Privacidade
                    </Link>
                    . <span className="text-stone">(obrigatório)</span>
                  </span>
                </label>
                {errors.consentContact && (
                  <p id="cc-err" className="field-error !mt-0 pl-8" role="alert">
                    <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 flex-none" />
                    {errors.consentContact.message}
                  </p>
                )}
                <label className="flex cursor-pointer items-start gap-3">
                  <input type="checkbox" className="mt-1 h-5 w-5 flex-none accent-brand-800" {...register("consentMarketing")} />
                  <span className="text-[0.97rem] leading-relaxed">
                    Aceito receber novidades e ofertas da CredFlex pelo WhatsApp. Posso cancelar quando quiser.{" "}
                    <span className="text-stone">(opcional)</span>
                  </span>
                </label>
              </div>
            </div>
          </section>
        )}

        {step === "revisao" && (
          <section aria-labelledby="wz-h">
            <h2 id="wz-h" ref={headingRef} tabIndex={-1} className="t-h3 text-brand-950 outline-none">
              Confira antes de enviar
            </h2>
            <p className="mt-2 text-ink-2">Você pode corrigir qualquer informação. Nada é contratado ao enviar.</p>
            <dl className="mt-7 divide-y divide-sand border-y border-sand">
              <ReviewRow label="Modalidade" value={p?.name ?? "—"} onEdit={() => go("perfil")} />
              {flow?.questions.map((q) => {
                const raw = answers[q.id];
                const label = q.kind === "choice" ? q.options.find((o) => o.value === raw)?.label : raw;
                return label ? <ReviewRow key={q.id} label={q.label} value={label} onEdit={() => go("perguntas")} /> : null;
              })}
              {steps.some((s) => s.id === "valor") && (
                <>
                  <ReviewRow label="Valor aproximado" value={watch("amountUnknown") ? "Ainda não sei" : `R$ ${watch("amount")}`} onEdit={() => go("valor")} />
                  <ReviewRow label="Prazo pretendido" value={termOptions.find((t) => t.value === watch("term"))?.label ?? "—"} onEdit={() => go("valor")} />
                </>
              )}
              <ReviewRow label="Nome" value={watch("name")} onEdit={() => go("contato")} />
              <ReviewRow label="WhatsApp" value={watch("whatsapp")} onEdit={() => go("contato")} />
            </dl>

            <LeadSubmissionStatus state={submit} onRetry={send} onEditContact={() => go("contato")} />
          </section>
        )}

        {/* Navegação */}
        {!(step === "perguntas" && decision?.kind === "switch") && (
          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-sand pt-6 sm:flex-row sm:items-center sm:justify-between">
            {stepIndex > 0 ? (
              <button
                type="button"
                className="btn min-h-12 justify-start px-0 text-brand-800 hover:text-brand-950 sm:px-2"
                onClick={() => {
                  const prev = steps[stepIndex - 1]?.id as StepId;
                  if (prev) go(prev);
                }}
                disabled={submit.kind === "submitting"}
              >
                <ArrowLeft aria-hidden className="h-5 w-5" /> Voltar
              </button>
            ) : (
              <span />
            )}
            <button type="submit" className="btn btn-primary min-w-[220px]" disabled={submit.kind === "submitting"} aria-busy={submit.kind === "submitting"}>
              {submit.kind === "submitting" ? (
                <>
                  <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> Enviando…
                </>
              ) : step === "revisao" ? (
                <>Enviar para a equipe</>
              ) : (
                <>
                  Continuar <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

function ReviewRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-start gap-x-4 py-3.5 sm:grid-cols-[minmax(0,15rem)_1fr_auto]">
      <dt className="t-small text-stone">{label}</dt>
      <dd className="col-start-1 font-semibold text-brand-950 sm:col-start-2">{value}</dd>
      <dd className="col-start-2 row-span-2 row-start-1 sm:col-start-3">
        <button type="button" onClick={onEdit} className="inline-flex min-h-11 items-center gap-1.5 px-2 text-[0.9rem] font-semibold text-brand-700 hover:underline">
          <Pencil aria-hidden className="h-3.5 w-3.5" /> Editar<span className="sr-only">: {label}</span>
        </button>
      </dd>
    </div>
  );
}

const errorCopy: Record<string, { title: string; text: string }> = {
  rate_limited: { title: "Muitas tentativas em pouco tempo", text: "Aguarde alguns minutos e tente novamente. Suas respostas continuam aqui." },
  unavailable: {
    title: "Não conseguimos registrar sua solicitação agora",
    text: "O problema é do nosso lado. Suas respostas continuam aqui — tente novamente em instantes.",
  },
  network: { title: "Sem conexão", text: "Verifique sua internet e tente novamente. Suas respostas continuam aqui." },
  invalid: { title: "Alguns dados precisam de ajuste", text: "Revise as informações de contato e tente novamente." },
  rejected: { title: "Não foi possível enviar", text: "Recarregue a página e tente novamente." },
};

export function LeadSubmissionStatus({ state, onRetry, onEditContact }: { state: SubmitState; onRetry: () => void; onEditContact: () => void }) {
  if (state.kind !== "error") return <div aria-live="polite" className="sr-only">{state.kind === "submitting" ? "Enviando sua solicitação" : ""}</div>;
  const c = errorCopy[state.error] ?? errorCopy.unavailable;
  return (
    <div role="alert" className="mt-7 rounded-[var(--radius-sm)] border border-error/40 bg-error-bg p-5">
      <p className="flex items-start gap-2 font-bold text-error">
        <AlertCircle aria-hidden className="mt-0.5 h-5 w-5 flex-none" /> {c.title}
      </p>
      <p className="mt-1 pl-7 text-ink-2">{c.text}</p>
      <div className="mt-3 flex flex-wrap gap-2 pl-7">
        {state.error === "invalid" ? (
          <button type="button" onClick={onEditContact} className="btn btn-ghost min-h-11 text-brand-900">
            Revisar contato
          </button>
        ) : (
          <button type="button" onClick={onRetry} className="btn btn-ghost min-h-11 text-brand-900">
            <RotateCcw aria-hidden className="h-4 w-4" /> Tentar novamente
          </button>
        )}
      </div>
    </div>
  );
}
