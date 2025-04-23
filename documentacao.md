# Documentação do SaaS de Integração com o Compranet

## Visão Geral

Este documento descreve a arquitetura, funcionalidades e instruções de uso do SaaS de Integração com o Compranet, uma solução desenvolvida para facilitar o acesso e gerenciamento de informações do portal de compras públicas do Governo Federal brasileiro.

## Índice

1. [Arquitetura da Solução](#arquitetura-da-solução)
2. [Módulos do Sistema](#módulos-do-sistema)
3. [Integração com o Compranet](#integração-com-o-compranet)
4. [Instalação e Configuração](#instalação-e-configuração)
5. [Manual do Usuário](#manual-do-usuário)
6. [Documentação Técnica](#documentação-técnica)
7. [Manutenção e Suporte](#manutenção-e-suporte)

## Arquitetura da Solução

### Visão Geral da Arquitetura

O SaaS de Integração com o Compranet foi desenvolvido seguindo uma arquitetura modular e escalável, composta por camadas bem definidas:

1. **Camada de Apresentação**: Interface de usuário responsiva e intuitiva, desenvolvida com HTML, CSS e JavaScript.
2. **Camada de Aplicação**: Lógica de negócio e funcionalidades do sistema, implementadas em JavaScript.
3. **Camada de Integração**: Módulos responsáveis pela comunicação com as APIs do Compranet.
4. **Camada de Dados**: Gerenciamento e persistência de dados locais e remotos.

### Diagrama de Arquitetura

```
+----------------------------------+
|        Interface do Usuário      |
|  (Licitações, Contratos, Dashboard) |
+----------------------------------+
                 |
+----------------------------------+
|      Lógica de Aplicação         |
|  (Formatação, Validação, Regras) |
+----------------------------------+
                 |
+----------------------------------+
|      Módulos de Integração       |
| (Autenticação, Cliente API, etc) |
+----------------------------------+
                 |
+----------------------------------+
|       APIs do Compranet          |
| (Compras Gov, Comprasnet Contratos) |
+----------------------------------+
```

### Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js
- **Integração**: REST APIs, JSON
- **Testes**: Mocha, Chai, Testes Unitários e de Integração
- **Documentação**: Markdown, JSDoc

## Módulos do Sistema

### Módulo de API

O módulo de API é responsável pela comunicação com as APIs do Compranet e é composto pelos seguintes componentes:

- **config.js**: Configurações das APIs, incluindo URLs base, endpoints e parâmetros de autenticação.
- **auth.js**: Gerenciamento de autenticação e tokens de acesso.
- **client.js**: Cliente para consumo das APIs do Compranet.
- **integration.js**: Funcionalidades de alto nível para operações comuns.

### Módulo de Interface de Usuário

O módulo de interface de usuário é responsável pela apresentação e interação com o usuário, e é composto pelos seguintes componentes:

- **licitacoes.js**: Interface para consulta e visualização de licitações.
- **contratos.js**: Interface para consulta e visualização de contratos.
- **dashboard.js**: Dashboard para acompanhamento de processos e visualização de dados consolidados.
- **app.js**: Aplicação principal que integra todos os módulos.

### Módulo de Estilos

O módulo de estilos é responsável pela aparência visual do sistema:

- **styles.css**: Estilos CSS para todos os componentes da interface.

## Integração com o Compranet

### APIs Utilizadas

O sistema integra-se com duas APIs principais do Compranet:

1. **API de Compras Governamentais (compras.dados.gov.br)**:
   - Acesso a dados de licitações, fornecedores, materiais e serviços.
   - Formato de dados: JSON, XML, CSV.
   - Não requer autenticação.

2. **API do Comprasnet Contratos (contratos.comprasnet.gov.br)**:
   - Acesso a dados de contratos, cronogramas, garantias e empenhos.
   - Formato de dados: JSON.
   - Requer autenticação OAuth2.

### Fluxo de Dados

O fluxo de dados entre o SaaS e o Compranet segue o seguinte padrão:

1. O usuário realiza uma consulta através da interface.
2. A aplicação processa a consulta e formata os parâmetros.
3. O módulo de integração envia a requisição para a API apropriada.
4. A API retorna os dados solicitados.
5. O módulo de integração processa e formata os dados recebidos.
6. A interface apresenta os dados formatados ao usuário.

### Autenticação

Para a API do Comprasnet Contratos, o sistema utiliza autenticação OAuth2:

1. O sistema solicita um token de acesso usando as credenciais configuradas.
2. O token é armazenado em memória e utilizado nas requisições subsequentes.
3. O sistema verifica a validade do token antes de cada requisição e renova quando necessário.

## Instalação e Configuração

### Requisitos do Sistema

- Node.js 14.x ou superior
- NPM 6.x ou superior
- Acesso à internet para comunicação com as APIs do Compranet

### Instalação

1. Clone o repositório:
   ```
   git clone https://github.com/sua-organizacao/saas-compranet.git
   ```

2. Instale as dependências:
   ```
   cd saas-compranet
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```
   cp .env.example .env
   ```
   Edite o arquivo `.env` com suas credenciais do Comprasnet Contratos.

### Configuração

1. Edite o arquivo `api/config.js` para ajustar as configurações das APIs, se necessário.

2. Inicie a aplicação:
   ```
   npm start
   ```

3. Acesse a aplicação em seu navegador:
   ```
   http://localhost:3000
   ```

## Manual do Usuário

### Visão Geral da Interface

A interface do SaaS de Integração com o Compranet é composta por três módulos principais:

1. **Dashboard**: Visão consolidada de dados e indicadores.
2. **Licitações**: Consulta e visualização de licitações.
3. **Contratos**: Consulta e visualização de contratos.

### Dashboard

O dashboard apresenta uma visão geral das licitações e contratos, com indicadores e gráficos para acompanhamento rápido:

- **Cards de Resumo**: Totais de licitações, contratos e fornecedores.
- **Gráficos**: Distribuição de licitações por modalidade e valores de contratos por mês.
- **Tabela de Últimas Licitações**: Lista das licitações mais recentes.

Para atualizar os dados do dashboard, clique no botão "Atualizar Dados". Para alterar o período de análise, utilize o seletor de período.

### Consulta de Licitações

A interface de licitações permite buscar e visualizar informações detalhadas sobre licitações:

1. Preencha os campos do formulário de busca conforme necessário:
   - Termo de busca
   - Modalidade
   - Situação
   - Período (data início e fim)

2. Clique em "Buscar" para realizar a consulta.

3. Os resultados serão exibidos em uma lista. Clique em "Ver Detalhes" para visualizar informações completas de uma licitação.

4. Na tela de detalhes, você poderá visualizar:
   - Informações gerais da licitação
   - Lista de itens da licitação

### Consulta de Contratos

A interface de contratos permite buscar e visualizar informações detalhadas sobre contratos:

1. Preencha os campos do formulário de busca conforme necessário:
   - Termo de busca
   - Situação
   - CNPJ do fornecedor
   - Período (data início e fim)

2. Clique em "Buscar" para realizar a consulta.

3. Os resultados serão exibidos em uma lista. Clique em "Ver Detalhes" para visualizar informações completas de um contrato.

4. Na tela de detalhes, você poderá visualizar:
   - Informações gerais do contrato
   - Dados do fornecedor
   - Botões para acessar informações adicionais:
     - Cronograma
     - Empenhos
     - Histórico

## Documentação Técnica

### Estrutura de Diretórios

```
saas_project/
├── api/
│   ├── config.js
│   ├── auth.js
│   ├── client.js
│   ├── integration.js
│   └── index.js
├── js/
│   ├── app.js
│   ├── licitacoes.js
│   ├── contratos.js
│   └── dashboard.js
├── tests/
│   ├── api.test.js
│   ├── ui.test.js
│   └── integration.test.js
├── index.html
├── styles.css
└── run_tests.sh
```

### Módulo de API

#### config.js

Contém as configurações das APIs do Compranet, incluindo URLs base, endpoints e parâmetros de autenticação.

```javascript
const CONFIG = {
    comprasGov: {
        baseUrl: 'https://compras.dados.gov.br',
        endpoints: { ... }
    },
    comprasnetContratos: {
        baseUrl: 'https://contratos.comprasnet.gov.br/api',
        endpoints: { ... },
        auth: { ... }
    }
};
```

#### auth.js

Gerencia a autenticação e obtenção de tokens para acesso às APIs do Compranet.

```javascript
class ComprasnetAuth {
    async getToken() { ... }
    async getAuthHeaders(headers = {}) { ... }
}
```

#### client.js

Fornece métodos para acessar as APIs do Compranet.

```javascript
class ComprasnetClient {
    async fetchComprasGov(endpoint, params = {}, format = 'json') { ... }
    async fetchComprasnetContratos(endpoint, params = {}, method = 'GET', data = null) { ... }
    async getLicitacoes(params = {}) { ... }
    async getContratos(params = {}) { ... }
    // ...
}
```

#### integration.js

Implementa funcionalidades de alto nível para operações comuns.

```javascript
class ComprasnetIntegration {
    async buscarLicitacoes(filtros = {}) { ... }
    async obterDetalhesLicitacao(id) { ... }
    async buscarContratos(filtros = {}) { ... }
    // ...
}
```

### Módulo de Interface de Usuário

#### app.js

Inicializa e gerencia os componentes da aplicação.

```javascript
const app = {
    init() { ... },
    setupNavigation() { ... },
    activateModule(moduleName) { ... }
};
```

#### licitacoes.js

Implementa a interface de usuário para busca e visualização de licitações.

```javascript
const licitacoesUI = {
    init() { ... },
    renderSearchForm() { ... },
    handleSearch(form) { ... },
    renderResults(licitacoes) { ... },
    showLicitacaoDetails(licitacaoId) { ... }
    // ...
};
```

#### contratos.js

Implementa a interface de usuário para busca e visualização de contratos.

```javascript
const contratosUI = {
    init() { ... },
    renderSearchForm() { ... },
    handleSearch(form) { ... },
    renderResults(contratos) { ... },
    showContratoDetails(contratoId) { ... }
    // ...
};
```

#### dashboard.js

Implementa a interface de usuário para visualização de dados consolidados.

```javascript
const dashboardUI = {
    init() { ... },
    renderDashboard() { ... },
    loadDashboardData(days = 30) { ... },
    updateDashboardCards(licitacoes, contratos, fornecedores) { ... }
    // ...
};
```

### Testes

#### api.test.js

Testes unitários para os módulos de API.

```javascript
describe('Módulo de Configuração', () => { ... });
describe('Módulo de Autenticação', () => { ... });
describe('Cliente API', () => { ... });
describe('Módulo de Integração', () => { ... });
```

#### ui.test.js

Testes unitários para as interfaces de usuário.

```javascript
describe('Interface de Licitações', () => { ... });
describe('Interface de Contratos', () => { ... });
describe('Interface de Dashboard', () => { ... });
```

#### integration.test.js

Testes de integração para validar a comunicação com o Compranet.

```javascript
describe('Integração com o Compranet', () => {
    describe('API de Compras Governamentais', () => { ... });
    describe('API do Comprasnet Contratos (simulado)', () => { ... });
    describe('Módulo de Integração de Alto Nível', () => { ... });
});
```

## Manutenção e Suporte

### Atualizações

O sistema deve ser atualizado regularmente para acompanhar possíveis mudanças nas APIs do Compranet. Recomenda-se verificar a documentação oficial do Compranet periodicamente.

### Solução de Problemas

Em caso de problemas com a integração, verifique:

1. Conectividade com as APIs do Compranet
2. Validade das credenciais de autenticação
3. Logs de erro no console do navegador
4. Resultados dos testes automatizados

### Contato para Suporte

Para obter suporte técnico, entre em contato com:

- Email: suporte@saas-compranet.com.br
- Telefone: (XX) XXXX-XXXX

---

© 2025 SaaS Compranet. Todos os direitos reservados.
