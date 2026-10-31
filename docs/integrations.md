# Integrações

| Integração | Estado | Onde |
|---|---|---|
| Registro de leads (CRM) | **Adaptador de webhook pronto, sem destino configurado.** Em desenvolvimento usa adaptador em memória | `src/lib/leads/adapters.ts` |
| WhatsApp oficial | **Pendente:** número não confirmado. O botão fica oculto em produção e desabilitado com aviso em revisão | `NEXT_PUBLIC_WHATSAPP_NUMBER` |
| GA4 / GTM | **Preparado, não configurado.** Só carrega após consentimento | `NEXT_PUBLIC_GTM_ID` |
| Consent Mode v2 | Implementado (default *denied*, update na escolha) | `app/layout.tsx`, `lib/privacy/consent.ts` |
| Pixels de mídia | **Não incluídos.** Devem ser adicionados via GTM, condicionados ao consentimento de publicidade | — |
| Currículos | **Validação pronta, armazenamento não configurado.** Em desenvolvimento o arquivo é validado e descartado; em produção a API devolve 503 | `app/api/carreiras/route.ts` |
| CMS | Não adotado na 1ª entrega (ver abaixo) | `src/content/*` |
| Rate limit | Em memória (uma instância) | `lib/security/rate-limit.ts` |
| Google Maps (embed sem chave) | **Implementado.** Carrega só após clique em "Carregar mapa interativo", automaticamente se houver consentimento de publicidade, ou se o mapa já foi carregado antes neste navegador. Fallback: prévia com endereço e link | `components/home/LocationMap.tsx` |

Nenhuma integração foi validada com credenciais reais. **Nenhum lead real foi criado.**

## CRM via webhook
- `LEAD_ADAPTER=webhook`, `CRM_WEBHOOK_URL` e `CRM_WEBHOOK_SECRET`.
- `POST` com JSON `{ type: "lead.created", lead }` e os cabeçalhos:
  - `x-credflex-timestamp`
  - `x-credflex-signature: sha256=HMAC(secret, "<timestamp>.<body>")`
  - `idempotency-key: <protocolo>`
- **O receptor deve** validar a assinatura com comparação em tempo constante, rejeitar timestamps com mais de 5 minutos e deduplicar pelo `idempotency-key`.
- Timeout de 8 s. Falhas devolvem 502 ao usuário, com opção de tentar de novo, e o lead **não** é dado como registrado.
- Funciona com n8n/Make, RD Station (via automação), HubSpot ou Pipedrive (via middleware). Para escolher, é preciso decidir qual CRM a equipe usa hoje.
- **Garantia de produção:** sem adaptador configurado, ou com o adaptador `dev` em `NODE_ENV=production`, a API responde 503 e nunca simula sucesso. A variável `ALLOW_DEV_ADAPTER=true` existe **somente** para testes E2E locais em build de produção e não deve ser definida em nenhum deploy.

## Analytics: contrato de eventos

| Evento | Quando | Propriedades |
|---|---|---|
| `cta_click` | Clique em CTA (`data-cta` ou explícito) | `cta_id`, `cta_location` |
| `product_select` | Escolha no seletor/wizard | `product`, `cta_location` |
| `sim_start` | Wizard montado | `product?` |
| `sim_step` | Mudança de etapa | `step`, `step_index`, `product` |
| `sim_route_change` | Desvio sugerido ou atendimento humano | `origin_product`, `product`, `route?` |
| `sim_ineligible` | Só com regra validada (nenhuma hoje) | `product` |
| `form_start` | Primeiro foco na etapa de contato | `product` |
| `sim_error` | Falha no envio | `error_kind`, `product` |
| `generate_lead` | **Somente após 2xx com protocolo**, deduplicado | `lead_protocol`, `product`, `route` |
| `sim_complete` | Junto com `generate_lead` | `product`, `route` |
| `whatsapp_click` | Clique no WhatsApp | `cta_location`, `product?`, `lead_protocol?` |

Todos incluem `page_path`. Há uma allowlist de chaves e um filtro de valores com aparência de CPF, telefone ou e-mail (`sanitizeProps`, coberto por testes). Sem consentimento de medição, nada é enviado.

**Status de qualificação no CRM:** use `lead_protocol` como chave de junção para importar conversões offline (GA4 Measurement Protocol ou conversões offline do Google Ads), a partir do CRM.

### Atribuição (UTMs)
UTMs são guardadas em `sessionStorage` **somente com consentimento de medição** e enviadas junto com o lead. *Decisão pendente com o jurídico:* se a atribuição ao lead pode se apoiar em legítimo interesse, independentemente do consentimento de cookies.

## CMS (decisão)
A 1ª entrega não usa CMS: o conteúdo vive em arquivos TypeScript tipados (`src/content`), versionados e revisados por PR, com custo zero e superfície de ataque mínima. Quando a equipe precisar editar sem desenvolvedor, a recomendação é:

1. **Sanity** (free tier, editor visual, GROQ, webhooks de revalidação); ou
2. **Keystatic/TinaCMS** (conteúdo em Git, sem banco, editor visual).

Os tipos `Product`, `Fact` e `FaqItem` já servem de schema. A troca afeta só `src/content/*`.

## Pendências de infraestrutura
- Rate limit compartilhado (Upstash Redis ou Vercel KV) para ambientes serverless com várias instâncias.
- Armazenamento de currículos com criptografia em repouso, retenção definida e antivírus (S3 com SSE + ClamAV, ou e-mail transacional para o RH).
- CSP com nonce, caso seja preciso remover `'unsafe-inline'`. Isso exige renderização dinâmica e tem custo de performance.

## Google Maps: diagnóstico e configuração (v4)

**Causa provável do erro:** para usuários no Brasil, o Google pode redirecionar o embed de `www.google.com` para `www.google.com.br`. A CSP (`frame-src`) só permitia `www.google.com` e `maps.google.com`, então o navegador bloqueava o iframe e mostrava uma página de erro. Os domínios `.com.br` foram adicionados.

**Limitação:** o ambiente de desenvolvimento não acessa o Google, então não foi possível reproduzir o erro nem ver o mapa renderizado aqui. Confirme na prévia da Vercel.

**Origem do mapa**, em ordem de preferência (`LocationMap.tsx`):
1. `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL`: o `src` do iframe em Google Maps › Compartilhar › Incorporar um mapa, a partir do Perfil da Empresa. Garante o marcador exato. **Recomendado.**
2. `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY`: Maps Embed API oficial. É gratuita, exige chave no Google Cloud e deve ser restrita ao domínio.
3. Sem configuração: `maps.google.com/maps?q=<endereço>&output=embed`, sem chave.

**Privacidade:** o mapa carrega com um clique em "Mostrar mapa", automaticamente se houver consentimento de publicidade, ou se a pessoa já o carregou antes. Antes disso aparece um painel com o endereço real, que não imita um mapa. "Abrir no Google Maps" funciona sempre. Se o carregamento passar de 12s, aparece uma orientação para abrir no Google Maps.
