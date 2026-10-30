import { complementaryProducts, primaryProducts } from "./products";

export const productMenu = [
  {
    label: "Principais modalidades",
    items: primaryProducts.map((p) => ({ href: `/${p.slug}`, label: p.name, description: p.audience })),
  },
  {
    label: "Outras modalidades",
    items: complementaryProducts.map((p) => ({ href: `/${p.slug}`, label: p.name, description: p.audience })),
  },
];

export const mainNav = [
  { href: "/quem-somos", label: "Quem somos" },
  { href: "/seguranca", label: "Segurança" },
  { href: "/ajuda", label: "Ajuda" },
  { href: "/contato", label: "Contato" },
];

export const legalNav = [
  { href: "/politica-de-privacidade", label: "Política de privacidade" },
  { href: "/politica-de-cookies", label: "Política de cookies" },
  { href: "/termos-de-uso", label: "Termos de uso" },
];
