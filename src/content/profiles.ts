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
    explanation: "Consignado CLT: as parcelas são descontadas direto do salário.",
    next: "Perguntamos sobre o seu vínculo e a sua faixa de renda. Leva cerca de dois minutos.",
    product: "consignado-clt",
    icon: "clt",
  },
  {
    id: "inss",
    label: "Sou aposentado(a) ou pensionista do INSS",
    explanation: "Consignado INSS: parcelas descontadas do benefício. Também orientamos sobre portabilidade.",
    next: "Você informa o tipo de benefício. Se for BPC/LOAS, o atendimento é feito por uma pessoa da equipe.",
    product: "consignado-inss",
    icon: "inss",
  },
  {
    id: "portabilidade",
    label: "Já tenho consignado e quero comparar",
    explanation: "Portabilidade: transferir o contrato existente para outra instituição. Não é dinheiro novo.",
    next: "Você descreve o contrato atual e a equipe compara as condições com você.",
    product: "portabilidade-inss",
    icon: "portabilidade",
  },
  {
    id: "servidor",
    label: "Sou servidor(a) público(a)",
    explanation: "Consignado para servidores de órgãos com convênio ativo.",
    next: "Você informa a esfera e o órgão. Verificamos o convênio antes de falar em valores.",
    product: "servidor-publico",
    icon: "servidor",
  },
  {
    id: "fgts",
    label: "Quero consultar opções com o FGTS",
    explanation: "Antecipação do saque-aniversário, para quem tem saldo no FGTS.",
    next: "Verificamos se você já aderiu ao saque-aniversário e explicamos as autorizações necessárias.",
    product: "antecipacao-fgts",
    icon: "fgts",
  },
  {
    id: "luz",
    label: "Quero conhecer o crédito na conta de luz",
    explanation: "Parcelas na fatura de energia, para titulares em regiões participantes.",
    next: "Perguntamos sobre a titularidade e a sua cidade, para verificar a distribuidora.",
    product: "emprestimo-conta-de-luz",
    icon: "luz",
  },
  {
    id: "duvida",
    label: "Não sei qual é o meu caso",
    explanation: "Sem problema. Algumas perguntas simples ajudam a encontrar a modalidade certa.",
    next: "Você escolhe a situação mais parecida com a sua, e a equipe confirma depois.",
    product: null,
    icon: "duvida",
  },
];
