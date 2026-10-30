/** Redirecionamentos 301 recomendados pela auditoria (seção de migração). */
export const legacyRedirects = [
  { from: "/consignado-clt-forms-antigo", to: "/consignado-clt" },
  { from: "/consignado-clt-forms", to: "/consignado-clt" },
  { from: "/auto-consignado-clt", to: "/consignado-clt" },
  { from: "/saque-fgts", to: "/antecipacao-fgts" },
  { from: "/conta-de-luz", to: "/emprestimo-conta-de-luz" },
  { from: "/consignado-sp", to: "/servidor-publico" },
  { from: "/termos-de-servicos", to: "/termos-de-uso" },
  { from: "/tk-page-forms", to: "/obrigado" },
  { from: "/consignado", to: "/consignado-inss" },
] as const;
