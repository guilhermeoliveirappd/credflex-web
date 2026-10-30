# Arquitetura do site

## Mapa de páginas

| Rota | Tipo | Renderização | Índice | Menu |
|---|---|---|---|---|
| `/` | Home | SSG | sim | — |
| `/consignado-clt` | Produto (layout `payroll`) | SSG | sim | Principais |
| `/consignado-inss` | Produto (`benefit`) | SSG | sim | Principais |
| `/portabilidade-inss` | Produto (`portability`) | SSG | sim | Principais |
| `/servidor-publico` | Produto (`public`) | SSG | sim | Principais |
| `/antecipacao-fgts` | Produto (`fgts`) | SSG | sim | Outras |
| `/emprestimo-conta-de-luz` | Produto (`energy`) | SSG | sim | Outras |
| `/bpc-loas` | **Condicional** | SSG | **noindex** | não |
| `/credito-pessoal` | **Condicional** | SSG | **noindex** | não |
| `/simulacao` | Pré-análise | SSR (lê `?modalidade=`) | sim | CTA |
| `/obrigado` | Confirmação | SSG + cliente | **noindex** | não |
| `/quem-somos`, `/seguranca`, `/contato`, `/ajuda`, `/trabalhe-conosco` | Institucional | SSG | sim | Principal / rodapé |
| `/politica-de-privacidade`, `/politica-de-cookies`, `/termos-de-uso` | Legal (rascunho) | SSG | sim | Rodapé |
| 404 | Útil, com links para as modalidades | — | — | — |
| `/api/leads`, `/api/carreiras` | API | Node | bloqueado no robots | — |

Todas as modalidades vêm de `src/content/products.ts`. Para publicar BPC/LOAS ou Crédito Pessoal, basta mudar `status` para `active` e criar o fluxo em `src/lib/prequal/flows.ts`, depois de cumprir o checklist. Feito isso, a página entra automaticamente no menu, no sitemap e no seletor de modalidades.

## Organização do código

```
src/
  app/                 rotas (App Router), sitemap, robots, API
  content/             conteúdo e configuração central (produtos, site, perfis, FAQ, redirects)
  lib/prequal/         regras de fluxo, roteamento, schemas (compartilhados cliente/servidor)
  lib/leads/           serviço de leads, adaptadores de CRM, WhatsApp
  lib/analytics/       eventos, guarda anti-PII, UTMs
  lib/privacy/         consentimento e Consent Mode v2
  lib/security/        rate limiting
  lib/seo/             metadados e JSON-LD
  components/          layout, brand, home, product, wizard, privacy, ui
```

O conteúdo fica separado da apresentação, e as regras de negócio ficam separadas das integrações. Só componentes interativos são Client Components: Header, ProfileSelector, wizard, consentimento, WhatsApp e rastreador de CTA. Todo o resto é Server Component estático.

## Navegação
- **Desktop:** dropdown "Modalidades" agrupado em *Principais* e *Outras*, cada item com o público-alvo, e um atalho "Não sabe qual escolher?". Fecha com Esc e com clique fora, e marca a página atual com `aria-current`.
- **Mobile:** painel em tela cheia (`role=dialog`) com foco preso, trava de rolagem, Esc para fechar e CTA fixo no rodapé do painel.
- **Header** sticky, com sombra só após a rolagem.

## SEO
- Um H1 por página, verificado no E2E.
- Metadados, canonical e Open Graph individuais (`lib/seo/metadata.tsx`).
- JSON-LD: `FinancialService` emite só os campos confirmados; `BreadcrumbList` aparece em todas as páginas internas; `FAQPage` inclui somente perguntas com status `confirmed`.
- O sitemap traz apenas páginas públicas indexáveis (`src/content/routes.ts`).
- O robots bloqueia tudo enquanto `NEXT_PUBLIC_ALLOW_INDEXING` não for `true`, para proteger a homologação. Páginas noindex **não** são bloqueadas no robots, para que o crawler consiga ler a diretiva.
- O SEO local está limitado à cidade. Endereço, horário e telefone só entram no JSON-LD depois de confirmados.

## Redirecionamentos (301)
Definidos em `src/content/redirects.ts` e aplicados em `next.config.ts` com `statusCode: 301` (o `permanent: true` do Next emitiria 308). Todos são verificados no E2E.

**Antes da migração:** confira os destinos usados em campanhas ativas (Meta/Google Ads, links de WhatsApp, QR codes) e acrescente o que faltar.
