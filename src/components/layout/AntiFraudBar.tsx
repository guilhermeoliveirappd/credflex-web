import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { site } from "@/content/site";

export function AntiFraudBar() {
  return (
    <div className="noise border-b border-white/10 bg-brand-950 text-brand-100">
      <div className="container-x flex min-h-10 items-center justify-center gap-2.5 py-2 text-center text-[0.84rem] leading-snug sm:justify-start sm:text-left">
        <ShieldCheck aria-hidden className="hidden h-4 w-4 flex-none text-accent-400 sm:block" strokeWidth={2} />
        <p>
          <span className="font-semibold text-white">Atenção:</span> {site.antiFraudMessage.replace(/\.$/, "")}.{" "}
          <Link href="/seguranca" className="whitespace-nowrap font-semibold text-accent-300 underline hover:text-accent-100">
            Saiba como se proteger
          </Link>
        </p>
      </div>
    </div>
  );
}
