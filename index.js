/**
 * Módulo de índice para a API do Compranet
 * Exporta todos os componentes necessários para integração com o portal de compras públicas
 */

const config = require('./config');
const auth = require('./auth');
const client = require('./client');
const integration = require('./integration');

module.exports = {
    config,
    auth,
    client,
    integration
};
