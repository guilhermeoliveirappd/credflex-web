import type { ProductSlug } from "@/content/products";

/**
 * Configuração central da pré-análise.
 *
 * Regra de ouro: uma opção só pode bloquear (`outcome: "ineligible"`) quando
 * `validated: true`. Regras não validadas apenas anotam o lead para a equipe.
 * Nesta fase NENHUMA regra está validada — ver docs/conversion-flow.md.
 */

export interface ChoiceOption {
  value: string;
  label: string;
  hint?: string;
  /** Desvia a jornada para outra modalidade/rota. */
  routeTo?: ProductSlug | "human-review";
  /** Só tem efeito se `validated` for true. */
  outcome?: "ineligible";
  validated?: boolean;
  /** Nota interna enviada ao CRM (sem dados pessoais). */
  flag?: string;
}

export interface ChoiceQuestion {
  id: string;
  kind: "choice";
  label: string;
  help?: string;
  options: ChoiceOption[];
  required: boolean;
}

export interface TextQuestion {
  id: string;
  kind: "text";
  label: string;
  help?: string;
  placeholder?: string;
  maxLength: number;
  required: boolean;
}

export type Question = ChoiceQuestion | TextQuestion;

export interface Flow {
  product: ProductSlug;
  intro: string;
  questions: Question[];
  /** Valor e prazo pretendidos fazem sentido para esta modalidade? */
  amountAndTerm: boolean;
}

const NAO_SEI = { value: "nao-sei", label: "Não sei / prefiro conversar" };

export const termOptions: ChoiceOption[] = [
  { value: "ate-12", label: "Até 12 meses" },
  { value: "13-24", label: "13 a 24 meses" },
  { value: "25-48", label: "25 a 48 meses" },
  { value: "49-mais", label: "Mais de 48 meses" },
  NAO_SEI,
];

export const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR",
  "PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
] as const;

