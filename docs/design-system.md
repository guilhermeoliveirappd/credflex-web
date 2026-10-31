# Design system — CredFlex (provisório)

> **Não há manual de marca disponível.** Cores e monograma são **provisórios**: preservam o território navy + amarelo e o monograma CF, mas devem ser substituídos pelos valores e vetores oficiais. Fonte: `src/app/globals.css` (`@theme`).

## Princípios
1. **Intenção, não decoração.** Nada de gradientes, blobs ou glassmorphism; cada elemento gráfico tem função.
2. **Honestidade visível.** Nenhuma informação comercial inventada. Conteúdo pendente é marcado em ambientes de revisão.
3. **Legível para todos.** O corpo do texto tem 17 px, as áreas de toque têm no mínimo 44 px (botões com 52 px) e o contraste é AA.
4. **Performance acima de efeito.** O movimento é feito só com CSS e respeita `prefers-reduced-motion`.

## Cores oficiais

| Cor | HEX | Fonte | Token |
|---|---|---|---|
| Roxo | `#0A0C3C` | Informado pela CredFlex (31/10/2026) | `--color-brand` (= `brand-900`) |
| Amarelo | `#FCAA06` | Informado pela CredFlex e **conferido no arquivo do logotipo**: é a cor dominante dos pixels do PNG oficial | `--color-accent` (= `accent-400`) |
| Branco | `#FFFFFF` | Superfície de conteúdo | `--color-paper` |

As escalas `brand-100…950` e `accent-100…600` são **derivadas** das duas bases com `color-mix(in oklab, …)`. Elas não são cores oficiais adicionais, e sim tons de apoio para hover, bordas, textos secundários e estados.

### Contraste (WCAG 2.2)

| Combinação | Razão aproximada | Uso |
|---|---|---|
| Roxo `#0A0C3C` sobre amarelo `#FCAA06` | ~10:1 (AAA) | Títulos, texto e botão `btn-brand` nas seções amarelas |
| Branco sobre roxo | ~18:1 (AAA) | Títulos e texto nas seções roxas |
| Amarelo sobre roxo | ~10:1 (AAA) | Logo, links, botão primário e destaques nas seções roxas |
| `ink-2` sobre branco/amarelo | > 6:1 (AA) | Texto de corpo |
| Amarelo sobre branco | ~1,9:1 ✗ | **Proibido** para texto e logo. Por isso o header é roxo |

## Logotipo
- O vetor foi gerado a partir do PNG oficial enviado (1920×1080) com potrace. A fidelidade medida contra o original foi IoU 99,56%. Os paths estão em `src/components/brand/logo-paths.ts` e a cor é herdada de `currentColor`.
- A **versão horizontal** (símbolo à esquerda do logotipo), usada no header, mobile e rodapé, foi derivada da versão vertical oficial. **Validar com o manual de marca.** Substitua os paths pelo AI/SVG original quando ele estiver disponível.
- O favicon (`src/app/icon.svg`) é o símbolo amarelo sobre um quadrado roxo.

## Superfícies e ritmo

| Superfície | Token | Uso | Texto |
|---|---|---|---|
| Amarelo | `bg-accent-400` | Hero da home e dos produtos, Como funciona, comparação de portabilidade, FAQ de produto, CTA final, canais oficiais, 404 | `brand-950` / `ink-2`; botão primário `btn-brand` |
| Marca (roxo) | `bg-brand-900` / `brand-950` | Seletor de perfil, Quem está por trás, Localização, etapas do produto, princípios, heros de Portabilidade/Servidor/Segurança/legais, rodapé | `white` / `brand-100`; botão `btn-primary` (amarelo) |
| Branco | `bg-white` (`paper`) | Modalidades, Transparência, FAQ da home, conteúdo de produto, pré-análise, formulários, documentos legais | `ink` / `ink-2` |

Regras:
- Nunca há duas seções seguidas com a mesma superfície.
- O amarelo nunca é usado como texto sobre o branco.
- O foco é escuro (`brand-700`) em superfícies claras ou amarelas e amarelo nas superfícies da marca.
- Cinza `stone` não é usado sobre o amarelo (contraste insuficiente).

**Sequência da home:** amarelo → marca → branco → marca → amarelo → branco → marca → branco → amarelo → marca (rodapé).

## Tokens neutros e de estado

| Token | Hex | Uso |
|---|---|---|
| `paper` | `#ffffff` | Superfície de conteúdo |
| `paper-2` | `#f5f5f3` | Cartões sobre o branco |
| `sand` / `sand-600` | `#e5e4e0` / `#c6c4bd` | Bordas |
| `stone` | `#5f5e5a` | Texto secundário (somente sobre o branco) |
| `ink` / `ink-2` | `#121318` / `#383a42` | Texto |
| `ok`, `warn`, `error`, `info` (+ `-bg`) | | Estados |

## Rótulos acima dos títulos
Eyebrows e categorias acima das headlines foram **removidos**. Rótulos funcionais permanecem: títulos das colunas do rodapé, grupos do menu, o rótulo "Seu protocolo" e as legendas internas dos diagramas.

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

- **Símbolo oficial** (`Monogram`, `Logo`): vetor do logotipo enviado pela CredFlex.
- **O traço** (`CFPath`): contorno em linha fina do símbolo oficial, usado em grande escala e recortado. Aparece no hero (envolvendo a foto, com animação de desenho), no PageHero, no CTA final e na 404.
- **Barras do F** (`.fbars`, `.fbars-brand` sobre o amarelo), inclinadas a −17° como o F do símbolo oficial: indicam o estado ativo do menu móvel, marcam cartões e formam a base do indicador de progresso do wizard.
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
