import { ArrowLeftRight, BriefcaseBusiness, CircleHelp, Landmark, PiggyBank, ScrollText, Zap } from "lucide-react";
import type { ProfileOption } from "@/content/profiles";

const map = {
  clt: BriefcaseBusiness,
  inss: ScrollText,
  portabilidade: ArrowLeftRight,
  servidor: Landmark,
  fgts: PiggyBank,
  luz: Zap,
  duvida: CircleHelp,
} as const;

export function ProfileGlyph({ icon, className = "h-5 w-5" }: { icon: ProfileOption["icon"]; className?: string }) {
  const Icon = map[icon];
  return <Icon aria-hidden className={className} strokeWidth={1.75} />;
}
