import type { FaqItem, VerificationStatus } from "./types";

export interface Milestone {
  year: string;
  title: string;
  text?: string;
  status: VerificationStatus;
  note?: string;
}

/** Linha do tempo: apenas marcos fornecidos pela CredFlex devem ser confirmados. */
export const milestones: Milestone[] = [
  {
    year: "2017",
    title: "Início das atividades em Osvaldo Cruz/SP",
    status: "pending",
    note: "Ano citado no briefing; confirmar data e descrição.",
  },
  {
    year: "…",
    title: "Marcos intermediários",
    text: "Novas modalidades, mudança de sede, parcerias — aguardando informações da CredFlex.",
    status: "pending",
  },
  {
    year: "Hoje",
    title: "Atendimento presencial e por canais digitais oficiais",
    status: "pending",
  },
];

export const homeFaq: FaqItem[] = [
  {
    q: "A CredFlex é um banco?",
    a: "Não. A CredFlex atua como correspondente bancário: apresenta e intermedeia produtos de crédito de instituições financeiras parceiras. A análise e a liberação do crédito são feitas pela instituição.",
    status: "pending",
  },
  {
    q: "Fazer a pré-análise me obriga a contratar?",
    a: "Não. A pré-análise serve para a equipe entender o seu caso e explicar as possibilidades. Nenhum contrato é feito pelo site.",
    status: "confirmed",
  },
  {
    q: "Vocês pedem algum pagamento para liberar o crédito?",
    a: "Não. A CredFlex não solicita depósitos, taxas antecipadas ou pagamentos de qualquer tipo para liberar crédito. Se alguém pedir, não pague e fale com os nossos canais oficiais.",
    status: "pending",
  },
  {
    q: "Quando vou saber a taxa e o valor da parcela?",
    a: "Depois da análise, na proposta da instituição parceira. Ela deve informar por escrito a taxa de juros, o prazo, o valor das parcelas e o Custo Efetivo Total (CET) antes de você decidir.",
    status: "pending",
  },
  {
    q: "Por que vocês pedem só nome e WhatsApp?",
    a: "Porque é o mínimo necessário para retornar o seu contato. Outros dados, como CPF, só são pedidos quando são de fato necessários para a análise, e sempre com explicação.",
    status: "confirmed",
  },
  {
    q: "Posso ser atendido(a) pessoalmente?",
    a: "A CredFlex tem escritório em Osvaldo Cruz/SP. Endereço e horários serão publicados nesta página após confirmação.",
    status: "pending",
  },
];
