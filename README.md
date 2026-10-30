# CredFlex — novo website

Reconstrução do site da CredFlex: Next.js 16 (App Router), TypeScript, Tailwind CSS 4, React Hook Form + Zod, Vitest e Playwright.

> **Estado:** primeira entrega de desenvolvimento. Todo o conteúdo comercial, institucional e jurídico está **pendente de validação** (veja `docs/launch-checklist.md`). Não publique sem cumprir os itens bloqueantes.

## Requisitos
- Node.js 22+
- npm 10+

## Instalação e execução
```bash
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
```
Em desenvolvimento os leads vão para um adaptador em memória (nada sai da máquina) e as etiquetas "A validar" ficam visíveis.

## Testes
```bash
npm run lint         # TypeScript
npm test             # Vitest: regras de fluxo, schemas, serviço de leads, analytics, consentimento
npm run build
npm run test:e2e     # Playwright (desktop 1440 + mobile 360) contra `next start` na porta 3100
```
Os testes E2E usam o adaptador de desenvolvimento (`ALLOW_DEV_ADAPTER=true`, definido só no `playwright.config.ts`). Nenhum lead real é criado.

Capturas visuais: `npm run screenshots -- http://localhost:3000 screenshots / /simulacao` (variáveis `WIDTHS=360,768,1440` e `FULL=0`).

## Estrutura
Veja `docs/site-architecture.md`. Em resumo:
- **Conteúdo e configuração:** `src/content/` (modalidades, dados institucionais, perfis, FAQ, redirects)
- **Regras da pré-análise:** `src/lib/prequal/`
- **Leads, CRM e WhatsApp:** `src/lib/leads/`
- **Componentes:** `src/components/`

## Documentação
| Documento | Conteúdo |
|---|---|
| `docs/design-research.md` | Pesquisa (e suas limitações), direções e justificativa |
| `docs/design-system.md` | Tokens, tipografia, assinatura gráfica, componentes |
| `docs/site-architecture.md` | Mapa de páginas, navegação, SEO, redirects |
| `docs/conversion-flow.md` | Wizard, regras, dados, encaminhamento |
| `docs/integrations.md` | CRM, WhatsApp, analytics, consentimento, CMS |
| `docs/audit-traceability.md` | Achados da auditoria × implementação + medições |
| `docs/launch-checklist.md` | O que falta para publicar |

## Deploy
Compatível com Vercel (ou qualquer host Node). Configure as variáveis do `.env.example`. **Não faça deploy público sem autorização** e sem os itens bloqueantes do checklist.
