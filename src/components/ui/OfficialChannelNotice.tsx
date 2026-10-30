import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { site } from "@/content/site";

export function OfficialChannelNotice({ className = "" }: { className?: string }) {
  return (
    <aside className={`flex gap-4 rounded-[var(--radius-md)] border border-warn/30 bg-warn-bg p-5 ${className}`}>
      <ShieldAlert aria-hidden className="mt-0.5 h-6 w-6 flex-none text-warn" />
      <div>
        <p className="font-bold text-navy-950">{site.antiFraudMessage}</p>
        <p className="t-small mt-1 text-ink-2">
          Desconfie de quem pedir pagamento antecipado, senha ou código recebido por SMS.{" "}
          <Link href="/seguranca" className="font-semibold text-navy-800 underline">
            Veja os canais oficiais
          </Link>
          .
        </p>
      </div>
    </aside>
  );
}
