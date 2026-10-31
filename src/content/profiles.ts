import type { ProductSlug } from "./products";

/** Opções do seletor de perfil (home). BPC/LOAS e Crédito Pessoal ficam fora até validação. */
export interface ProfileOption {
  id: string;
  label: string;
  explanation: string;
  next: string;
  product: ProductSlug | null;
  icon: "clt" | "inss" | "servidor" | "fgts" | "luz" | "portabilidade" | "duvida";
}

export const profileOptions: ProfileOption[] = [
  {
    id: "clt",
    label: "Trabalho com carteira assinada",
    explanation: "Parcelas descontadas direto do salário.",
    next: "Três perguntas sobre o seu trabalho. Leva uns dois minutos.",
    product: "consignado-clt",
    icon: "clt",
  },
  {
    id: "inss",
    label: "Sou aposentado ou pensionista",
    explanation: "Parcelas descontadas do benefício do INSS.",
    next: "Você informa o tipo de benefício e o que procura.",
    product: "consignado-inss",
    icon: "inss",
  },
  {
    id: "portabilidade",
    label: "Já tenho consignado",
    explanation: "Compare e transfira o seu contrato atual.",
    next: "Você conta sobre o contrato atual e a equipe compara as condições.",
    product: "portabilidade-inss",
    icon: "portabilidade",
  },
  {
    id: "servidor",
    label: "Sou servidor público",
    explanation: "Consignado para órgãos com convênio.",
    next: "Você informa o seu órgão e verificamos o convênio.",
    product: "servidor-publico",
    icon: "servidor",
  },
  {
    id: "fgts",
    label: "Tenho saldo no FGTS",
    explanation: "Antecipe o saque-aniversário.",
    next: "Duas perguntas sobre a sua situação no FGTS.",
    product: "antecipacao-fgts",
    icon: "fgts",
  },
  {
    id: "luz",
    label: "Crédito na conta de luz",
    explanation: "Parcelas na fatura de energia.",
    next: "Você informa a titularidade e a cidade.",
    product: "emprestimo-conta-de-luz",
    icon: "luz",
  },
  {
    id: "duvida",
    label: "Não sei qual escolher",
    explanation: "A gente ajuda a encontrar o caminho.",
    next: "Você escolhe a situação mais parecida e a equipe confirma depois.",
    product: null,
    icon: "duvida",
  },
];
