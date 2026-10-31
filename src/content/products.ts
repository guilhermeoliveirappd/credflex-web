import { pending, type Fact, type FaqItem } from "./types";

export type ProductSlug =
  | "consignado-clt"
  | "consignado-inss"
  | "portabilidade-inss"
  | "servidor-publico"
  | "antecipacao-fgts"
  | "emprestimo-conta-de-luz"
  | "bpc-loas"
  | "credito-pessoal";

/**
 * `active`      — página pública, menu, sitemap e pré-análise.
 * `conditional` — estrutura interna, noindex, fora do menu/sitemap, sem
 *                  jornada de contratação ativa até validação da oferta.
 */
export type PublicationStatus = "active" | "conditional";

/** Variações de composição da página de produto (não só troca de título). */
export type ProductLayout =
  | "payroll"
  | "benefit"
  | "portability"
  | "public"
  | "fgts"
  | "energy"
  | "internal";

export interface Product {
  slug: ProductSlug;
  name: string;
  shortName: string;
  status: PublicationStatus;
  tier: "primary" | "complementary";
  layout: ProductLayout;
  /** Rótulo do público, usado em seletor e cards. */
  audience: string;
  /** Uma frase objetiva: o que é. */
  summary: string;
  /** Descrição curta para cards (até ~2 linhas). */
  teaser: string;
  /** Mecanismo do produto, em linguagem simples. */
  mechanism: string;
  heroTitle: string;
  heroLead: string;
  seoTitle: string;
  seoDescription: string;
  forWhom: Fact[];
  steps: { title: string; text: string }[];
  requirements: Fact[];
  documents: Fact[];
  restrictions: Fact[];
  faq: FaqItem[];
  ctaLabel: string;
}

const conditionsNote = pending(
  "Taxa, prazo, valor e CET são informados pela instituição parceira após a análise, antes de qualquer contratação.",
);

