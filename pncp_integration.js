/**
 * Módulo de integração com a API do Portal Nacional de Contratações Públicas (PNCP)
 * 
 * Este módulo implementa a comunicação com a API do PNCP para consulta de contratos,
 * contratações, atas de registro de preço e planos de contratação.
 */

// Configurações da API do PNCP
const PNCP_API_CONFIG = {
  baseUrl: 'https://pncp.gov.br/api/consulta',
  endpoints: {
    // Endpoints de Contratos
    contratos: '/v1/contratos',
    contratosAtualizacao: '/v1/contratos/atualizacao',
    
    // Endpoints de Contratação
    contratacao: '/v1/orgaos/{cnpj}/compras/{ano}/{sequencial}',
    contratacaoPublicacao: '/v1/contratacoes/publicacao',
    contratacaoProposta: '/v1/contratacoes/proposta',
    contratacaoAtualizacao: '/v1/contratacoes/atualizacao',
    
    // Endpoints de Atas de Registro de Preço
    atas: '/v1/atas',
    atasAtualizacao: '/v1/atas/atualizacao',
    
    // Endpoints de Plano de Contratação
    pcaUsuario: '/v1/pca/usuario',
    pcaAtualizacao: '/v1/pca/atualizacao',
    pca: '/v1/pca/'
  },
  defaultHeaders: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

/**
 * Classe para integração com a API do PNCP
 */
class PNCPIntegration {
  constructor() {
    this.config = PNCP_API_CONFIG;
    this.lastResponse = null;
    this.lastError = null;
  }
  
  /**
   * Realiza uma requisição para a API do PNCP
   * 
   * @param {string} endpoint - Endpoint da API
   * @param {Object} params - Parâmetros da requisição
   * @param {Object} queryParams - Parâmetros de consulta
   * @returns {Promise<Object>} - Resposta da API
   */
  async request(endpoint, params = {}, queryParams = {}) {
    try {
      // Substitui parâmetros na URL se necessário
      let url = this.config.baseUrl + endpoint;
      
      // Substitui parâmetros na URL
      Object.keys(params).forEach(key => {
        url = url.replace(`{${key}}`, params[key]);
      });
      
      // Adiciona parâmetros de consulta
      if (Object.keys(queryParams).length > 0) {
        const queryString = Object.keys(queryParams)
          .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
          .join('&');
        
        url += `?${queryString}`;
      }
      
      // Realiza a requisição
      const response = await fetch(url, {
        method: 'GET',
        headers: this.config.defaultHeaders
      });
      
      // Verifica se a requisição foi bem-sucedida
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
      }
      
      // Converte a resposta para JSON
      const data = await response.json();
      this.lastResponse = data;
      
      return data;
    } catch (error) {
      this.lastError = error;
      console.error('Erro ao realizar requisição para a API do PNCP:', error);
      throw error;
    }
  }
  
  /**
   * Consulta contratos por data de publicação
   * 
   * @param {Object} params - Parâmetros da consulta
   * @returns {Promise<Object>} - Contratos encontrados
   */
  async consultarContratos(params = {}) {
    const queryParams = {
      dataPublicacaoInicio: params.dataInicio || '',
      dataPublicacaoFim: params.dataFim || '',
      pagina: params.pagina || 1,
      tamanhoPagina: params.tamanhoPagina || 10
    };
    
    return this.request(this.config.endpoints.contratos, {}, queryParams);
  }
  
  /**
   * Consulta contratos por data de atualização
   * 
   * @param {Object} params - Parâmetros da consulta
   * @returns {Promise<Object>} - Contratos encontrados
   */
  async consultarContratosAtualizacao(params = {}) {
    const queryParams = {
      dataAtualizacaoInicio: params.dataInicio || '',
      dataAtualizacaoFim: params.dataFim || '',
      pagina: params.pagina || 1,
      tamanhoPagina: params.tamanhoPagina || 10
    };
    
    return this.request(this.config.endpoints.contratosAtualizacao, {}, queryParams);
  }
  
  /**
   * Consulta uma contratação específica
   * 
   * @param {string} cnpj - CNPJ do órgão
   * @param {string} ano - Ano da compra
   * @param {string} sequencial - Sequencial da compra
   * @returns {Promise<Object>} - Contratação encontrada
   */
  async consultarContratacao(cnpj, ano, sequencial) {
    const params = {
      cnpj,
      ano,
      sequencial
    };
    
    return this.request(this.config.endpoints.contratacao, params);
  }
  
  /**
   * Consulta contratações por data de publicação
   * 
   * @param {Object} params - Parâmetros da consulta
   * @returns {Promise<Object>} - Contratações encontradas
   */
  async consultarContratacoesPorPublicacao(params = {}) {
    const queryParams = {
      dataPublicacaoInicio: params.dataInicio || '',
      dataPublicacaoFim: params.dataFim || '',
      pagina: params.pagina || 1,
      tamanhoPagina: params.tamanhoPagina || 10
    };
    
    return this.request(this.config.endpoints.contratacaoPublicacao, {}, queryParams);
  }
  
  /**
   * Consulta contratações com recebimento de propostas aberto
   * 
   * @param {Object} params - Parâmetros da consulta
   * @returns {Promise<Object>} - Contratações encontradas
   */
  async consultarContratacoesProposta(params = {}) {
    const queryParams = {
      pagina: params.pagina || 1,
      tamanhoPagina: params.tamanhoPagina || 10
    };
    
    return this.request(this.config.endpoints.contratacaoProposta, {}, queryParams);
  }
  
  /**
   * Consulta contratações por data de atualização
   * 
   * @param {Object} params - Parâmetros da consulta
   * @returns {Promise<Object>} - Contratações encontradas
   */
  async consultarContratacoesPorAtualizacao(params = {}) {
    const queryParams = {
      dataAtualizacaoInicio: params.dataInicio || '',
      dataAtualizacaoFim: params.dataFim || '',
      pagina: params.pagina || 1,
      tamanhoPagina: params.tamanhoPagina || 10
    };
    
    return this.request(this.config.endpoints.contratacaoAtualizacao, {}, queryParams);
  }
  
  /**
   * Consulta atas de registro de preço por período de vigência
   * 
   * @param {Object} params - Parâmetros da consulta
   * @returns {Promise<Object>} - Atas encontradas
   */
  async consultarAtas(params = {}) {
    const queryParams = {
      dataVigenciaInicio: params.dataInicio || '',
      dataVigenciaFim: params.dataFim || '',
      pagina: params.pagina || 1,
      tamanhoPagina: params.tamanhoPagina || 10
    };
    
    return this.request(this.config.endpoints.atas, {}, queryParams);
  }
  
  /**
   * Consulta atas de registro de preço por data de atualização
   * 
   * @param {Object} params - Parâmetros da consulta
   * @returns {Promise<Object>} - Atas encontradas
   */
  async consultarAtasPorAtualizacao(params = {}) {
    const queryParams = {
      dataAtualizacaoInicio: params.dataInicio || '',
      dataAtualizacaoFim: params.dataFim || '',
      pagina: params.pagina || 1,
      tamanhoPagina: params.tamanhoPagina || 10
    };
    
    return this.request(this.config.endpoints.atasAtualizacao, {}, queryParams);
  }
  
  /**
   * Consulta itens de PCA por ano, ID do usuário e código de classificação
   * 
   * @param {Object} params - Parâmetros da consulta
   * @returns {Promise<Object>} - Itens de PCA encontrados
   */
  async consultarPCAUsuario(params = {}) {
    const queryParams = {
      anoPca: params.anoPca || '',
      idUsuario: params.idUsuario || '',
      codigoClassificacaoSuperior: params.codigoClassificacao || '',
      pagina: params.pagina || 1,
      tamanhoPagina: params.tamanhoPagina || 10
    };
    
    return this.request(this.config.endpoints.pcaUsuario, {}, queryParams);
  }
  
  /**
   * Consulta PCA por data de atualização
   * 
   * @param {Object} params - Parâmetros da consulta
   * @returns {Promise<Object>} - PCAs encontrados
   */
  async consultarPCAPorAtualizacao(params = {}) {
    const queryParams = {
      dataAtualizacaoInicio: params.dataInicio || '',
      dataAtualizacaoFim: params.dataFim || '',
      pagina: params.pagina || 1,
      tamanhoPagina: params.tamanhoPagina || 10
    };
    
    return this.request(this.config.endpoints.pcaAtualizacao, {}, queryParams);
  }
  
  /**
   * Consulta itens de PCA por ano e código de classificação
   * 
   * @param {Object} params - Parâmetros da consulta
   * @returns {Promise<Object>} - Itens de PCA encontrados
   */
  async consultarPCA(params = {}) {
    const queryParams = {
      anoPca: params.anoPca || '',
      codigoClassificacaoSuperior: params.codigoClassificacao || '',
      pagina: params.pagina || 1,
      tamanhoPagina: params.tamanhoPagina || 10
    };
    
    return this.request(this.config.endpoints.pca, {}, queryParams);
  }
  
  /**
   * Sincroniza dados do PNCP com o sistema local
   * 
   * @param {string} tipo - Tipo de dados a sincronizar (contratos, contratacoes, atas, pca)
   * @param {Object} params - Parâmetros da sincronização
   * @returns {Promise<Object>} - Resultado da sincronização
   */
  async sincronizarDados(tipo, params = {}) {
    try {
      let resultado;
      
      switch (tipo) {
        case 'contratos':
          resultado = await this.consultarContratos(params);
          break;
        case 'contratacoes':
          resultado = await this.consultarContratacoesPorPublicacao(params);
          break;
        case 'atas':
          resultado = await this.consultarAtas(params);
          break;
        case 'pca':
          resultado = await this.consultarPCA(params);
          break;
        default:
          throw new Error(`Tipo de sincronização inválido: ${tipo}`);
      }
      
      // Aqui seria implementada a lógica para salvar os dados no sistema local
      console.log(`Sincronização de ${tipo} concluída com sucesso. ${resultado.totalRegistros || 0} registros encontrados.`);
      
      return {
        sucesso: true,
        tipo,
        totalRegistros: resultado.totalRegistros || 0,
        mensagem: `Sincronização de ${tipo} concluída com sucesso.`
      };
    } catch (error) {
      console.error(`Erro ao sincronizar dados de ${tipo}:`, error);
      
      return {
        sucesso: false,
        tipo,
        mensagem: `Erro ao sincronizar dados de ${tipo}: ${error.message}`
      };
    }
  }
  
  /**
   * Agenda sincronização periódica de dados do PNCP
   * 
   * @param {string} tipo - Tipo de dados a sincronizar (contratos, contratacoes, atas, pca)
   * @param {Object} params - Parâmetros da sincronização
   * @param {number} intervaloHoras - Intervalo em horas entre sincronizações
   * @returns {Object} - Informações sobre o agendamento
   */
  agendarSincronizacao(tipo, params = {}, intervaloHoras = 24) {
    const intervaloMs = intervaloHoras * 60 * 60 * 1000;
    
    // Cria um identificador único para o agendamento
    const agendamentoId = `sync_${tipo}_${Date.now()}`;
    
    // Agenda a primeira sincronização
    const timeoutId = setTimeout(async () => {
      await this.sincronizarDados(tipo, params);
      
      // Agenda as próximas sincronizações
      const intervalId = setInterval(async () => {
        await this.sincronizarDados(tipo, params);
      }, intervaloMs);
      
      // Armazena o ID do intervalo para possível cancelamento futuro
      this.agendamentos[agendamentoId].intervalId = intervalId;
    }, 0);
    
    // Armazena informações sobre o agendamento
    this.agendamentos = this.agendamentos || {};
    this.agendamentos[agendamentoId] = {
      tipo,
      params,
      intervaloHoras,
      timeoutId,
      intervalId: null,
      criadoEm: new Date().toISOString()
    };
    
    return {
      agendamentoId,
      tipo,
      intervaloHoras,
      proximaSincronizacao: new Date(Date.now()).toISOString()
    };
  }
  
  /**
   * Cancela uma sincronização agendada
   * 
   * @param {string} agendamentoId - ID do agendamento a cancelar
   * @returns {boolean} - Indica se o cancelamento foi bem-sucedido
   */
  cancelarSincronizacao(agendamentoId) {
    if (!this.agendamentos || !this.agendamentos[agendamentoId]) {
      return false;
    }
    
    const agendamento = this.agendamentos[agendamentoId];
    
    // Cancela o timeout inicial se ainda não foi executado
    if (agendamento.timeoutId) {
      clearTimeout(agendamento.timeoutId);
    }
    
    // Cancela o intervalo se já foi iniciado
    if (agendamento.intervalId) {
      clearInterval(agendamento.intervalId);
    }
    
    // Remove o agendamento da lista
    delete this.agendamentos[agendamentoId];
    
    return true;
  }
}

// Exporta a classe de integração
module.exports = new PNCPIntegration();
