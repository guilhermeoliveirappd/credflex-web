# Fluxo de conversão — pré-análise

## Por que não há simulação numérica
Não existem tabelas de parceiros validadas. Por isso o produto é uma **pré-análise com retorno humano**, e a interface usa rótulos honestos ("Iniciar pré-análise", "Consultar opções"). A página `/simulacao` diz explicitamente: "Isto não é uma simulação de parcelas."

**Para habilitar o cálculo no futuro:** crie `lib/prequal/pricing.ts` com uma interface `PricingProvider` (por modalidade, com tabela versionada e data de vigência). Inclua uma etapa opcional "Resultado estimado" entre *Valor e prazo* e *Contato*, que só renderiza quando houver provider aprovado. Exiba sempre o CET e o aviso de estimativa. Nada disso deve ser implementado antes da aprovação jurídica.

## Etapas

```
Seu perfil → Perguntas da modalidade → Valor e prazo* → Contato → Revisão → POST /api/leads → /obrigado
                    │
                    ├─ desvio sugerido (ex.: INSS+portabilidade → Portabilidade; CLT "sou servidor" → Servidor)
                    └─ atendimento humano (BPC/LOAS) → pula Valor e prazo
* só para modalidades com `amountAndTerm: true` (não se aplica a Portabilidade e FGTS)
```

- `/simulacao?modalidade=<slug>` pula a primeira etapa (é usado pelo seletor e pelas páginas de produto).
- **Progresso** visível, com rótulo textual e `aria-current="step"`. O foco vai para o título de cada etapa.
- **Voltar** preserva todos os dados.
- **Rascunho** em `sessionStorage`, só com as respostas não identificáveis. Nome e WhatsApp nunca são salvos, e o rascunho nunca é restaurado direto na revisão.
- **Validação** em cada etapa (cliente) e de novo no servidor, com as mesmas regras Zod.

## Perguntas por modalidade (`src/lib/prequal/flows.ts`)

| Modalidade | Perguntas |
|---|---|
| CLT | tipo de vínculo (com desvio para Servidor), tempo de vínculo, faixa salarial |
| INSS | tipo de benefício (**BPC/LOAS → atendimento humano**), objetivo (novo × portabilidade) |
| Portabilidade | tipo de contrato, quantidade de contratos, tempo do contrato mais antigo |
| Servidor | esfera, situação, órgão (texto) |
| FGTS | adesão ao saque-aniversário, saldo |
| Conta de luz | titularidade, UF, cidade |

**Regra de elegibilidade:** uma opção só bloqueia a pessoa se tiver `outcome: "ineligible"` **e** `validated: true`. Hoje nenhuma regra está validada, então respostas como "menos de 3 meses de empresa" apenas geram flags (`tempo-curto`) para o atendente e nunca recusam ninguém. Um teste garante isso.

## Correção BPC × INSS (auditoria)
`decideRoute` envia `tipoBeneficio=bpc-loas` para `human-review` com produto `bpc-loas`, nunca para consignado INSS. **O servidor recalcula a rota**, então um cliente adulterado não consegue contornar a regra. Isso está coberto por testes unitários (rota e serviço) e por E2E.

## Dados coletados
- **Nome e WhatsApp:** são o mínimo para retorno, e a finalidade está explicada no formulário.
- **Consentimentos separados:** contato (obrigatório, para esta solicitação) e novidades (opcional, desmarcado por padrão). A versão do texto vai junto (`CONSENT_TEXT_VERSION`).
- **Sem CPF.** O schema rejeita perguntas desconhecidas, então não é possível injetar um CPF nas respostas.

## Proteções do envio
Honeypot, tempo mínimo de 3 s, rate limit (5 a cada 10 min por IP com hash), verificação de mesma origem, limite de 16 KB no corpo e `idempotencyKey` (UUID por sessão de formulário). Um reenvio devolve o mesmo protocolo e não duplica o lead. O botão fica desabilitado durante o envio.

## Estados e erros
`submitting` (spinner, `aria-busy`), `rate_limited`, `unavailable` (503/502), `network`, `invalid` (leva de volta ao contato) e `rejected`. Em todos os casos as respostas são preservadas e há botão para tentar de novo.

## Encaminhamento
1. O backend valida, recalcula a rota e gera o protocolo `CF-XXXX-XXXX`.
2. O adaptador registra o lead no CRM.
3. A resposta devolve protocolo, rota e `whatsappUrl`. O link só existe se `NEXT_PUBLIC_WHATSAPP_NUMBER` estiver configurado.
4. O cliente dispara `generate_lead` (deduplicado por protocolo), salva o recibo na sessão e vai para `/obrigado`.
5. `/obrigado` lê o recibo e mostra protocolo e próximos passos. **O acesso direto não mostra protocolo nem dispara conversão.**

Mensagem do WhatsApp: `"Olá, CredFlex! Fiz uma pré-análise no site. Protocolo: CF-…. Modalidade: …."`. Ela não inclui nome, telefone, CPF nem respostas. O atendente consulta o CRM pelo protocolo.
