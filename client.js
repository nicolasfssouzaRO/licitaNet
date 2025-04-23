/**
 * Cliente para APIs do Compranet
 * Fornece métodos para acessar as APIs do portal de compras públicas
 */

const axios = require('axios');
const CONFIG = require('./config');
const auth = require('./auth');

class ComprasnetClient {
    constructor() {
        this.comprasGovConfig = CONFIG.comprasGov;
        this.contratosConfig = CONFIG.comprasnetContratos;
    }

    /**
     * Realiza uma requisição para a API de Compras Governamentais (dados abertos)
     * @param {string} endpoint - Endpoint da API
     * @param {Object} params - Parâmetros da requisição
     * @param {string} format - Formato de resposta (json, xml, csv, html)
     * @returns {Promise<Object>} Resposta da API
     */
    async fetchComprasGov(endpoint, params = {}, format = this.comprasGovConfig.defaultFormat) {
        try {
            const url = `${this.comprasGovConfig.baseUrl}${endpoint}.${format}`;
            const response = await axios.get(url, { params });
            return response.data;
        } catch (error) {
            console.error(`Erro ao acessar API de Compras Governamentais (${endpoint}):`, error.message);
            throw error;
        }
    }

    /**
     * Realiza uma requisição para a API do Comprasnet Contratos
     * @param {string} endpoint - Endpoint da API
     * @param {Object} params - Parâmetros da requisição
     * @param {string} method - Método HTTP (GET, POST, PUT, DELETE)
     * @param {Object} data - Dados para envio (POST/PUT)
     * @returns {Promise<Object>} Resposta da API
     */
    async fetchComprasnetContratos(endpoint, params = {}, method = 'GET', data = null) {
        try {
            const url = `${this.contratosConfig.baseUrl}${endpoint}`;
            const headers = await auth.getAuthHeaders();
            
            const config = {
                method,
                url,
                headers,
                params
            };
            
            if (data && (method === 'POST' || method === 'PUT')) {
                config.data = data;
            }
            
            const response = await axios(config);
            return response.data;
        } catch (error) {
            console.error(`Erro ao acessar API do Comprasnet Contratos (${endpoint}):`, error.message);
            throw error;
        }
    }

    // Métodos específicos para a API de Compras Governamentais
    
    /**
     * Busca licitações com base nos parâmetros fornecidos
     * @param {Object} params - Parâmetros de busca
     * @returns {Promise<Object>} Lista de licitações
     */
    async getLicitacoes(params = {}) {
        return this.fetchComprasGov(this.comprasGovConfig.endpoints.licitacoes, params);
    }
    
    /**
     * Busca detalhes de uma licitação específica
     * @param {string} id - ID da licitação
     * @returns {Promise<Object>} Detalhes da licitação
     */
    async getLicitacao(id) {
        return this.fetchComprasGov(`/licitacoes/doc/licitacao/${id}`);
    }
    
    /**
     * Busca itens de uma licitação
     * @param {string} licitacaoId - ID da licitação
     * @returns {Promise<Object>} Itens da licitação
     */
    async getItensLicitacao(licitacaoId) {
        return this.fetchComprasGov(this.comprasGovConfig.endpoints.itensLicitacao, { licitacao_id: licitacaoId });
    }
    
    /**
     * Busca fornecedores com base nos parâmetros fornecidos
     * @param {Object} params - Parâmetros de busca
     * @returns {Promise<Object>} Lista de fornecedores
     */
    async getFornecedores(params = {}) {
        return this.fetchComprasGov(this.comprasGovConfig.endpoints.fornecedores, params);
    }
    
    /**
     * Busca órgãos com base nos parâmetros fornecidos
     * @param {Object} params - Parâmetros de busca
     * @returns {Promise<Object>} Lista de órgãos
     */
    async getOrgaos(params = {}) {
        return this.fetchComprasGov(this.comprasGovConfig.endpoints.orgaos, params);
    }

    // Métodos específicos para a API do Comprasnet Contratos
    
    /**
     * Busca contratos ativos
     * @param {Object} params - Parâmetros de busca
     * @returns {Promise<Object>} Lista de contratos
     */
    async getContratos(params = {}) {
        return this.fetchComprasnetContratos(this.contratosConfig.endpoints.contratos, params);
    }
    
    /**
     * Busca detalhes de um contrato específico
     * @param {string} id - ID do contrato
     * @returns {Promise<Object>} Detalhes do contrato
     */
    async getContrato(id) {
        return this.fetchComprasnetContratos(`${this.contratosConfig.endpoints.contratos}/${id}`);
    }
    
    /**
     * Busca cronogramas de um contrato
     * @param {string} contratoId - ID do contrato
     * @returns {Promise<Object>} Cronogramas do contrato
     */
    async getCronogramasContrato(contratoId) {
        return this.fetchComprasnetContratos(`/api/contrato/${contratoId}/cronograma`);
    }
    
    /**
     * Verifica impedimentos de uma compra
     * @param {Object} data - Dados da compra
     * @returns {Promise<Object>} Informações sobre impedimentos
     */
    async verificarImpedimentosCompra(data) {
        return this.fetchComprasnetContratos(this.contratosConfig.endpoints.compras, {}, 'POST', data);
    }
}

module.exports = new ComprasnetClient();
