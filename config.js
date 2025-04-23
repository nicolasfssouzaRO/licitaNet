/**
 * Configuração das APIs do Compranet
 * Este arquivo contém as configurações necessárias para integração com as APIs do portal de compras públicas
 */

const CONFIG = {
    // API de Compras Governamentais
    comprasGov: {
        baseUrl: 'https://compras.dados.gov.br',
        endpoints: {
            licitacoes: '/licitacoes/v1/licitacoes',
            itensLicitacao: '/licitacoes/v1/itens_licitacao',
            fornecedores: '/fornecedores/v1/fornecedores',
            contratos: '/contratos/v1/contratos',
            orgaos: '/licitacoes/v1/orgaos',
            uasgs: '/licitacoes/v1/uasgs',
            materiais: '/materiais/v1/materiais',
            servicos: '/servicos/v1/servicos'
        },
        formats: ['json', 'xml', 'csv', 'html'],
        defaultFormat: 'json'
    },
    
    // API do Comprasnet Contratos
    comprasnetContratos: {
        baseUrl: 'https://contratos.comprasnet.gov.br/api',
        endpoints: {
            orgaos: '/api/contrato/orgaos',
            unidades: '/api/contrato/unidades',
            contratos: '/api/v1/contrato',
            cronogramas: '/api/v1/contrato/cronogramas',
            garantias: '/api/v1/contrato/garantias',
            itens: '/api/v1/contrato/itens',
            historicos: '/api/v1/contrato/historicos',
            execucoes: '/api/v1/execucoes/contratos',
            compras: '/api/v1/comprasnet/compras/impedimentos'
        },
        auth: {
            tokenUrl: '/auth/token',
            clientId: process.env.COMPRASNET_CLIENT_ID || '',
            clientSecret: process.env.COMPRASNET_CLIENT_SECRET || ''
        }
    }
};

module.exports = CONFIG;
