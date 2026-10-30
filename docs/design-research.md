# Pesquisa visual — CredFlex

## 0. Limitação declarada (leia primeiro)

Nesta sessão de desenvolvimento **nenhuma referência pôde ser inspecionada**. A política de rede do ambiente bloqueou todos os domínios externos (o proxy respondeu 403 / `ENOTFOUND`):

| Domínio | Resultado |
|---|---|
| www.credflexfinanceira.com.br | bloqueado |
| www.creditas.com, www.meutudo.com.br | bloqueados |
| wise.com, www.revolut.com, www.mercury.com, www.monzo.com | bloqueados (Wise e Mercury testados; demais não tentados após a orientação do ambiente) |
| stripe.com, linear.app, www.ramp.com | bloqueados (Stripe testado) |

Também **não** foi possível abrir o arquivo `auditoria-credflex.md`: ele não existe no workspace nem no Google Drive conectado.

Por isso, tudo o que está abaixo vem de **conhecimento conceitual prévio** desses produtos. Nada aqui foi observado nesta sessão: não há capturas de tela das referências, e nenhuma afirmação deve ser lida como inspeção atual. Para fazer a pesquisa de verdade, libere esses domínios em *Network access → Allowed domains* nas configurações do ambiente e revisite esta seção.

## 1. Referências (conhecimento conceitual, não inspecionado)

| Referência | Princípio aproveitável | O que não combina com a CredFlex |
|---|---|---|
| Creditas | Organização por *tipo de garantia/perfil* e entrada direta em simulação | Simulação numérica imediata. A CredFlex não tem tabelas validadas, então a interface não pode prometer números |
| meutudo | Segmentação explícita por público (INSS, servidor, CLT, FGTS) e linguagem simples para o público aposentado | Densidade promocional e apelos de "dinheiro rápido" |
| Wise | Transparência de custo como produto: o "quanto custa" é parte da interface | Calculadora como hero exige dados reais |
| Mercury | Tipografia editorial, muito respiro e o aviso regulatório "não somos banco" tratado com naturalidade | Estética fria, sem pessoas, que não serve a uma operação humana do interior |
| Monzo / Revolut | Cor de marca usada como superfície, com tom próximo e direto | Linguagem jovem/urbana, distante do público INSS |
| Stripe / Linear / Ramp | Ritmo entre seções, grid rigoroso, microinterações discretas e tipografia de alta qualidade | Gradientes e efeitos 3D chamativos |

## 2. Oportunidades de diferenciação

1. **Pessoas e lugar reais** (Osvaldo Cruz/SP) em um setor dominado por fintechs sem rosto.
2. **Honestidade como interface**: nenhuma taxa inventada, uma "planilha" de comparação para a pessoa preencher com a proposta real e o checklist "peça por escrito".
3. **Seletor de perfil como produto**: a primeira interação responde "qual é o meu caso?", em vez de empurrar um formulário genérico.
4. **Assinatura gráfica própria**: o traço C→F, em vez de blobs ou gradientes.

## 3. Três direções avaliadas

**A. "Fintech clara"**: fundo branco, azul vivo, cards arredondados e calculadora no hero.
Foi descartada porque reproduz o template que o briefing proíbe e depende de números que não existem.

**B. "Banco tradicional sóbrio"**: navy dominante, serifas clássicas e fotografia institucional.
Foi descartada porque transmite autoridade, mas soa distante e elitista para o público INSS/CLT do interior.

**C. "Editorial humano" (escolhida)**: off-white quente como superfície, navy para áreas de autoridade, amarelo só para ação e assinatura, títulos editoriais grandes, grid assimétrico, fotografia real com recorte em arco (o "C") e o traço CF como fio condutor.

## 4. Por que a direção C

- Ela incorpora literalmente o território "crédito com gente de verdade por trás": a foto real ocupa o lugar de destaque, e a tipografia editorial dá peso à conversa, não ao número.
- Preserva o navy e o amarelo da marca, aplicados com hierarquia, em vez de espalhados pela página.
- Funciona sem os dados que faltam: a direção não depende de taxas, depoimentos ou números.
- A assinatura (traço CF, barras do F) é feita em CSS/SVG, sem custo de performance.

## 5. Alternativas de headline do hero

1. "Crédito é uma decisão importante. A gente te ajuda a encontrar o caminho." É clara, mas longa para o mobile (4 a 5 linhas em 360 px).
2. "Crédito com nome, endereço e gente para conversar." Tem identidade forte, mas soa um pouco defensiva.
3. "O caminho certo para o seu crédito começa com uma pergunta." Conecta com o seletor, mas é abstrata.
4. **"Antes do crédito, uma conversa de verdade."** (escolhida) É curta (3 linhas no mobile), diz o diferencial (humano) e o assunto (crédito), e não faz nenhuma promessa não comprovada. O subtítulo carrega a clareza operacional.
