# Design system — CredFlex (provisório)

> **Não há manual de marca disponível.** Cores e monograma são **provisórios**: preservam o território navy + amarelo e o monograma CF, mas devem ser substituídos pelos valores e vetores oficiais. Fonte: `src/app/globals.css` (`@theme`).

## Princípios
1. **Intenção, não decoração.** Nada de gradientes, blobs ou glassmorphism; cada elemento gráfico tem função.
2. **Honestidade visível.** Nenhuma informação comercial inventada. Conteúdo pendente é marcado em ambientes de revisão.
3. **Legível para todos.** O corpo do texto tem 17 px, as áreas de toque têm no mínimo 44 px (botões com 52 px) e o contraste é AA.
4. **Performance acima de efeito.** O movimento é feito só com CSS e respeita `prefers-reduced-motion`.

## Cores (tokens)

| Token | Hex | Uso |
|---|---|---|
| `navy-950` | `#081428` | Faixa antifraude, seletor de perfil, rodapé |
| `navy-900` | `#0d1f3c` | Áreas de autoridade, botão secundário |
| `navy-700` | `#1d3d6e` | Links, destaque tipográfico, foco em fundo claro |
| `navy-500/300/100` | | Numerais, textos em fundo escuro, seleção |
| `gold-400` | `#f4b81c` | **Ação principal** e assinatura (barras do F, traço) |
| `gold-300/100` | | Hover, realces e fundo da seção FGTS |
| `paper` | `#f8f5ef` | Superfície principal (off-white quente) |
| `paper-2`, `sand` | | Ritmo entre seções e bordas |
| `stone`, `ink`, `ink-2` | | Textos secundário, principal e de corpo |
| `ok`, `warn`, `error`, `info` (+ `-bg`) | | Estados |

O amarelo nunca é usado como cor de texto sobre fundo claro (contraste insuficiente). Ele aparece só como preenchimento, detalhe ou texto sobre navy.

## Tipografia

- **Display:** Bricolage Grotesque (variável, eixo `opsz`). É calorosa, tem personalidade e se mantém legível em tamanhos grandes.
- **Texto/UI:** Manrope (variável). Tem numerais tabulares para valores (`.t-num`) e funciona bem em formulários.
- As duas são auto-hospedadas via `next/font/local` (`src/fonts`), com `display: swap` e fallback ajustado (sem CLS) e sem requisições externas.

| Classe | Tamanho (fluido 320→1920) | Line-height | Tracking |
|---|---|---|---|
| `.t-display` | 2.6rem → 6.25rem | 0.96 | −0.03em |
| `.t-h1` | 2.25rem → 4.5rem | 1.0 | −0.035em |
| `.t-h2` | 1.9rem → 3.4rem | 1.04 | −0.03em |
| `.t-h3` | 1.3rem → 1.7rem | 1.15 | −0.015em |
| `.t-lead` | 1.125rem → 1.35rem | 1.55 | −0.005em |
| corpo | 1.0625rem | 1.6 | 0 |
| `.t-small` | 0.9375rem | 1.5 | 0 |
| `.t-eyebrow` | 0.78rem caixa-alta, 700 | 1.2 | 0.14em |
| `.t-num` | numerais tabulares/lining | | |

## Assinatura gráfica

- **Monograma provisório** (`Monogram`): um arco do C aberto à direita, com haste e duas barras do F que "saem" pela abertura.
- **O traço** (`CFPath`): o arco do C se desdobra em duas linhas paralelas que funcionam como caminho. Aparece no hero (sobre a foto, com animação de desenho), na 404, no PageHero e no CTA final.
- **Barras do F** (`.fbars`): duas barras douradas de comprimentos diferentes. Marcam eyebrows, indicam o estado ativo do menu móvel e formam a base do indicador de progresso do wizard.
- **Arco de recorte**: as fotos recebem um canto com raio de 35–42%, que ecoa o C.

## Espaçamento e grid
- Container com no máximo 1320 px e gutter fluido de 16 a 40 px (`--gutter`).
- Seções usam `--section-y` (72 a 144 px).
- Grid de 12 colunas com composições assimétricas (7/5, 5/7 e 4/8).
- Raios contidos: 6 px nos controles, 10 px nos cards e 14 px como máximo.

## Movimento
- Hover: setas deslizam 3 px, links ganham sublinhado progressivo e cards sobem 2 px.
- Seletor: barra lateral dourada (scale-y), ícone preenchido e check animado.
- Progresso do wizard: transição de scale-x em 500 ms.
- O H1 e o CTA do hero **não** são animados. Só o traço decorativo é desenhado.
- `prefers-reduced-motion: reduce` zera animações e transições.

## Componentes (responsabilidades → arquivos)

| Responsabilidade | Arquivo |
|---|---|
| AntiFraudBar | `components/layout/AntiFraudBar.tsx` |
| Header + dropdown + MobileNavigation | `components/layout/Header.tsx` |
| Footer | `components/layout/Footer.tsx` |
| SectionHeading / Eyebrow | `components/ui/SectionHeading.tsx` |
| PageHero | `components/ui/PageHero.tsx` |
| Breadcrumbs (+ JSON-LD) | `components/ui/Breadcrumbs.tsx` |
| ProfileSelector | `components/home/ProfileSelector.tsx` |
| ProductCard / ProductShowcase | `components/home/ProductShowcase.tsx` |
| ProductNavigation (menu + "Outras modalidades") | `Header.tsx`, `product/ProductPage.tsx` |
| TrustSection / InstitutionalTimeline | `components/home/TrustSection.tsx` |
| HowItWorks | `components/home/HowItWorks.tsx` |
| TransparencyBlock | `components/home/TransparencyBlock.tsx` |
| FAQAccordion (`<details>`, JSON-LD só do conteúdo confirmado) | `components/ui/FAQAccordion.tsx` |
| LocationSection | `components/home/LocationSection.tsx` |
| OfficialChannelNotice | `components/ui/OfficialChannelNotice.tsx` |
| CreditPrequalificationWizard (EligibilityStep, AmountAndTermStep, ContactStep, revisão, LeadSubmissionStatus) | `components/wizard/CreditPrequalificationWizard.tsx` |
| ProgressIndicator | `components/wizard/ProgressIndicator.tsx` |
| ChoiceGroup (rádios nativos acessíveis) | `components/wizard/ChoiceGroup.tsx` |
| ThankYouExperience | `components/wizard/ThankYouExperience.tsx` |
| WhatsAppCTA | `components/ui/WhatsAppCTA.tsx` |
| CookieConsent / CookiePreferences | `components/privacy/CookieConsent.tsx` |
| PrivacyNotice / documentos legais | `components/privacy/LegalDocument.tsx` |
| PhotoSlot (foto real ou espaço identificado) | `components/brand/PhotoSlot.tsx` |
| ReviewMark / FactText (marcação "A validar") | `components/brand/ReviewMark.tsx` |
| HeroVisual por modalidade | `components/product/HeroVisual.tsx` |

## Marcadores de revisão
`NEXT_PUBLIC_SHOW_REVIEW_MARKERS` controla os marcadores. Em desenvolvimento eles aparecem por padrão; em build de produção ficam ocultos, a menos que a variável seja `true`. Eles mostram:
- etiquetas **"A validar"** em todo `Fact` com status `pending`;
- a legenda "Foto real a receber" com a especificação da foto em cada `PhotoSlot`;
- o estado desabilitado do WhatsApp quando não há número oficial.

Os marcadores ocultos **não** tornam o conteúdo validado: o `launch-checklist.md` exige resolver cada pendência.
