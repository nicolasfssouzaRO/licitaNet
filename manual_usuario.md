# Manual do Usuário - SaaS de Integração com o Compranet

## Introdução

Bem-vindo ao Manual do Usuário do SaaS de Integração com o Compranet. Este sistema foi desenvolvido para facilitar o acesso e gerenciamento de informações do portal de compras públicas do Governo Federal brasileiro, permitindo consultar licitações, contratos e acompanhar processos de forma simples e eficiente.

## Índice

1. [Primeiros Passos](#primeiros-passos)
2. [Dashboard](#dashboard)
3. [Consulta de Licitações](#consulta-de-licitações)
4. [Consulta de Contratos](#consulta-de-contratos)
5. [Dicas e Boas Práticas](#dicas-e-boas-práticas)
6. [Solução de Problemas](#solução-de-problemas)

## Primeiros Passos

### Acesso ao Sistema

1. Abra seu navegador web (recomendamos Chrome, Firefox ou Edge).
2. Acesse o endereço do sistema: `http://seu-dominio.com.br` ou o endereço local configurado.
3. Faça login com suas credenciais (se aplicável).

### Navegação Básica

A interface do sistema é composta por três seções principais, acessíveis através do menu de navegação superior:

- **Dashboard**: Visão geral e indicadores.
- **Licitações**: Consulta e visualização de licitações.
- **Contratos**: Consulta e visualização de contratos.

## Dashboard

O Dashboard é a tela inicial do sistema e apresenta uma visão consolidada das informações mais relevantes.

### Componentes do Dashboard

1. **Cards de Resumo**:
   - Total de Licitações: Número total de licitações no período selecionado.
   - Total de Contratos: Número total de contratos no período selecionado.
   - Fornecedores Ativos: Número de fornecedores com contratos ativos.

2. **Gráficos**:
   - Licitações por Modalidade: Distribuição das licitações por tipo (Pregão, Concorrência, etc.).
   - Valor de Contratos por Mês: Evolução dos valores contratados ao longo do tempo.

3. **Tabela de Últimas Licitações**:
   - Lista das licitações mais recentes, com informações básicas.

### Utilizando o Dashboard

- **Atualizar Dados**: Clique no botão "Atualizar Dados" para obter as informações mais recentes.
- **Alterar Período**: Utilize o seletor de período para visualizar dados de diferentes intervalos de tempo (7 dias, 30 dias, 90 dias ou 1 ano).

## Consulta de Licitações

A seção de Licitações permite buscar e visualizar informações detalhadas sobre processos licitatórios.

### Realizando uma Busca

1. Acesse a seção "Licitações" através do menu superior.
2. Preencha os campos do formulário de busca conforme necessário:
   - **Termo de Busca**: Palavras-chave relacionadas ao objeto da licitação.
   - **Modalidade**: Tipo de licitação (Pregão, Tomada de Preços, etc.).
   - **Situação**: Estado atual da licitação (Aberta, Em andamento, Homologada, etc.).
   - **Data Início e Data Fim**: Período de abertura das licitações.

3. Clique no botão "Buscar" para realizar a consulta.
4. Para limpar os filtros, clique no botão "Limpar".

### Visualizando Resultados

Os resultados da busca são exibidos em formato de cards, contendo:
- Número da licitação e órgão responsável
- Objeto da licitação
- Modalidade
- Data de abertura
- Valor estimado
- Situação atual

### Detalhes da Licitação

Para visualizar informações detalhadas de uma licitação:

1. Clique no botão "Ver Detalhes" no card da licitação desejada.
2. Uma janela de detalhes será aberta, contendo:
   - Informações gerais da licitação
   - Lista de itens da licitação, com descrições, quantidades e valores estimados

3. Para fechar a janela de detalhes, clique no botão "X" no canto superior direito.

## Consulta de Contratos

A seção de Contratos permite buscar e visualizar informações detalhadas sobre contratos firmados.

### Realizando uma Busca

1. Acesse a seção "Contratos" através do menu superior.
2. Preencha os campos do formulário de busca conforme necessário:
   - **Termo de Busca**: Palavras-chave relacionadas ao objeto do contrato.
   - **Situação**: Estado atual do contrato (Vigente, Encerrado, Rescindido).
   - **CNPJ do Fornecedor**: CNPJ da empresa contratada.
   - **Data Início e Data Fim**: Período de vigência dos contratos.

3. Clique no botão "Buscar" para realizar a consulta.
4. Para limpar os filtros, clique no botão "Limpar".

### Visualizando Resultados

Os resultados da busca são exibidos em formato de cards, contendo:
- Número do contrato e órgão responsável
- Objeto do contrato
- Fornecedor
- Período de vigência
- Valor global
- Situação atual

### Detalhes do Contrato

Para visualizar informações detalhadas de um contrato:

1. Clique no botão "Ver Detalhes" no card do contrato desejado.
2. Uma janela de detalhes será aberta, contendo:
   - Informações gerais do contrato
   - Dados do fornecedor

3. Na janela de detalhes, você pode acessar informações adicionais através dos botões:
   - **Ver Cronograma**: Exibe o cronograma de pagamentos do contrato.
   - **Ver Empenhos**: Exibe os empenhos associados ao contrato.
   - **Ver Histórico**: Exibe o histórico de alterações do contrato.

4. Para fechar a janela de detalhes, clique no botão "X" no canto superior direito.

## Dicas e Boas Práticas

### Otimizando suas Buscas

- **Seja específico**: Utilize termos precisos nas buscas para obter resultados mais relevantes.
- **Combine filtros**: Utilize múltiplos filtros para refinar os resultados.
- **Utilize períodos adequados**: Restrinja as datas para períodos relevantes ao seu contexto.

### Exportação de Dados

Atualmente, o sistema não possui funcionalidade de exportação direta. Para salvar informações:
- Utilize a funcionalidade de impressão do navegador (Ctrl+P)
- Capture telas com as informações desejadas

### Atualizações de Dados

O sistema busca dados diretamente das APIs do Compranet. Para garantir informações atualizadas:
- Utilize o botão "Atualizar Dados" no Dashboard
- Realize novas buscas para obter os dados mais recentes

## Solução de Problemas

### Problemas Comuns e Soluções

1. **Resultados de busca vazios**:
   - Verifique se os filtros não estão muito restritivos
   - Tente utilizar termos mais genéricos
   - Amplie o período de datas

2. **Carregamento lento**:
   - Verifique sua conexão com a internet
   - Reduza o volume de dados buscados utilizando filtros mais específicos
   - Tente novamente em horários de menor demanda

3. **Erros de exibição**:
   - Atualize a página (F5)
   - Limpe o cache do navegador
   - Tente utilizar outro navegador

### Contato para Suporte

Se você encontrar problemas que não consegue resolver:

- Email: suporte@saas-compranet.com.br
- Telefone: (XX) XXXX-XXXX
- Horário de atendimento: Segunda a Sexta, das 9h às 18h

---

© 2025 SaaS Compranet. Todos os direitos reservados.
