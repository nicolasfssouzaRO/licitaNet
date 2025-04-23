# SaaS de Integração com o Compranet

Este repositório contém o código-fonte e a documentação para o SaaS de Integração com o Compranet, uma solução desenvolvida para facilitar o acesso e gerenciamento de informações do portal de compras públicas do Governo Federal brasileiro.

## Visão Geral

O SaaS de Integração com o Compranet permite:

- Consultar e visualizar licitações públicas
- Gerenciar contratos governamentais
- Acompanhar processos através de um dashboard intuitivo
- Integrar-se com as APIs oficiais do Compranet

## Início Rápido

### Pré-requisitos

- Node.js 14.x ou superior
- NPM 6.x ou superior
- Acesso à internet para comunicação com as APIs do Compranet

### Instalação

1. Clone o repositório:
   ```
   git clone https://github.com/sua-organizacao/saas-compranet.git
   cd saas-compranet
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```
   cp .env.example .env
   ```
   Edite o arquivo `.env` com suas credenciais do Comprasnet Contratos.

4. Inicie a aplicação:
   ```
   npm start
   ```

5. Acesse a aplicação em seu navegador:
   ```
   http://localhost:3000
   ```

## Estrutura do Projeto

```
saas_project/
├── api/               # Módulos de integração com o Compranet
├── js/                # Código JavaScript da aplicação
├── docs/              # Documentação completa
├── tests/             # Testes unitários e de integração
├── index.html         # Página principal
└── styles.css         # Estilos CSS
```

## Documentação

A documentação completa está disponível na pasta `docs/`:

- [Documentação Técnica](docs/documentacao.md) - Arquitetura, módulos e detalhes técnicos
- [Manual do Usuário](docs/manual_usuario.md) - Guia de uso do sistema
- [Guia de Instalação](docs/instalacao.md) - Instruções detalhadas de instalação e configuração

## Testes

Para executar os testes:

```
./run_tests.sh
```

Este script executará testes unitários e de integração, verificando o funcionamento correto de todos os componentes.

## Suporte

Para obter suporte técnico, entre em contato:

- Email: suporte@saas-compranet.com.br
- Telefone: (XX) XXXX-XXXX
- Horário: Segunda a Sexta, das 9h às 18h

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

---

© 2025 SaaS Compranet. Todos os direitos reservados.
