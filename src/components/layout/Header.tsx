"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Monogram";
import { mainNav, productMenu } from "@/content/navigation";
import { track } from "@/lib/analytics/events";

export function Header({ whatsappHref }: { whatsappHref: string | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha menus ao navegar.
  useEffect(() => {
    setMenuOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const isProductPath = productMenu.some((g) => g.items.some((i) => i.href === pathname));

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled ? "border-white/10 bg-brand-900/95 shadow-[0_10px_30px_-18px_rgb(0_0_0/0.6)] backdrop-blur-md" : "border-transparent bg-brand-900"
      }`}
    >
      <div className="container-x flex h-[var(--header-h)] items-center gap-6">
        <Link href="/" className="flex-none rounded-sm" aria-label="CredFlex — página inicial">
          <Logo />
        </Link>

        <nav aria-label="Principal" className="ml-4 hidden flex-1 items-center gap-1 lg:flex">
          <div ref={menuRef} className="relative">
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="menu-modalidades"
              onClick={() => setMenuOpen((v) => !v)}
              className={`flex h-11 items-center gap-1.5 rounded-sm px-3 font-semibold transition-colors hover:text-accent-300 ${
                isProductPath || menuOpen ? "text-white" : "text-brand-100"
              }`}
            >
              Modalidades
              <ChevronDown aria-hidden className={`h-4 w-4 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
            </button>
            <div
              id="menu-modalidades"
              hidden={!menuOpen}
              className="absolute left-0 top-[calc(100%+12px)] w-[640px] overflow-hidden rounded-md border border-sand bg-white shadow-[0_24px_60px_-24px_rgb(8_20_40/0.35)]"
            >
              <div className="grid grid-cols-[1.25fr_1fr]">
                {productMenu.map((group, gi) => (
                  <div key={group.label} className={gi === 0 ? "p-5" : "bg-paper-2 p-5"}>
                    <p className="t-eyebrow mb-3 text-stone">{group.label}</p>
                    <ul className="space-y-0.5">
                      {group.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            aria-current={pathname === item.href ? "page" : undefined}
                            className="group flex items-start justify-between gap-3 rounded-sm px-3 py-2.5 transition-colors hover:bg-brand-100/60 aria-[current=page]:bg-accent-100"
                          >
                            <span>
                              <span className="block font-semibold leading-tight text-brand-900">{item.label}</span>
                              <span className="t-small block text-stone">{item.description}</span>
                            </span>
                            <ArrowRight aria-hidden className="mt-1 h-4 w-4 flex-none -translate-x-1 text-brand-700 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <Link
                href="/simulacao"
                className="flex items-center justify-between border-t border-sand px-5 py-3.5 text-[0.95rem] font-semibold text-brand-900 hover:bg-accent-100"
              >
                Não sabe qual escolher? Responda algumas perguntas
                <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            </div>
          </div>
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className="relative flex h-11 items-center rounded-sm px-3 font-semibold text-brand-100 transition-colors hover:text-accent-300 aria-[current=page]:text-white aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-3 aria-[current=page]:after:bottom-1.5 aria-[current=page]:after:h-[2px] aria-[current=page]:after:bg-accent-400"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { cta_location: "header" })}
              className="hidden h-11 items-center rounded-sm px-3 text-[0.95rem] font-semibold text-brand-100 hover:text-accent-300 xl:flex"
            >
              WhatsApp oficial
            </a>
          )}
          <Link
            href="/simulacao"
            onClick={() => track("cta_click", { cta_id: "header_prequal", cta_location: "header" })}
            className="btn btn-primary hidden min-h-11 px-4 text-[0.95rem] sm:inline-flex"
          >
            Iniciar pré-análise
          </Link>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-sm text-white hover:bg-white/10 lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen(true)}
          >
            <Menu aria-hidden className="h-6 w-6" />
            <span className="sr-only">Abrir menu</span>
          </button>
        </div>
      </div>

      <MobileNavigation open={mobileOpen} onClose={() => setMobileOpen(false)} pathname={pathname} whatsappHref={whatsappHref} />
    </header>
  );
}

function MobileNavigation({
  open,
  onClose,
  pathname,
  whatsappHref,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  whatsappHref: string | null;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div id="mobile-nav" className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="absolute inset-0 bg-brand-950/40" onClick={onClose} aria-hidden />
      <div ref={panelRef} className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col overflow-y-auto bg-paper">
        <div className="flex h-[var(--header-h)] flex-none items-center justify-between bg-brand-900 px-[var(--gutter)]">
          <Logo />
          <button
            type="button"
            data-autofocus
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-sm text-white hover:bg-white/10"
          >
            <X aria-hidden className="h-6 w-6" />
            <span className="sr-only">Fechar menu</span>
          </button>
        </div>
        <nav aria-label="Menu móvel" className="flex-1 px-[var(--gutter)] py-6">
          {productMenu.map((group) => (
            <div key={group.label} className="mb-6">
              <p className="t-eyebrow mb-2 text-stone">{group.label}</p>
              <ul className="divide-y divide-sand border-y border-sand">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className="flex min-h-[60px] items-center justify-between gap-3 py-2.5 aria-[current=page]:text-brand-700"
                    >
                      <span>
                        <span className="block font-semibold text-brand-900">{item.label}</span>
                        <span className="block text-[0.9rem] text-stone">{item.description}</span>
                      </span>
                      {pathname === item.href ? <span className="fbars" aria-hidden /> : <ArrowRight aria-hidden className="h-4 w-4 flex-none text-brand-700" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <ul className="grid grid-cols-2 gap-2">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="flex min-h-12 items-center rounded-sm bg-paper-2 px-3 font-semibold text-brand-900 aria-[current=page]:bg-accent-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sticky bottom-0 flex-none space-y-2 border-t border-sand bg-paper px-[var(--gutter)] py-4">
          <Link href="/simulacao" className="btn btn-primary w-full">
            Iniciar pré-análise
          </Link>
          {whatsappHref && (
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost w-full text-brand-900">
              WhatsApp oficial
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
