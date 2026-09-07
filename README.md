# Landing page do Fecha Mês

Página pública e estática usada como destino dos anúncios iOS da campanha inicial.

- Sem cookies ou pixels.
- Sem coleta de dados pessoais.
- Botões direcionam para a página pública do aplicativo na App Store brasileira.
- A política de privacidade é a mesma informada nas lojas.

## Ajuste de conversão — 7 de setembro de 2026

- Todas as imagens com chamada de download são links de verdade, também acessíveis por teclado.
- Gratuito e PRO opcional, de compra única, estão explicados junto ao primeiro botão.
- Os links da App Store usam o provider token `128504330`, obtido no gerador oficial do App Store Connect em 7/9/2026.
- Sem JavaScript, todos os links continuam funcionando e usam a campanha geral do site.
- O script local apenas seleciona um dos nomes públicos de campanha abaixo. Não envia eventos, não lê dados financeiros, não usa cookies, armazenamento, pixels ou identificadores de visitante.

| Entrada | Campanha App Store |
| --- | --- |
| Sem parâmetro ou parâmetro desconhecido | `fm_ios_site_v2_202609` |
| `?campaign=meta_c01` | `fm_ios_meta_c01_202609` |
| `?campaign=meta_c02` | `fm_ios_meta_c02_202609` |

Esses nomes e o token foram gerados no App Store Connect. Parâmetros de campanha são públicos, não credenciais. A rota brasileira da loja foi preservada.

A medição começa com os novos links: não atribui retroativamente downloads anteriores e não equivale a contagem de cliques no site. A Apple aplica janela de atribuição e limiares mínimos (a interface informa ao menos cinco Contas Apple individuais para exibir uma campanha). Não interpretar relatório vazio como zero downloads nem misturar visitas com usuários ativos.

Validação local: `node --test tests/campaign-links.test.mjs`.