export const flows: Partial<Record<ProductSlug, Flow>> = {
  "consignado-clt": {
    product: "consignado-clt",
    intro: "Algumas perguntas sobre o seu trabalho. Nenhum documento é pedido agora.",
    amountAndTerm: true,
    questions: [
      {
        id: "tipoVinculo",
        kind: "choice",
        label: "Como é o seu vínculo de trabalho?",
        required: true,
        options: [
          { value: "privado", label: "Carteira assinada em empresa privada" },
          { value: "domestico", label: "Empregado(a) doméstico(a)", flag: "regras-domestico-a-confirmar" },
          { value: "publico", label: "Na verdade, sou servidor público", routeTo: "servidor-publico" },
          NAO_SEI,
        ],
      },
      {
        id: "tempoVinculo",
        kind: "choice",
        label: "Há quanto tempo você está no emprego atual?",
        help: "O tempo mínimo varia conforme a instituição parceira.",
        required: true,
        options: [
          { value: "menos-3m", label: "Menos de 3 meses", flag: "tempo-curto" },
          { value: "3-12m", label: "De 3 a 12 meses" },
          { value: "1-3a", label: "De 1 a 3 anos" },
          { value: "mais-3a", label: "Mais de 3 anos" },
        ],
      },
      {
        id: "faixaRenda",
        kind: "choice",
        label: "Qual a sua faixa de salário bruto mensal?",
        help: "Usamos só para orientar a conversa. Você não precisa comprovar agora.",
        required: true,
        options: [
          { value: "ate-2k", label: "Até R$ 2.000" },
          { value: "2k-4k", label: "De R$ 2.001 a R$ 4.000" },
          { value: "4k-8k", label: "De R$ 4.001 a R$ 8.000" },
          { value: "mais-8k", label: "Acima de R$ 8.000" },
          { value: "prefiro-nao", label: "Prefiro não informar" },
        ],
      },
    ],
  },

  "consignado-inss": {
    product: "consignado-inss",
    intro: "Vamos entender o seu benefício. Se tiver dúvida, escolha “Não sei” — a equipe ajuda depois.",
    amountAndTerm: true,
    questions: [
      {
        id: "tipoBeneficio",
        kind: "choice",
        label: "Qual é o seu benefício?",
        required: true,
        options: [
          { value: "aposentadoria", label: "Aposentadoria do INSS" },
          { value: "pensao", label: "Pensão por morte do INSS" },
          {
            value: "bpc-loas",
            label: "BPC/LOAS (benefício assistencial)",
            hint: "Tem regras diferentes da aposentadoria",
            routeTo: "human-review",
            flag: "bpc-loas",
          },
          { value: "outro", label: "Outro benefício", flag: "beneficio-outro" },
          NAO_SEI,
        ],
      },
      {
        id: "objetivo",
        kind: "choice",
        label: "O que você procura?",
        required: true,
        options: [
          { value: "novo", label: "Um crédito novo" },
          {
            value: "portabilidade",
            label: "Transferir um consignado que já tenho",
            hint: "Portabilidade",
            routeTo: "portabilidade-inss",
          },
          NAO_SEI,
        ],
      },
    ],
  },

  "portabilidade-inss": {
    product: "portabilidade-inss",
    intro: "Portabilidade é a transferência de um contrato que você já tem. Não é um empréstimo novo.",
    amountAndTerm: false,
    questions: [
      {
        id: "tipoContrato",
        kind: "choice",
        label: "Qual contrato você quer transferir?",
        required: true,
        options: [
          { value: "inss", label: "Consignado descontado no benefício do INSS" },
          { value: "servidor", label: "Consignado de servidor público", flag: "portabilidade-servidor" },
          NAO_SEI,
        ],
      },
      {
        id: "quantidadeContratos",
        kind: "choice",
        label: "Quantos contratos de consignado você tem hoje?",
        required: true,
        options: [
          { value: "1", label: "Um" },
          { value: "2-3", label: "Dois ou três" },
          { value: "4-mais", label: "Quatro ou mais" },
          NAO_SEI,
        ],
      },
      {
        id: "tempoContrato",
        kind: "choice",
        label: "Há quanto tempo você paga o contrato mais antigo?",
        help: "Algumas instituições exigem um número mínimo de parcelas pagas.",
        required: true,
        options: [
          { value: "menos-1a", label: "Menos de 1 ano" },
          { value: "1-3a", label: "De 1 a 3 anos" },
          { value: "mais-3a", label: "Mais de 3 anos" },
          NAO_SEI,
        ],
      },
    ],
  },

  "servidor-publico": {
    product: "servidor-publico",
    intro: "A disponibilidade depende do convênio do seu órgão. Comece por aqui.",
    amountAndTerm: true,
    questions: [
      {
        id: "esfera",
        kind: "choice",
        label: "Em qual esfera você trabalha?",
        required: true,
        options: [
          { value: "federal", label: "Federal" },
          { value: "estadual", label: "Estadual" },
          { value: "municipal", label: "Municipal" },
          { value: "militar", label: "Forças Armadas ou militar estadual", flag: "militar" },
        ],
      },
      {
        id: "situacao",
        kind: "choice",
        label: "Qual a sua situação?",
        required: true,
        options: [
          { value: "ativo", label: "Ativo(a)" },
          { value: "aposentado", label: "Aposentado(a) ou pensionista do regime próprio" },
          { value: "temporario", label: "Contrato temporário ou comissionado", flag: "vinculo-temporario" },
        ],
      },
      {
        id: "orgao",
        kind: "text",
        label: "Qual é o órgão ou prefeitura?",
        help: "Exemplo: Prefeitura de Osvaldo Cruz, Secretaria da Educação de SP.",
        placeholder: "Nome do órgão",
        maxLength: 80,
        required: true,
      },
    ],
  },

  "antecipacao-fgts": {
    product: "antecipacao-fgts",
    intro: "As regras do saque-aniversário mudam com frequência. Estas perguntas ajudam a equipe a orientar você.",
    amountAndTerm: false,
    questions: [
      {
        id: "saqueAniversario",
        kind: "choice",
        label: "Você já aderiu ao saque-aniversário do FGTS?",
        required: true,
        options: [
          { value: "sim", label: "Sim, já aderi" },
          { value: "nao", label: "Ainda não", flag: "sem-adesao" },
          NAO_SEI,
        ],
      },
      {
        id: "saldo",
        kind: "choice",
        label: "Você tem saldo no FGTS hoje?",
        required: true,
        options: [
          { value: "sim", label: "Sim" },
          { value: "nao", label: "Não", flag: "sem-saldo" },
          NAO_SEI,
        ],
      },
    ],
  },

  "emprestimo-conta-de-luz": {
    product: "emprestimo-conta-de-luz",
    intro: "Essa modalidade depende da distribuidora de energia da sua região.",
    amountAndTerm: true,
    questions: [
      {
        id: "titular",
        kind: "choice",
        label: "A conta de luz está no seu nome?",
        required: true,
        options: [
          { value: "sim", label: "Sim, sou o(a) titular" },
          { value: "nao", label: "Não, está no nome de outra pessoa", flag: "nao-titular" },
          NAO_SEI,
        ],
      },
      {
        id: "uf",
        kind: "choice",
        label: "Em qual estado fica o imóvel?",
        required: true,
        options: UFS.map((uf) => ({ value: uf, label: uf })),
      },
      {
        id: "cidade",
        kind: "text",
        label: "E a cidade?",
        placeholder: "Nome da cidade",
        maxLength: 60,
        required: true,
      },
    ],
  },
};

export const prequalProducts = Object.keys(flows) as ProductSlug[];

export function getFlow(product: ProductSlug): Flow | undefined {
  return flows[product];
}
