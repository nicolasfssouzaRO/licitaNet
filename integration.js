/**
 * Módulo de Integração com o Compranet
 * Fornece funcionalidades de alto nível para integração com o portal de compras públicas
 */

const client = require('./client');

class ComprasnetIntegration {
    constructor() {
        this.client = client;
    }

    /**
     * Busca licitações com filtros avançados
     * @param {Object} filtros - Filtros para busca de licitações
     * @returns {Promise<Array>} Lista de licitações encontradas
     */
    async buscarLicitacoes(filtros = {}) {
        try {
            const resultado = await this.client.getLicitacoes(filtros);
            return this.formatarResultadoLicitacoes(resultado);
        } catch (error) {
            console.error('Erro ao buscar licitações:', error.message);
            throw new Error(`Falha ao buscar licitações: ${error.message}`);
        }
    }

    /**
     * Formata o resultado das licitações para um formato padronizado
     * @param {Object} resultado - Resultado da API
     * @returns {Array} Lista formatada de licitações
     */
    formatarResultadoLicitacoes(resultado) {
        if (!resultado || !resultado._embedded || !resultado._embedded.licitacoes) {
            return [];
        }

        return resultado._embedded.licitacoes.map(item => ({
            id: item.identificador,
            numero: item.numero,
            objeto: item.objeto,
            modalidade: item.modalidade.descricao,
            situacao: item.situacao,
            dataAbertura: item.data_abertura,
            valorEstimado: item.valor_estimado,
            orgao: item.orgao ? {
                codigo: item.orgao.codigo,
                nome: item.orgao.nome
            } : null,
            uasg: item.uasg ? {
                codigo: item.uasg.codigo,
                nome: item.uasg.descricao
            } : null,
            links: item._links
        }));
    }

    /**
     * Busca detalhes completos de uma licitação específica
     * @param {string} id - ID da licitação
     * @returns {Promise<Object>} Detalhes da licitação com seus itens
     */
    async obterDetalhesLicitacao(id) {
        try {
            const [licitacao, itens] = await Promise.all([
                this.client.getLicitacao(id),
                this.client.getItensLicitacao(id)
            ]);

            return {
                ...licitacao,
                itens: this.formatarItensLicitacao(itens)
            };
        } catch (error) {
            console.error(`Erro ao obter detalhes da licitação ${id}:`, error.message);
            throw new Error(`Falha ao obter detalhes da licitação: ${error.message}`);
        }
    }

    /**
     * Formata os itens de uma licitação
     * @param {Object} resultado - Resultado da API de itens
     * @returns {Array} Lista formatada de itens
     */
    formatarItensLicitacao(resultado) {
        if (!resultado || !resultado._embedded || !resultado._embedded.itens) {
            return [];
        }

        return resultado._embedded.itens.map(item => ({
            numero: item.numero,
            descricao: item.descricao,
            quantidade: item.quantidade,
            unidade: item.unidade,
            valorEstimado: item.valor_estimado
        }));
    }

    /**
     * Busca contratos ativos com filtros
     * @param {Object} filtros - Filtros para busca de contratos
     * @returns {Promise<Array>} Lista de contratos encontrados
     */
    async buscarContratos(filtros = {}) {
        try {
            const resultado = await this.client.getContratos(filtros);
            return this.formatarResultadoContratos(resultado);
        } catch (error) {
            console.error('Erro ao buscar contratos:', error.message);
            throw new Error(`Falha ao buscar contratos: ${error.message}`);
        }
    }

    /**
     * Formata o resultado dos contratos para um formato padronizado
     * @param {Object} resultado - Resultado da API
     * @returns {Array} Lista formatada de contratos
     */
    formatarResultadoContratos(resultado) {
        if (!resultado || !resultado.data) {
            return [];
        }

        return resultado.data.map(item => ({
            id: item.id,
            numero: item.numero,
            objeto: item.objeto,
            valorGlobal: item.valor_global,
            dataInicio: item.data_inicio,
            dataFim: item.data_fim,
            situacao: item.situacao,
            fornecedor: item.fornecedor ? {
                id: item.fornecedor.id,
                nome: item.fornecedor.nome,
                cpfCnpj: item.fornecedor.cpf_cnpj
            } : null,
            orgao: item.orgao ? {
                id: item.orgao.id,
                nome: item.orgao.nome
            } : null
        }));
    }

    /**
     * Busca órgãos do governo com filtros
     * @param {Object} filtros - Filtros para busca de órgãos
     * @returns {Promise<Array>} Lista de órgãos encontrados
     */
    async buscarOrgaos(filtros = {}) {
        try {
            const resultado = await this.client.getOrgaos(filtros);
            return this.formatarResultadoOrgaos(resultado);
        } catch (error) {
            console.error('Erro ao buscar órgãos:', error.message);
            throw new Error(`Falha ao buscar órgãos: ${error.message}`);
        }
    }

    /**
     * Formata o resultado dos órgãos para um formato padronizado
     * @param {Object} resultado - Resultado da API
     * @returns {Array} Lista formatada de órgãos
     */
    formatarResultadoOrgaos(resultado) {
        if (!resultado || !resultado._embedded || !resultado._embedded.orgaos) {
            return [];
        }

        return resultado._embedded.orgaos.map(item => ({
            codigo: item.codigo,
            nome: item.nome,
            sigla: item.sigla,
            tipo: item.tipo
        }));
    }

    /**
     * Verifica se uma empresa tem impedimentos para participar de licitações
     * @param {string} cnpj - CNPJ da empresa
     * @returns {Promise<Object>} Informações sobre impedimentos
     */
    async verificarImpedimentosEmpresa(cnpj) {
        try {
            const data = { cnpj };
            const resultado = await this.client.verificarImpedimentosCompra(data);
            return {
                cnpj,
                possuiImpedimentos: resultado.possui_impedimentos || false,
                detalhes: resultado.detalhes || []
            };
        } catch (error) {
            console.error(`Erro ao verificar impedimentos para CNPJ ${cnpj}:`, error.message);
            throw new Error(`Falha ao verificar impedimentos: ${error.message}`);
        }
    }
}

module.exports = new ComprasnetIntegration();
