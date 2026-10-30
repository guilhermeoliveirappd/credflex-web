import { activeProducts } from "./products";

/** Somente páginas públicas indexáveis. Exclui /obrigado e rotas condicionais. */
export const publicPaths = [
  "/",
  ...activeProducts.map((p) => `/${p.slug}`),
  "/simulacao",
  "/quem-somos",
  "/seguranca",
  "/contato",
  "/ajuda",
  "/trabalhe-conosco",
  "/politica-de-privacidade",
  "/politica-de-cookies",
  "/termos-de-uso",
];
