"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Observa elementos [data-reveal] e adiciona .is-in quando entram na tela.
 * Em grupos [data-reveal="stagger"], define --i em cada filho para o atraso.
 * Os estados iniciais vivem no CSS e só valem com html.js.
 */
export function ScrollReveal() {
  const pathname = usePathname();
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    for (const el of els) {
      if (el.dataset.reveal === "stagger") Array.from(el.children).forEach((c, i) => (c as HTMLElement).style.setProperty("--i", String(i)));
    }
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
