import { describe, expect, it } from "vitest";
import { contactSchema, isValidMobile, leadPayloadSchema, maskAmount, maskPhone, parseAmount } from "@/lib/prequal/schema";

const base = {
  idempotencyKey: "6f1c4d55-1d2c-4a8e-9a2b-1f5d3c2b1a00",
  product: "consignado-inss",
  originProduct: "consignado-inss",
  answers: { tipoBeneficio: "aposentadoria", objetivo: "novo" },
  contact: { name: "Maria", whatsapp: "(18) 99999-8888", consentContact: true },
  elapsedMs: 10_000,
};

describe("telefone", () => {
  it.each([
    ["(18) 99999-8888", true],
    ["18999998888", true],
    ["+55 18 99999-8888", true],
    ["(18) 3999-8888", false],
    ["(00) 99999-8888", false],
    ["(18) 99999-999", false],
    ["(11) 99999-9999", false],
  ])("%s → %s", (v, ok) => expect(isValidMobile(v)).toBe(ok));

  it("máscara progressiva", () => {
    expect(maskPhone("1")).toBe("(1");
    expect(maskPhone("1899")).toBe("(18) 99");
    expect(maskPhone("18999998888123")).toBe("(18) 99999-8888");
  });
});

it("máscara de valor", () => {
  expect(maskAmount("12500")).toBe("12.500");
  expect(parseAmount("R$ 12.500")).toBe(12500);
  expect(parseAmount("")).toBeNull();
});

describe("contato", () => {
  it("exige consentimento de contato", () => {
    expect(contactSchema.safeParse({ name: "Ana", whatsapp: "18999998888", consentContact: false }).success).toBe(false);
  });
  it("marketing é opcional e falso por padrão", () => {
    const r = contactSchema.parse({ name: "Ana", whatsapp: "18999998888", consentContact: true });
    expect(r.consentMarketing).toBe(false);
  });
  it("rejeita nome com números", () => {
    expect(contactSchema.safeParse({ name: "Ana 123", whatsapp: "18999998888", consentContact: true }).success).toBe(false);
  });
});

describe("payload do lead", () => {
  it("aceita payload válido", () => expect(leadPayloadSchema.safeParse(base).success).toBe(true));
  it("rejeita pergunta desconhecida (ex.: CPF injetado)", () => {
    expect(leadPayloadSchema.safeParse({ ...base, answers: { ...base.answers, cpf: "12345678900" } }).success).toBe(false);
  });
  it("rejeita opção inválida", () => {
    expect(leadPayloadSchema.safeParse({ ...base, answers: { tipoBeneficio: "xyz" } }).success).toBe(false);
  });
  it("rejeita modalidade condicional enviada diretamente", () => {
    expect(leadPayloadSchema.safeParse({ ...base, product: "credito-pessoal" }).success).toBe(false);
  });
  it("aceita respostas do fluxo de origem após desvio", () => {
    const r = leadPayloadSchema.safeParse({
      ...base,
      product: "portabilidade-inss",
      answers: { tipoBeneficio: "pensao", objetivo: "portabilidade", tipoContrato: "inss", quantidadeContratos: "1", tempoContrato: "1-3a" },
    });
    expect(r.success).toBe(true);
  });
});
