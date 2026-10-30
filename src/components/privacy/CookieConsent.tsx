"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { setAnalyticsConsent } from "@/lib/analytics/events";
import { captureUtm } from "@/lib/analytics/utm";
import {
  CONSENT_EVENT,
  OPEN_PREFERENCES_EVENT,
  readConsent,
  writeConsent,
  type ConsentChoice,
  type ConsentState,
} from "@/lib/privacy/consent";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

/** Carrega o GTM uma única vez, apenas após consentimento aplicável. */
function loadGtm() {
  if (!GTM_ID || document.getElementById("gtm-script")) return;
  const s = document.createElement("script");
  s.id = "gtm-script";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`;
  const w = window as unknown as { dataLayer: unknown[] };
  (w.dataLayer ??= []).push({ "gtm.start": Date.now(), event: "gtm.js" });
  document.head.appendChild(s);
}

function applyState(state: ConsentState | null) {
  const analytics = !!state?.analytics;
  setAnalyticsConsent(analytics);
  if (state && (state.analytics || state.marketing)) loadGtm();
  if (analytics) captureUtm(location.search, true);
}

export function CookieConsent() {
  const [state, setState] = useState<ConsentState | null | undefined>(undefined);
  const [prefsOpen, setPrefsOpen] = useState(false);

  useEffect(() => {
    const s = readConsent();
    setState(s);
    applyState(s);
    const onChange = (e: Event) => {
      const d = (e as CustomEvent<ConsentState>).detail;
      setState(d);
      applyState(d);
    };
    const onOpen = () => setPrefsOpen(true);
    window.addEventListener(CONSENT_EVENT, onChange);
    window.addEventListener(OPEN_PREFERENCES_EVENT, onOpen);
    return () => {
      window.removeEventListener(CONSENT_EVENT, onChange);
      window.removeEventListener(OPEN_PREFERENCES_EVENT, onOpen);
    };
  }, []);

  const save = useCallback((choice: ConsentChoice) => {
    writeConsent(choice);
    setPrefsOpen(false);
  }, []);

  return (
    <>
      {state === null && !prefsOpen && (
        <section
          aria-label="Aviso de cookies"
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-sand bg-white shadow-[0_-12px_40px_-20px_rgb(8_20_40/0.35)] sm:inset-x-auto sm:bottom-4 sm:left-4 sm:max-w-[440px] sm:rounded-md sm:border"
        >
          <div className="p-5">
            <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-navy-900">Sua privacidade, sua escolha</p>
            <p className="t-small mt-2 text-ink-2">
              Usamos cookies necessários para o site funcionar. Com a sua permissão, também usamos cookies de medição e
              de publicidade. Nada além do necessário é ativado antes da sua escolha.{" "}
              <Link href="/politica-de-cookies" className="font-semibold text-navy-700 underline">
                Política de cookies
              </Link>
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" className="btn btn-navy min-h-11 text-[0.95rem]" onClick={() => save({ analytics: true, marketing: true })}>
                Aceitar
              </button>
              <button type="button" className="btn btn-ghost min-h-11 text-[0.95rem] text-navy-900" onClick={() => save({ analytics: false, marketing: false })}>
                Recusar
              </button>
              <button
                type="button"
                className="col-span-2 min-h-11 rounded-sm text-[0.95rem] font-semibold text-navy-700 underline hover:bg-paper-2"
                onClick={() => setPrefsOpen(true)}
              >
                Configurar preferências
              </button>
            </div>
          </div>
        </section>
      )}
      {prefsOpen && <CookiePreferences initial={state ?? null} onSave={save} onClose={() => setPrefsOpen(false)} />}
    </>
  );
}

const categories = [
  {
    id: "necessary" as const,
    title: "Necessários",
    text: "Mantêm o site funcionando e guardam a sua escolha de cookies. Não podem ser desativados.",
    locked: true,
  },
  {
    id: "analytics" as const,
    title: "Medição",
    text: "Ajudam a entender quais páginas são úteis e onde as pessoas têm dificuldade. Nunca recebem nome, telefone ou CPF.",
  },
  {
    id: "marketing" as const,
    title: "Publicidade",
    text: "Permitem medir campanhas e exibir anúncios relevantes em outras plataformas.",
  },
];

export function CookiePreferences({
  initial,
  onSave,
  onClose,
}: {
  initial: ConsentState | null;
  onSave: (c: ConsentChoice) => void;
  onClose: () => void;
}) {
  const [choice, setChoice] = useState<ConsentChoice>({
    analytics: initial?.analytics ?? false,
    marketing: initial?.marketing ?? false,
  });
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (d && !d.open) d.showModal();
    return () => d?.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="cookie-prefs-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className="m-auto w-[min(560px,calc(100vw-2rem))] rounded-md border border-sand bg-white p-0 text-ink backdrop:bg-navy-950/50"
    >
      <div className="flex items-start justify-between gap-4 border-b border-sand p-5">
        <div>
          <h2 id="cookie-prefs-title" className="t-h3 text-navy-900">
            Preferências de cookies
          </h2>
          <p className="t-small mt-1 text-stone">Você pode mudar isso a qualquer momento pelo rodapé do site.</p>
        </div>
        <button type="button" onClick={onClose} className="flex h-11 w-11 flex-none items-center justify-center rounded-sm hover:bg-paper-2">
          <X aria-hidden className="h-5 w-5" />
          <span className="sr-only">Fechar</span>
        </button>
      </div>
      <ul className="divide-y divide-sand">
        {categories.map((c) => {
          const checked = c.locked ? true : choice[c.id as keyof ConsentChoice];
          return (
            <li key={c.id} className="flex items-start justify-between gap-5 p-5">
              <div>
                <label htmlFor={`cookie-${c.id}`} className="font-bold text-navy-900">
                  {c.title}
                </label>
                <p id={`cookie-${c.id}-desc`} className="t-small mt-1 text-ink-2">
                  {c.text}
                </p>
              </div>
              <button
                id={`cookie-${c.id}`}
                type="button"
                role="switch"
                aria-checked={checked}
                aria-describedby={`cookie-${c.id}-desc`}
                disabled={c.locked}
                onClick={() => !c.locked && setChoice((s) => ({ ...s, [c.id]: !s[c.id as keyof ConsentChoice] }))}
                className={`relative mt-1 h-8 w-14 flex-none rounded-full transition-colors disabled:cursor-not-allowed ${
                  checked ? "bg-navy-800" : "bg-sand-600"
                } ${c.locked ? "opacity-60" : ""}`}
              >
                <span
                  aria-hidden
                  className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-7" : "translate-x-1"}`}
                />
                <span className="sr-only">{checked ? "Ativado" : "Desativado"}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="grid gap-2 border-t border-sand p-5 sm:grid-cols-3">
        <button type="button" className="btn btn-ghost min-h-11 text-[0.95rem] text-navy-900" onClick={() => onSave({ analytics: false, marketing: false })}>
          Recusar todos
        </button>
        <button type="button" className="btn btn-ghost min-h-11 text-[0.95rem] text-navy-900" onClick={() => onSave({ analytics: true, marketing: true })}>
          Aceitar todos
        </button>
        <button type="button" className="btn btn-navy min-h-11 text-[0.95rem]" onClick={() => onSave(choice)}>
          Salvar escolhas
        </button>
      </div>
    </dialog>
  );
}