export const products: Record<ProductSlug, Product> = {
  "consignado-clt": {
    slug: "consignado-clt",
    name: "Consignado CLT",
    shortName: "CLT",
    status: "active",
    tier: "primary",
    layout: "payroll",
    audience: "Trabalhadores com carteira assinada",
    summary: "Crédito com parcelas descontadas diretamente do salário.",
    teaser: "Para quem tem carteira assinada.",
    mechanism:
      "As parcelas são descontadas na folha de pagamento, dentro do limite permitido para o seu salário. Você não precisa lembrar de boletos.",
    heroTitle: "Crédito para quem tem carteira assinada, com a parcela direto na folha.",
    heroLead:
      "Conte um pouco sobre o seu vínculo de trabalho. Uma pessoa da nossa equipe analisa o seu caso e explica quais caminhos existem.",
    seoTitle: "Consignado CLT: crédito com desconto em folha",
    seoDescription:
      "Entenda como funciona o consignado para trabalhadores com carteira assinada e inicie uma pré-análise com atendimento humano da CredFlex.",
    forWhom: [
      pending("Trabalhadores do setor privado com carteira assinada (CLT)."),
      pending("Empregados domésticos podem ter regras próprias.", "Confirmar com a instituição parceira."),
    ],
    steps: [
      { title: "Você conta sobre o vínculo", text: "Tempo de empresa e faixa de renda, sem documentos nessa etapa." },
      { title: "A equipe verifica as opções", text: "Consultamos as possibilidades nas instituições parceiras." },
      { title: "Você recebe a proposta", text: "Com taxa, prazo e CET por escrito, antes de decidir." },
      { title: "Autorização e contratação", text: "Se você aceitar, a contratação segue com a instituição parceira." },
    ],
    requirements: [
      pending("Vínculo empregatício ativo.", "Tempo mínimo de empresa varia por instituição — não informar até confirmar."),
      pending(
        "A contratação pode exigir autorização pela Carteira de Trabalho Digital.",
        "Validar fluxo vigente do Crédito do Trabalhador com o parceiro.",
      ),
    ],
    documents: [pending("Documento de identificação com foto."), pending("Comprovante de renda recente.")],
    restrictions: [
      pending("As parcelas não podem ultrapassar a margem consignável do salário."),
      pending("Em caso de desligamento, as regras de quitação são definidas em contrato."),
    ],
    faq: [
      {
        q: "Preciso que minha empresa autorize?",
        a: "Depende do convênio e do fluxo da instituição parceira. Na pré-análise, a equipe verifica isso para você.",
        status: "pending",
      },
      {
        q: "O que acontece se eu sair da empresa?",
        a: "As condições em caso de desligamento constam no contrato. Peça essa informação por escrito antes de contratar.",
        status: "pending",
      },
    ],
    ctaLabel: "Iniciar pré-análise CLT",
  },

  "consignado-inss": {
    slug: "consignado-inss",
    name: "Consignado INSS",
    shortName: "INSS",
    status: "active",
    tier: "primary",
    layout: "benefit",
    audience: "Aposentados e pensionistas do INSS",
    summary: "Crédito com parcelas descontadas do benefício.",
    teaser: "Para aposentados e pensionistas do INSS.",
    mechanism:
      "As parcelas são descontadas todo mês diretamente da aposentadoria ou pensão, dentro da margem consignável do benefício.",
    heroTitle: "Para aposentados e pensionistas: crédito explicado com calma, do começo ao fim.",
    heroLead:
      "Sem pressa e sem letras miúdas. Você informa o tipo de benefício e a nossa equipe explica, por WhatsApp ou pessoalmente, o que é possível no seu caso.",
    seoTitle: "Consignado INSS para aposentados e pensionistas",
    seoDescription:
      "Consignado INSS com atendimento humano: entenda margem, documentos e condições, e inicie uma pré-análise com a CredFlex em Osvaldo Cruz/SP.",
    forWhom: [
      pending("Aposentados do INSS."),
      pending("Pensionistas do INSS."),
      pending(
        "BPC/LOAS é um benefício assistencial com regras próprias e não é tratado nesta página.",
        "Correção do encaminhamento BPC → INSS apontado na auditoria.",
      ),
    ],
    steps: [
      { title: "Você informa o benefício", text: "Tipo de benefício e o que você procura: crédito novo ou portabilidade." },
      { title: "Consultamos a margem", text: "Com a sua autorização, verificamos a margem disponível." },
      { title: "Proposta por escrito", text: "Valor, parcela, prazo e CET antes de qualquer assinatura." },
      { title: "Contratação com o parceiro", text: "A instituição parceira faz a análise final e a liberação." },
    ],
    requirements: [
      pending("Benefício ativo e liberado para empréstimo consignado.", "Regras de desbloqueio a confirmar."),
      pending("Margem consignável disponível."),
    ],
    documents: [
      pending("Documento de identificação com foto."),
      pending("Número do benefício."),
      pending("Comprovante de residência."),
    ],
    restrictions: [
      pending("Limites de margem, taxa máxima e prazo seguem normas do INSS vigentes na data da contratação."),
      conditionsNote,
    ],
    faq: [
      {
        q: "Vocês ligam oferecendo empréstimo?",
        a: "Desconfie de contatos que você não solicitou. Consulte a página de Segurança para conhecer os canais oficiais.",
        status: "pending",
      },
      {
        q: "Posso levar alguém da família ao atendimento?",
        a: "Sim. Recomendamos que você tire todas as dúvidas com calma, acompanhado(a) de quem preferir.",
        status: "pending",
      },
    ],
    ctaLabel: "Iniciar pré-análise INSS",
  },

  "portabilidade-inss": {
    slug: "portabilidade-inss",
    name: "Portabilidade INSS",
    shortName: "Portabilidade",
    status: "active",
    tier: "primary",
    layout: "portability",
    audience: "Quem já tem consignado INSS",
    summary: "Transferir um consignado existente para outra instituição.",
    teaser: "Leve o seu consignado para outra instituição.",
    mechanism:
      "Portabilidade não é um empréstimo novo: o contrato que você já tem é transferido para outra instituição, que pode oferecer condições diferentes.",
    heroTitle: "Já tem consignado? Vamos ver se faz sentido transferir o seu contrato.",
    heroLead:
      "A portabilidade muda a instituição do contrato existente. Não é dinheiro novo. Você informa o contrato atual e a equipe compara as condições com você.",
    seoTitle: "Portabilidade de consignado INSS",
    seoDescription:
      "Entenda a portabilidade de consignado INSS, a diferença em relação a um empréstimo novo e como comparar condições com o atendimento da CredFlex.",
    forWhom: [pending("Aposentados e pensionistas com contrato de consignado INSS ativo.")],
    steps: [
      { title: "Você descreve o contrato atual", text: "Quantos contratos tem e com qual tipo de desconto." },
      { title: "Comparamos as condições", text: "A equipe verifica se há proposta com condições diferentes." },
      { title: "Você decide com números na mão", text: "Taxa e CET do contrato atual e da proposta, lado a lado." },
      { title: "Transferência do contrato", text: "A instituição parceira conduz a portabilidade junto ao banco atual." },
    ],
    requirements: [
      pending("Contrato de consignado ativo."),
      pending("Quantidade mínima de parcelas pagas pode ser exigida.", "Varia por instituição — não informar até confirmar."),
    ],
    documents: [pending("Documento de identificação com foto."), pending("Extrato de empréstimos do benefício.")],
    restrictions: [
      pending("A portabilidade não libera, por si só, valor adicional."),
      pending("O banco de origem pode apresentar contraproposta."),
    ],
    faq: [
      {
        q: "Portabilidade é a mesma coisa que refinanciamento?",
        a: "Não. Na portabilidade o contrato muda de instituição. Refinanciamento é renegociar o contrato com a mesma instituição.",
        status: "pending",
      },
    ],
    ctaLabel: "Consultar portabilidade",
  },

  "servidor-publico": {
    slug: "servidor-publico",
    name: "Consignado Servidor Público",
    shortName: "Servidor",
    status: "active",
    tier: "primary",
    layout: "public",
    audience: "Servidores públicos",
    summary: "Consignado para servidores de órgãos conveniados.",
    teaser: "Para servidores de órgãos conveniados.",
    mechanism:
      "As parcelas são descontadas na folha do órgão. A disponibilidade depende de convênio entre o seu órgão e a instituição parceira.",
    heroTitle: "Servidor público: o primeiro passo é saber se o seu órgão é conveniado.",
    heroLead:
      "Informe a esfera e o órgão em que você trabalha. Verificamos os convênios disponíveis antes de falar em valores.",
    seoTitle: "Consignado para servidor público",
    seoDescription:
      "Consignado para servidores municipais, estaduais e federais de órgãos conveniados. Inicie a pré-análise com a CredFlex.",
    forWhom: [pending("Servidores ativos de órgãos com convênio vigente."), pending("Aposentados de regimes próprios, conforme convênio.")],
    steps: [
      { title: "Esfera e órgão", text: "Federal, estadual ou municipal, e o nome do órgão." },
      { title: "Verificação de convênio", text: "Checamos se há convênio ativo com instituições parceiras." },
      { title: "Proposta por escrito", text: "Com taxa, prazo e CET." },
      { title: "Averbação e contratação", text: "O desconto é registrado na folha do órgão." },
    ],
    requirements: [pending("Órgão com convênio ativo.", "Lista de convênios a fornecer pela CredFlex."), pending("Margem consignável disponível.")],
    documents: [pending("Documento de identificação com foto."), pending("Contracheque recente.")],
    restrictions: [conditionsNote],
    faq: [
      {
        q: "Atendem servidores do Estado de São Paulo?",
        a: "O site anterior tinha uma página específica para servidores de SP. A lista atual de convênios está em confirmação.",
        status: "pending",
      },
    ],
    ctaLabel: "Verificar meu órgão",
  },

  "antecipacao-fgts": {
    slug: "antecipacao-fgts",
    name: "Antecipação do Saque-Aniversário FGTS",
    shortName: "FGTS",
    status: "active",
    tier: "complementary",
    layout: "fgts",
    audience: "Quem tem saldo no FGTS",
    summary: "Antecipar parcelas do saque-aniversário do FGTS.",
    teaser: "Antecipe o seu saque-aniversário.",
    mechanism:
      "Você recebe antecipadamente valores do saque-aniversário. As parcelas são pagas com o próprio saldo do FGTS, nas datas de aniversário.",
    heroTitle: "Saque-aniversário do FGTS: entenda as regras antes de antecipar.",
    heroLead:
      "Essa modalidade tem regras específicas e que mudam com frequência. Começamos pelas perguntas certas, para você não perder tempo.",
    seoTitle: "Antecipação do saque-aniversário FGTS",
    seoDescription:
      "Como funciona a antecipação do saque-aniversário do FGTS, quais autorizações são necessárias e o que considerar antes de contratar.",
    forWhom: [pending("Trabalhadores com saldo em conta do FGTS que optaram pelo saque-aniversário.")],
    steps: [
      { title: "Situação no FGTS", text: "Se você já aderiu ao saque-aniversário e autorizou instituições." },
      { title: "Orientação passo a passo", text: "Explicamos as autorizações necessárias no app FGTS." },
      { title: "Proposta por escrito", text: "Valor antecipado, custos e CET." },
      { title: "Contratação com o parceiro", text: "O saldo antecipado fica bloqueado como garantia." },
    ],
    requirements: [
      pending("Adesão ao saque-aniversário.", "Prazos de carência e limites vigentes a validar — regras mudaram recentemente."),
      pending("Autorização da instituição no aplicativo FGTS."),
    ],
    documents: [pending("Documento de identificação com foto.")],
    restrictions: [
      pending("Quem adere ao saque-aniversário deixa de sacar o saldo integral em caso de demissão sem justa causa, conforme regras do FGTS."),
      conditionsNote,
    ],
    faq: [
      {
        q: "Posso voltar para o saque-rescisão?",
        a: "As regras de retorno e carência são definidas pela Caixa e pela legislação do FGTS. Confirme na pré-análise.",
        status: "pending",
      },
    ],
    ctaLabel: "Consultar opções FGTS",
  },

  "emprestimo-conta-de-luz": {
    slug: "emprestimo-conta-de-luz",
    name: "Crédito na Conta de Luz",
    shortName: "Conta de luz",
    status: "active",
    tier: "complementary",
    layout: "energy",
    audience: "Titulares de conta de energia",
    summary: "Crédito com parcelas cobradas na fatura de energia.",
    teaser: "Parcelas na fatura de energia.",
    mechanism:
      "As parcelas vêm junto com a fatura de energia elétrica. A disponibilidade depende da distribuidora da sua região.",
    heroTitle: "Crédito com a parcela na conta de luz, para quem é titular da fatura.",
    heroLead:
      "Uma alternativa que não depende de vínculo de emprego. Primeiro verificamos se a distribuidora da sua cidade participa.",
    seoTitle: "Empréstimo na conta de luz",
    seoDescription:
      "Entenda o crédito com parcelas na fatura de energia: titularidade, distribuidoras participantes e como iniciar uma pré-análise.",
    forWhom: [pending("Titulares da conta de energia em distribuidoras participantes.")],
    steps: [
      { title: "Titularidade e cidade", text: "Se a conta está no seu nome e qual a sua cidade." },
      { title: "Verificamos a distribuidora", text: "Nem todas as regiões participam." },
      { title: "Proposta por escrito", text: "Valor, parcela, prazo e CET." },
      { title: "Parcelas na fatura", text: "O valor passa a constar na conta de luz." },
    ],
    requirements: [
      pending("Ser titular da conta de energia.", "Tempo mínimo de titularidade e situação de pagamento a confirmar."),
      pending("Distribuidora participante."),
    ],
    documents: [pending("Documento de identificação com foto."), pending("Fatura de energia recente.")],
    restrictions: [pending("O atraso da fatura pode implicar encargos sobre a parcela e o serviço de energia, conforme contrato."), conditionsNote],
    faq: [
      {
        q: "Quais distribuidoras participam?",
        a: "A lista de distribuidoras está em confirmação com a instituição parceira.",
        status: "pending",
      },
    ],
    ctaLabel: "Verificar minha região",
  },

  "bpc-loas": {
    slug: "bpc-loas",
    name: "BPC/LOAS",
    shortName: "BPC/LOAS",
    status: "conditional",
    tier: "complementary",
    layout: "internal",
    audience: "Beneficiários do BPC/LOAS",
    summary: "Modalidade em validação de oferta e elegibilidade.",
    teaser: "Modalidade em validação.",
    mechanism: "Estrutura interna. Não publicar sem validação de oferta, elegibilidade, condições e revisão jurídica.",
    heroTitle: "BPC/LOAS",
    heroLead: "Página em preparação. As condições desta modalidade ainda não foram validadas.",
    seoTitle: "BPC/LOAS",
    seoDescription: "Página interna em validação.",
    forWhom: [pending("Beneficiários do Benefício de Prestação Continuada.", "Elegibilidade a validar.")],
    steps: [],
    requirements: [],
    documents: [],
    restrictions: [pending("Benefício assistencial com regras próprias; não confundir com aposentadoria do INSS.")],
    faq: [],
    ctaLabel: "Falar com a equipe",
  },

  "credito-pessoal": {
    slug: "credito-pessoal",
    name: "Crédito Pessoal",
    shortName: "Pessoal",
    status: "conditional",
    tier: "complementary",
    layout: "internal",
    audience: "A definir",
    summary: "Modalidade em validação de oferta.",
    teaser: "Modalidade em validação.",
    mechanism: "Estrutura interna. Não publicar sem validação de oferta, elegibilidade e condições.",
    heroTitle: "Crédito Pessoal",
    heroLead: "Página em preparação. As condições desta modalidade ainda não foram validadas.",
    seoTitle: "Crédito Pessoal",
    seoDescription: "Página interna em validação.",
    forWhom: [],
    steps: [],
    requirements: [],
    documents: [],
    restrictions: [],
    faq: [],
    ctaLabel: "Falar com a equipe",
  },
};

export const allProducts = Object.values(products);
export const activeProducts = allProducts.filter((p) => p.status === "active");
export const primaryProducts = activeProducts.filter((p) => p.tier === "primary");
export const complementaryProducts = activeProducts.filter((p) => p.tier === "complementary");

export function isProductSlug(v: unknown): v is ProductSlug {
  return typeof v === "string" && v in products;
}
