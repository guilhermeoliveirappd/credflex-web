# Matriz de rastreabilidade — auditoria × implementação

> ⚠️ **Base desta matriz:** o arquivo `auditoria-credflex.md` **não estava disponível** (não existia no workspace nem no Google Drive conectado). As linhas abaixo partem dos achados da auditoria **conforme citados no briefing do projeto**, e não do documento original. Quando o arquivo for disponibilizado, esta matriz deve ser revisada seção por seção (UX/UI, comercial, formulários, funcionais, arquitetura, direção criativa, requisitos, handoff, dependências).

Legenda: ✅ implementado e testado · 🟡 implementado, depende de validação/configuração externa · ⏳ pendente (bloqueado por informação)

| # | Achado (citado no briefing) | Resposta implementada | Evidência | Estado |
|---|---|---|---|---|
| 1 | Simulador não calcula propostas e descarta informações | Wizard nativo com dados preservados entre etapas, rascunho em sessão, revisão, envio ao backend com protocolo; sem números fictícios | `components/wizard/*`, `lib/leads/service.ts`; E2E "fluxo completo CLT" | ✅ |
| 1a | Encaminhamento incorreto BPC × INSS | BPC/LOAS vai para atendimento humano; o servidor recalcula a rota | `lib/prequal/routing.ts`; testes unitários + E2E | ✅ |
| 1b | Simulação numérica | Arquitetura preparada (ver conversion-flow.md); não habilitada sem tabelas e aprovação jurídica | — | ⏳ |
| 2 | Páginas comerciais isoladas e duplicadas | Uma rota por modalidade a partir de configuração central; 301 das URLs antigas | `content/products.ts`, `content/redirects.ts`; E2E redirects | ✅ |
| 3 | Falta de segmentação entre públicos | Seletor de perfil (home), fluxos por modalidade, desvios contextuais (CLT→Servidor, INSS→Portabilidade) | `ProfileSelector`, `flows.ts` | ✅ |
| 4 | Inconsistência visual entre produtos | Design system único com variações de composição por modalidade (`layout`) | `design-system.md`, `HeroVisual.tsx` | ✅ |
| 5 | Performance e responsividade | SSG, fontes locais, CSS-only motion, sem iframes; testado em 360/390/768/1024/1440/1920 sem overflow | Lighthouse lab (abaixo); E2E overflow | 🟡 (falta medição de campo) |
| 6 | Comunicação comercial exige revisão regulatória | Nenhuma taxa/prazo/promessa; todo `Fact` comercial marcado `pending`; marcadores "A validar" | `content/*`, `ReviewMark` | 🟡 |
| 7 | Falhas no gerenciamento de consentimento | Banner Aceitar/Recusar/Configurar, categorias, revisão pelo rodapé, Consent Mode v2, GTM só após consentimento | `CookieConsent.tsx`; E2E consentimento | ✅ |
| 8 | SEO estrutural inadequado | H1 único, metadados, canonical, OG, JSON-LD só com dados confirmados, sitemap filtrado, noindex, 404 útil | `lib/seo`, `sitemap.ts`; E2E | ✅ |
| 9 | Integração comercial fragmentada | Adaptador único de leads (webhook HMAC), protocolo, idempotência, WhatsApp com contexto sem PII | `lib/leads/*`; testes | 🟡 (CRM/WhatsApp não configurados) |
| 10 | Subaproveitamento de imagens reais | Composições construídas em torno de `PhotoSlot` com especificação de cada foto; sem banco de imagens | `PhotoSlot.tsx`, home/quem-somos | ⏳ (originais não acessíveis) |
| — | Números divergentes no site antigo | Nenhum número usado; canal oficial único via variável de ambiente | `content/site.ts` | ⏳ |
| — | Razão social inconsistente | Não publicada; rodapé indica pendência | `Footer.tsx` | ⏳ |
| — | Scripts desconhecidos no site antigo | Nenhum script de terceiros incorporado | `layout.tsx` | ✅ |
| — | Página de obrigado contada como lead | Conversão só após 2xx da API; acesso direto não converte | E2E "acesso direto a /obrigado" | ✅ |
| — | CPF/PII em URL ou analytics | Sem CPF; allowlist + filtro anti-PII; rascunho sem contato | `analytics/events.ts`; testes | ✅ |
| — | BPC/LOAS e Crédito Pessoal sem validação | Rotas condicionais: noindex, fora do menu/sitemap/seletor, sem jornada | E2E noindex/sitemap/menu | ✅ |
| — | Antifraude | Faixa superior, página Segurança, aviso no wizard e em produto | `AntiFraudBar`, `/seguranca` | 🟡 (mensagem a validar) |
| — | Upload de currículos | Validação por assinatura PDF, 5 MB, rate limit, consentimento; sem armazenamento até configurar | `api/carreiras`; testes | 🟡 |

## Medições (laboratório, não campo)
Lighthouse 12, perfil mobile padrão, build de produção local (`next start`), sem CDN:

| Página | Perf | A11y | BP | SEO* | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| `/` | 97 | 100 | 100 | 66 | 2,5 s | 70 ms | 0 |
| `/consignado-clt` | 96 | 100 | 100 | 66 | 2,8 s | 60 ms | 0 |
| `/consignado-inss` (1ª medição) | 94 | 100 | 96 | 66 | 2,9 s | 140 ms | 0 |
| `/simulacao` (1ª medição) | 92 | 100 | 93 | 66 | 3,2 s | 120 ms | 0 |

\* O SEO em 66 é **intencional**: o robots bloqueia a indexação até `NEXT_PUBLIC_ALLOW_INDEXING=true`. A única falha é `is-crawlable`.
As metas de campo (p75 de LCP ≤ 2,5 s, INP ≤ 200 ms) só podem ser verificadas com dados reais (CrUX/RUM) após a publicação. Os valores de laboratório variam entre execuções.
