"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2, Upload } from "lucide-react";
import { maskPhone } from "@/lib/prequal/schema";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "done"; devMode: boolean } | { kind: "error"; message: string; fields?: Record<string, string> };

export function CareersForm() {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [fileName, setFileName] = useState("");
  const [phone, setPhone] = useState("");
  const fe = state.kind === "error" ? state.fields ?? {} : {};

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "sending") return;
    const fd = new FormData(e.currentTarget);
    fd.set("consent", fd.get("consent") ? "true" : "false");
    const file = fd.get("resume");
    if (file instanceof File && file.size > 5 * 1024 * 1024) {
      setState({ kind: "error", message: "Revise os campos destacados.", fields: { resume: "O arquivo deve ter até 5 MB." } });
      return;
    }
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/carreiras", { method: "POST", body: fd });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) setState({ kind: "done", devMode: !!body.devMode });
      else
        setState({
          kind: "error",
          message: res.status === 503 ? "O envio de currículos ainda não está disponível. Tente novamente mais tarde." : res.status === 429 ? "Muitas tentativas. Tente mais tarde." : "Revise os campos destacados.",
          fields: body.fieldErrors,
        });
    } catch {
      setState({ kind: "error", message: "Sem conexão. Tente novamente." });
    }
  }

  if (state.kind === "done") {
    return (
      <div role="status" className="rounded-[var(--radius-md)] bg-ok-bg p-7">
        <p className="flex items-center gap-2 text-lg font-bold text-ok"><CheckCircle2 aria-hidden className="h-6 w-6" /> Currículo recebido. Obrigado!</p>
        {state.devMode && <p className="review-mark mt-3 !whitespace-normal">Desenvolvimento: arquivo validado e descartado — nenhum armazenamento configurado.</p>}
      </div>
    );
  }

  const err = (k: string) =>
    fe[k] ? (
      <p id={`${k}-err`} className="field-error" role="alert"><AlertCircle aria-hidden className="mt-0.5 h-4 w-4 flex-none" />{fe[k]}</p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6 rounded-[var(--radius-md)] bg-white p-6 ring-1 ring-sand sm:p-8">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute left-[-9999px]" />
      <div>
        <label htmlFor="c-name" className="field-label">Nome</label>
        <input id="c-name" name="name" autoComplete="name" className="input" aria-invalid={!!fe.name} aria-describedby={fe.name ? "name-err" : undefined} />
        {err("name")}
      </div>
      <div>
        <label htmlFor="c-wa" className="field-label">WhatsApp com DDD</label>
        <input id="c-wa" name="whatsapp" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(maskPhone(e.target.value))} className="input t-num max-w-sm" aria-invalid={!!fe.whatsapp} aria-describedby={fe.whatsapp ? "whatsapp-err" : undefined} />
        {err("whatsapp")}
      </div>
      <div>
        <label htmlFor="c-area" className="field-label">Área de interesse</label>
        <select id="c-area" name="area" className="input max-w-sm" defaultValue="atendimento">
          <option value="atendimento">Atendimento</option>
          <option value="comercial">Comercial</option>
          <option value="administrativo">Administrativo</option>
          <option value="outra">Outra</option>
        </select>
      </div>
      <div>
        <span className="field-label" id="resume-label">Currículo (PDF, até 5 MB)</span>
        <label className={`flex min-h-[72px] cursor-pointer items-center gap-4 rounded-[var(--radius-sm)] border-[1.5px] border-dashed px-4 hover:border-brand-500 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-brand-700 ${fe.resume ? "border-error" : "border-sand-600"}`}>
          <Upload aria-hidden className="h-5 w-5 flex-none text-brand-700" />
          <span className="font-semibold text-brand-900">{fileName || "Escolher arquivo"}</span>
          <input type="file" name="resume" accept="application/pdf,.pdf" aria-labelledby="resume-label" aria-describedby={fe.resume ? "resume-err" : undefined} className="sr-only" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")} />
        </label>
        {err("resume")}
      </div>
      <label className="flex cursor-pointer items-start gap-3">
        <input type="checkbox" name="consent" value="true" className="mt-1 h-5 w-5 flex-none accent-brand-800" aria-describedby={fe.consent ? "consent-err" : undefined} />
        <span className="text-[0.97rem]">Autorizo a CredFlex a usar meus dados e currículo exclusivamente para processos seletivos, conforme a <Link href="/politica-de-privacidade" className="font-semibold text-brand-700 underline">Política de Privacidade</Link>.</span>
      </label>
      {err("consent")}
      {state.kind === "error" && <p role="alert" className="font-semibold text-error">{state.message}</p>}
      <button type="submit" className="btn btn-primary" disabled={state.kind === "sending"} aria-busy={state.kind === "sending"}>
        {state.kind === "sending" ? <><Loader2 aria-hidden className="h-5 w-5 animate-spin" /> Enviando…</> : "Enviar candidatura"}
      </button>
    </form>
  );
}
