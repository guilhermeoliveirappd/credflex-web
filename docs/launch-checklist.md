# Checklist de lançamento

Nada abaixo foi validado pela CredFlex. Itens **[BLOQUEANTE]** impedem a publicação.

## Institucional e jurídico
- [ ] **[BLOQUEANTE]** Razão social e CNPJ oficiais (a auditoria aponta inconsistência) → `site.legal`
- [ ] **[BLOQUEANTE]** Lista de instituições parceiras e redação do papel de correspondente (Res. CMN 4.935/2021) → `roleFacts`, rodapé, Transparência
- [x] Canais oficiais: WhatsApp (18) 98160-5017 e atendimento@credflexfinanceira.com.br (informados em 31/10/2026) → `site.channels`
- [ ] Telefone fixo completo (recebido incompleto: "(18) 3529-2…") → `NEXT_PUBLIC_PHONE_NUMBER`
- [ ] **[BLOQUEANTE]** Políticas de privacidade, cookies e termos revisadas pelo jurídico; remover `draft` de `LegalDocument`
- [ ] **[BLOQUEANTE]** Encarregado(a)/DPO e canal de direitos do titular
- [ ] Texto e versão do consentimento de contato/marketing aprovados (`CONSENT_TEXT_VERSION`)
- [ ] Mensagem antifraude validada
- [ ] Ano de fundação (2017) e marcos da linha do tempo
- [x] Endereço: Rua Fernando Costa, 495, Centro, Osvaldo Cruz – SP, CEP 17700-000 → `site.location`
- [ ] Horário de atendimento → `site.location.openingHours`
- [ ] Base legal para atribuição de UTMs ao lead

## Comercial / produtos
- [ ] **[BLOQUEANTE]** Revisar cada `Fact` com status `pending` em `src/content/products.ts` (requisitos, documentos, restrições, FAQ) e marcar como `confirmed` ou remover
- [ ] Confirmar que todas as 6 modalidades ativas são de fato oferecidas hoje
- [ ] Convênios de servidor público, distribuidoras da conta de luz e regras vigentes do FGTS
- [ ] Decidir sobre BPC/LOAS e Crédito Pessoal (oferta, elegibilidade, condições). Até lá, manter `conditional`
- [ ] Validar as perguntas dos fluxos com o time de atendimento; marcar como `validated` só as regras de inelegibilidade aprovadas
- [ ] Simulação numérica: somente com tabelas vigentes + aprovação jurídica

## Fotografia
- [ ] **Foto da fachada** (não recebida nesta sessão) e foto de atendimento → `public/images/institucional/` + `src/content/photos.ts` (instruções em `public/images/institucional/LEIA-ME.txt`)
- [ ] Demais fotos reais com termo de autorização de imagem (atendimento INSS na página do produto)
- [x] HEX oficiais aplicados: roxo `#0A0C3C`, amarelo `#FCAA06`
- [ ] Logotipo em vetor original (AI/SVG) para substituir a vetorização do PNG; validar a versão horizontal com o manual de marca

## Técnico
- [ ] **[BLOQUEANTE]** `LEAD_ADAPTER=webhook` + `CRM_WEBHOOK_URL` + `CRM_WEBHOOK_SECRET`; testar com lead de teste marcado no CRM (sem dados reais)
- [ ] **[BLOQUEANTE]** `ALLOW_DEV_ADAPTER` **ausente** no ambiente de produção
- [ ] `NEXT_PUBLIC_SITE_URL` com o domínio final; `NEXT_PUBLIC_ALLOW_INDEXING=true` somente na produção
- [ ] `RATE_LIMIT_SALT` aleatório; rate limit compartilhado se o deploy for serverless com várias instâncias
- [ ] GTM: container com Consent Mode v2; tags de GA4/mídia condicionadas ao consentimento; conversão `generate_lead` configurada
- [ ] Armazenamento de currículos (ou desativar a página)
- [ ] `npm run lint && npm test && npm run build && npm run test:e2e` verdes
- [ ] Lighthouse mobile ≥ 90 nas páginas-chave no domínio final (com CDN)
- [ ] Teste manual com leitor de tela (NVDA/VoiceOver) e navegação por teclado no wizard
- [ ] Teste em aparelho Android modesto real

## Mapa
- [ ] Conferir em produção se o marcador do Google Maps cai exatamente na Rua Fernando Costa, 495. A busca usa "CredFlex, Rua Fernando Costa, 495, Centro, Osvaldo Cruz - SP, 17700-000"; o google.com estava bloqueado no ambiente de desenvolvimento, então isso não pôde ser verificado lá. Se houver um Perfil da Empresa no Google, trocar a busca pelo `place_id` ou pela URL de incorporação oficial do perfil.
- [ ] Classificação do mapa (conteúdo de terceiros) na Política de Cookies

## Migração
- [ ] **[BLOQUEANTE]** Levantar URLs de destino de campanhas ativas (Meta, Google Ads, QR codes, bio do Instagram, links de WhatsApp) e garantir redirect para cada uma
- [ ] Conferir os 9 redirects 301 em produção
- [ ] Enviar o sitemap ao Search Console; monitorar erros 404 por 30 dias
- [ ] Remover do domínio scripts/pixels legados não autorizados
- [ ] Atualizar o Perfil da Empresa no Google com os dados confirmados
