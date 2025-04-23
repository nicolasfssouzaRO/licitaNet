/**
 * Módulo de interface para integração com o PNCP
 * Este módulo implementa a interface de usuário para interagir com a API do PNCP
 */

// Importa o módulo de integração com o PNCP
const pncpIntegration = require('../api/pncp_integration');

// Classe para gerenciar a interface de usuário do PNCP
class PNCPInterface {
  constructor() {
    this.containerId = 'pncp-container';
    this.currentView = null;
    this.lastSearchParams = {};
    this.syncStatus = {};
  }

  /**
   * Inicializa a interface do PNCP
   */
  init() {
    console.log('Inicializando interface do PNCP');
    this.createContainer();
    this.renderMainView();
    this.setupEventListeners();
  }

  /**
   * Cria o container principal da interface
   */
  createContainer() {
    // Verifica se o container já existe
    let container = document.getElementById(this.containerId);
    
    if (!container) {
      // Cria o container se não existir
      container = document.createElement('div');
      container.id = this.containerId;
      container.className = 'module-container';
      container.style.display = 'none';
      
      // Adiciona o container ao DOM
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.appendChild(container);
      } else {
        document.body.appendChild(container);
      }
    }
  }

  /**
   * Configura os listeners de eventos
   */
  setupEventListeners() {
    // Adiciona link de navegação para o PNCP no menu principal
    const navbar = document.querySelector('.navbar-nav');
    if (navbar) {
      const pncpLink = document.createElement('li');
      pncpLink.className = 'nav-item';
      pncpLink.innerHTML = '<a href="#pncp" class="nav-link" data-module="pncp">PNCP</a>';
      navbar.appendChild(pncpLink);
      
      // Adiciona evento de clique
      pncpLink.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        this.show();
        
        // Atualiza a classe ativa no menu
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
        });
        e.target.classList.add('active');
      });
    }
  }

  /**
   * Mostra a interface do PNCP
   */
  show() {
    // Oculta todos os outros containers de módulos
    document.querySelectorAll('.module-container').forEach(container => {
      container.style.display = 'none';
    });
    
    // Mostra o container do PNCP
    const container = document.getElementById(this.containerId);
    if (container) {
      container.style.display = 'block';
    }
    
    // Renderiza a visualização atual ou a principal se não houver
    if (this.currentView) {
      this.renderView(this.currentView);
    } else {
      this.renderMainView();
    }
  }

  /**
   * Renderiza a visualização principal
   */
  renderMainView() {
    this.currentView = 'main';
    
    const container = document.getElementById(this.containerId);
    if (!container) return;
    
    container.innerHTML = `
      <div class="pncp-header">
        <h2>Portal Nacional de Contratações Públicas (PNCP)</h2>
        <p>Integração com o PNCP para consulta e sincronização de dados de compras públicas.</p>
      </div>
      
      <div class="pncp-tabs">
        <button class="pncp-tab-btn active" data-tab="contratos">Contratos</button>
        <button class="pncp-tab-btn" data-tab="contratacoes">Contratações</button>
        <button class="pncp-tab-btn" data-tab="atas">Atas de Registro</button>
        <button class="pncp-tab-btn" data-tab="pca">Planos de Contratação</button>
        <button class="pncp-tab-btn" data-tab="sync">Sincronização</button>
      </div>
      
      <div class="pncp-tab-content">
        <div id="pncp-tab-contratos" class="pncp-tab-pane active">
          <h3>Consulta de Contratos</h3>
          <form id="pncp-contratos-form" class="pncp-search-form">
            <div class="form-group">
              <label for="contratos-data-inicio">Data de Publicação Início:</label>
              <input type="date" id="contratos-data-inicio" name="dataInicio" class="form-control">
            </div>
            <div class="form-group">
              <label for="contratos-data-fim">Data de Publicação Fim:</label>
              <input type="date" id="contratos-data-fim" name="dataFim" class="form-control">
            </div>
            <div class="form-group">
              <label for="contratos-pagina">Página:</label>
              <input type="number" id="contratos-pagina" name="pagina" class="form-control" value="1" min="1">
            </div>
            <div class="form-group">
              <label for="contratos-tamanho">Registros por página:</label>
              <input type="number" id="contratos-tamanho" name="tamanhoPagina" class="form-control" value="10" min="1" max="100">
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Consultar</button>
              <button type="button" class="btn btn-secondary" id="btn-sync-contratos">Sincronizar</button>
            </div>
          </form>
          <div id="pncp-contratos-results" class="pncp-results">
            <p>Utilize o formulário acima para consultar contratos.</p>
          </div>
        </div>
        
        <div id="pncp-tab-contratacoes" class="pncp-tab-pane">
          <h3>Consulta de Contratações</h3>
          <form id="pncp-contratacoes-form" class="pncp-search-form">
            <div class="form-group">
              <label for="contratacoes-data-inicio">Data de Publicação Início:</label>
              <input type="date" id="contratacoes-data-inicio" name="dataInicio" class="form-control">
            </div>
            <div class="form-group">
              <label for="contratacoes-data-fim">Data de Publicação Fim:</label>
              <input type="date" id="contratacoes-data-fim" name="dataFim" class="form-control">
            </div>
            <div class="form-group">
              <label for="contratacoes-pagina">Página:</label>
              <input type="number" id="contratacoes-pagina" name="pagina" class="form-control" value="1" min="1">
            </div>
            <div class="form-group">
              <label for="contratacoes-tamanho">Registros por página:</label>
              <input type="number" id="contratacoes-tamanho" name="tamanhoPagina" class="form-control" value="10" min="1" max="100">
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Consultar</button>
              <button type="button" class="btn btn-secondary" id="btn-sync-contratacoes">Sincronizar</button>
            </div>
          </form>
          <div id="pncp-contratacoes-results" class="pncp-results">
            <p>Utilize o formulário acima para consultar contratações.</p>
          </div>
        </div>
        
        <div id="pncp-tab-atas" class="pncp-tab-pane">
          <h3>Consulta de Atas de Registro de Preço</h3>
          <form id="pncp-atas-form" class="pncp-search-form">
            <div class="form-group">
              <label for="atas-data-inicio">Data de Vigência Início:</label>
              <input type="date" id="atas-data-inicio" name="dataInicio" class="form-control">
            </div>
            <div class="form-group">
              <label for="atas-data-fim">Data de Vigência Fim:</label>
              <input type="date" id="atas-data-fim" name="dataFim" class="form-control">
            </div>
            <div class="form-group">
              <label for="atas-pagina">Página:</label>
              <input type="number" id="atas-pagina" name="pagina" class="form-control" value="1" min="1">
            </div>
            <div class="form-group">
              <label for="atas-tamanho">Registros por página:</label>
              <input type="number" id="atas-tamanho" name="tamanhoPagina" class="form-control" value="10" min="1" max="100">
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Consultar</button>
              <button type="button" class="btn btn-secondary" id="btn-sync-atas">Sincronizar</button>
            </div>
          </form>
          <div id="pncp-atas-results" class="pncp-results">
            <p>Utilize o formulário acima para consultar atas de registro de preço.</p>
          </div>
        </div>
        
        <div id="pncp-tab-pca" class="pncp-tab-pane">
          <h3>Consulta de Planos de Contratação</h3>
          <form id="pncp-pca-form" class="pncp-search-form">
            <div class="form-group">
              <label for="pca-ano">Ano do PCA:</label>
              <input type="number" id="pca-ano" name="anoPca" class="form-control" value="${new Date().getFullYear()}">
            </div>
            <div class="form-group">
              <label for="pca-classificacao">Código de Classificação:</label>
              <input type="text" id="pca-classificacao" name="codigoClassificacao" class="form-control">
            </div>
            <div class="form-group">
              <label for="pca-pagina">Página:</label>
              <input type="number" id="pca-pagina" name="pagina" class="form-control" value="1" min="1">
            </div>
            <div class="form-group">
              <label for="pca-tamanho">Registros por página:</label>
              <input type="number" id="pca-tamanho" name="tamanhoPagina" class="form-control" value="10" min="1" max="100">
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Consultar</button>
              <button type="button" class="btn btn-secondary" id="btn-sync-pca">Sincronizar</button>
            </div>
          </form>
          <div id="pncp-pca-results" class="pncp-results">
            <p>Utilize o formulário acima para consultar planos de contratação.</p>
          </div>
        </div>
        
        <div id="pncp-tab-sync" class="pncp-tab-pane">
          <h3>Sincronização de Dados</h3>
          <div class="pncp-sync-options">
            <h4>Configurar Sincronização Automática</h4>
            <form id="pncp-sync-form" class="pncp-sync-form">
              <div class="form-group">
                <label for="sync-tipo">Tipo de Dados:</label>
                <select id="sync-tipo" name="tipo" class="form-control">
                  <option value="contratos">Contratos</option>
                  <option value="contratacoes">Contratações</option>
                  <option value="atas">Atas de Registro</option>
                  <option value="pca">Planos de Contratação</option>
                </select>
              </div>
              <div class="form-group">
                <label for="sync-intervalo">Intervalo (horas):</label>
                <input type="number" id="sync-intervalo" name="intervaloHoras" class="form-control" value="24" min="1">
              </div>
              <div class="form-actions">
                <button type="submit" class="btn btn-primary">Agendar Sincronização</button>
              </div>
            </form>
          </div>
          
          <div class="pncp-sync-status">
            <h4>Status das Sincronizações</h4>
            <div id="pncp-sync-status-list" class="pncp-sync-status-list">
              <p>Nenhuma sincronização agendada.</p>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Configura os eventos das abas
    document.querySelectorAll('.pncp-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Remove a classe ativa de todas as abas
        document.querySelectorAll('.pncp-tab-btn').forEach(b => {
          b.classList.remove('active');
        });
        
        // Adiciona a classe ativa à aba clicada
        e.target.classList.add('active');
        
        // Oculta todos os painéis de conteúdo
        document.querySelectorAll('.pncp-tab-pane').forEach(pane => {
          pane.classList.remove('active');
        });
        
        // Mostra o painel de conteúdo correspondente
        const tabId = e.target.getAttribute('data-tab');
        document.getElementById(`pncp-tab-${tabId}`).classList.add('active');
      });
    });
    
    // Configura os eventos dos formulários
    this.setupFormEvents();
  }

  /**
   * Configura os eventos dos formulários
   */
  setupFormEvents() {
    // Formulário de contratos
    const contratosForm = document.getElementById('pncp-contratos-form');
    if (contratosForm) {
      contratosForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contratosForm);
        const params = {};
        
        for (const [key, value] of formData.entries()) {
          params[key] = value;
        }
        
        this.lastSearchParams.contratos = params;
        await this.searchContratos(params);
      });
    }
    
    // Botão de sincronização de contratos
    const syncContratosBtn = document.getElementById('btn-sync-contratos');
    if (syncContratosBtn) {
      syncContratosBtn.addEventListener('click', async () => {
        await this.syncData('contratos', this.lastSearchParams.contratos || {});
      });
    }
    
    // Formulário de contratações
    const contratacoesForm = document.getElementById('pncp-contratacoes-form');
    if (contratacoesForm) {
      contratacoesForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contratacoesForm);
        const params = {};
        
        for (const [key, value] of formData.entries()) {
          params[key] = value;
        }
        
        this.lastSearchParams.contratacoes = params;
        await this.searchContratacoes(params);
      });
    }
    
    // Botão de sincronização de contratações
    const syncContratacoesBtn = document.getElementById('btn-sync-contratacoes');
    if (syncContratacoesBtn) {
      syncContratacoesBtn.addEventListener('click', async () => {
        await this.syncData('contratacoes', this.lastSearchParams.contratacoes || {});
      });
    }
    
    // Formulário de atas
    const atasForm = document.getElementById('pncp-atas-form');
    if (atasForm) {
      atasForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(atasForm);
        const params = {};
        
        for (const [key, value] of formData.entries()) {
          params[key] = value;
        }
        
        this.lastSearchParams.atas = params;
        await this.searchAtas(params);
      });
    }
    
    // Botão de sincronização de atas
    const syncAtasBtn = document.getElementById('btn-sync-atas');
    if (syncAtasBtn) {
      syncAtasBtn.addEventListener('click', async () => {
        await this.syncData('atas', this.lastSearchParams.atas || {});
      });
    }
    
    // Formulário de PCA
    const pcaForm = document.getElementById('pncp-pca-form');
    if (pcaForm) {
      pcaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(pcaForm);
        const params = {};
        
        for (const [key, value] of formData.entries()) {
          params[key] = value;
        }
        
        this.lastSearchParams.pca = params;
        await this.searchPCA(params);
      });
    }
    
    // Botão de sincronização de PCA
    const syncPCABtn = document.getElementById('btn-sync-pca');
    if (syncPCABtn) {
      syncPCABtn.addEventListener('click', async () => {
        await this.syncData('pca', this.lastSearchParams.pca || {});
      });
    }
    
    // Formulário de sincronização
    const syncForm = document.getElementById('pncp-sync-form');
    if (syncForm) {
      syncForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(syncForm);
        con
(Content truncated due to size limit. Use line ranges to read in chunks)