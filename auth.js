/**
 * Módulo de Autenticação para APIs do Compranet
 * Gerencia a autenticação e obtenção de tokens para acesso às APIs do portal de compras públicas
 */

const axios = require('axios');
const CONFIG = require('./config');

class ComprasnetAuth {
    constructor() {
        this.token = null;
        this.tokenExpiry = null;
        this.config = CONFIG.comprasnetContratos;
    }

    /**
     * Obtém um token de autenticação para a API do Comprasnet Contratos
     * @returns {Promise<string>} Token de autenticação
     */
    async getToken() {
        // Verifica se o token atual ainda é válido
        if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
            return this.token;
        }

        try {
            // Requisição para obter novo token
            const response = await axios.post(`${this.config.baseUrl}${this.config.auth.tokenUrl}`, {
                client_id: this.config.auth.clientId,
                client_secret: this.config.auth.clientSecret,
                grant_type: 'client_credentials'
            });

            if (response.data && response.data.access_token) {
                this.token = response.data.access_token;
                
                // Calcula a expiração do token (geralmente 1 hora)
                const expiresIn = response.data.expires_in || 3600;
                this.tokenExpiry = new Date(new Date().getTime() + expiresIn * 1000);
                
                return this.token;
            } else {
                throw new Error('Falha ao obter token de autenticação');
            }
        } catch (error) {
            console.error('Erro na autenticação com o Comprasnet:', error.message);
            throw error;
        }
    }

    /**
     * Adiciona o token de autenticação aos cabeçalhos da requisição
     * @param {Object} headers Cabeçalhos da requisição
     * @returns {Promise<Object>} Cabeçalhos com token de autenticação
     */
    async getAuthHeaders(headers = {}) {
        const token = await this.getToken();
        return {
            ...headers,
            'Authorization': `Bearer ${token}`
        };
    }
}

module.exports = new ComprasnetAuth();
