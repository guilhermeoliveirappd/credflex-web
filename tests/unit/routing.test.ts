import { describe, expect, it } from "vitest";
import { flows } from "@/lib/prequal/flows";
import { collectFlags, decideRoute } from "@/lib/prequal/routing";

describe("decideRoute", () => {
  it("BPC/LOAS nunca segue como consignado INSS (regressão da auditoria)", () => {
    const d = decideRoute("consignado-inss", { tipoBeneficio: "bpc-loas", objetivo: "novo" });
    expect(d).toEqual({ kind: "human-review", product: "bpc-loas", reason: "bpc-loas" });
  });

  it("BPC/LOAS prevalece mesmo se o usuário pedir portabilidade", () => {
    const d = decideRoute("consignado-inss", { tipoBeneficio: "bpc-loas", objetivo: "portabilidade" });
    expect(d.kind).toBe("human-review");
  });

  it("aposentadoria + crédito novo continua no INSS", () => {
    expect(decideRoute("consignado-inss", { tipoBeneficio: "aposentadoria", objetivo: "novo" })).toEqual({ kind: "continue", product: "consignado-inss" });
  });

  it("INSS + portabilidade desvia para portabilidade-inss", () => {
    expect(decideRoute("consignado-inss", { tipoBeneficio: "pensao", objetivo: "portabilidade" })).toMatchObject({ kind: "switch", to: "portabilidade-inss" });
  });

  it("CLT que é servidor público desvia para servidor-publico", () => {
    expect(decideRoute("consignado-clt", { tipoVinculo: "publico" })).toMatchObject({ kind: "switch", to: "servidor-publico" });
  });

  it("regras não validadas nunca classificam como inelegível", () => {
    for (const flow of Object.values(flows)) {
      for (const q of flow!.questions) {
        if (q.kind !== "choice") continue;
        for (const o of q.options) {
          const d = decideRoute(flow!.product, { [q.id]: o.value });
          if (!o.validated) expect(d.kind).not.toBe("ineligible");
        }
      }
    }
  });

  it("modalidade sem fluxo vai para atendimento humano", () => {
    expect(decideRoute("credito-pessoal", {}).kind).toBe("human-review");
  });

  it("coleta flags internas", () => {
    expect(collectFlags("consignado-clt", { tipoVinculo: "domestico", tempoVinculo: "menos-3m" })).toEqual(["regras-domestico-a-confirmar", "tempo-curto"]);
  });
});

describe("configuração", () => {
  it("BPC/LOAS e Crédito Pessoal não têm fluxo público próprio", () => {
    expect(flows["bpc-loas"]).toBeUndefined();
    expect(flows["credito-pessoal"]).toBeUndefined();
  });
});
