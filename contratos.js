/**
 * Módulo de interface para consulta de contratos
 * Implementa a interface de usuário para busca e visualização de contratos do Compranet
 */

// Importa o módulo de integração com o Compranet
const comprasnetAPI = require('../api');

// Configurações da interface de contratos
const contratosUI = {
    // Elemento onde será renderizada a interface de contratos
    containerSelector: '#contratos-container',
    
    // Elemento do formulário de busca
    searchFormSelector: '#contratos-search-form',
    
    // Elemento onde serão exibidos os resultados
    resultsSelector: '#contratos-results',
    
    // Elemento para exibição de detalhes de um contrato
    detailsSelector: '#contrato-details',
    
    // Inicializa a interface de contratos
    init() {
        this.container = document.querySelector(this.containerSelector);
        if (!this.container) {
            console.error('Container de contratos não encontrado');
            return;
        }
        
        this.renderSearchForm();
        this.setupEventListeners();
    },
    
    // Renderiza o formulário de busca de contratos
    renderSearchForm() {
        const formHTML = `
            <div class="search-container">
                <h2>Consulta de Contratos</h2>
                <form id="contratos-search-form" class="search-form">
                    <div class="form-group">
                        <label for="search-termo">Termo de Busca:</label>
                        <input type="text" id="search-termo" name="termo" placeholder="Digite palavras-chave...">
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="search-situacao">Situação:</label>
                            <select id="search-situacao" name="situacao">
                                <option value="">Todas</option>
                                <option value="Vigente">Vigente</option>
                                <option value="Encerrado">Encerrado</option>
                                <option value="Rescindido">Rescindido</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="search-fornecedor">CNPJ do Fornecedor:</label>
                            <input type="text" id="search-fornecedor" name="fornecedor_cnpj" placeholder="00.000.000/0000-00">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="search-data-inicio">Data Início:</label>
                            <input type="date" id="search-data-inicio" name="data_inicio">
                        </div>
                        
                        <div class="form-group">
                            <label for="search-data-fim">Data Fim:</label>
                            <input type="date" id="search-data-fim" name="data_fim">
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Buscar</button>
                        <button type="reset" class="btn btn-secondary">Limpar</button>
                    </div>
                </form>
            </div>
            
            <div id="contratos-results" class="results-container"></div>
            <div id="contrato-details" class="details-container"></div>
        `;
        
        this.container.innerHTML = formHTML;
    },
    
    // Configura os listeners de eventos
    setupEventListeners() {
        const searchForm = document.querySelector(this.searchFormSelector);
        if (searchForm) {
            searchForm.addEventListener('submit', (event) => {
                event.preventDefault();
                this.handleSearch(event.target);
            });
        }
        
        // Delegação de eventos para os resultados
        const resultsContainer = document.querySelector(this.resultsSelector);
        if (resultsContainer) {
            resultsContainer.addEventListener('click', (event) => {
                const detailButton = event.target.closest('.btn-details');
                if (detailButton) {
                    const contratoId = detailButton.dataset.id;
                    this.showContratoDetails(contratoId);
                }
            });
        }
    },
    
    // Manipula a busca de contratos
    async handleSearch(form) {
        const formData = new FormData(form);
        const params = {};
        
        // Converte FormData para objeto de parâmetros
        for (const [key, value] of formData.entries()) {
            if (value) {
                params[key] = value;
            }
        }
        
        this.showLoading();
        
        try {
            const contratos = await comprasnetAPI.integration.buscarContratos(params);
            this.renderResults(contratos);
        } catch (error) {
            this.showError('Erro ao buscar contratos', error.message);
        } finally {
            this.hideLoading();
        }
    },
    
    // Renderiza os resultados da busca
    renderResults(contratos) {
        const resultsContainer = document.querySelector(this.resultsSelector);
        
        if (contratos.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>Nenhum contrato encontrado com os critérios informados.</p>
                </div>
            `;
            return;
        }
        
        let resultsHTML = `
            <h3>Resultados da Busca</h3>
            <div class="results-count">${contratos.length} contratos encontrados</div>
            <div class="results-list">
        `;
        
        contratos.forEach(contrato => {
            resultsHTML += `
                <div class="result-item">
                    <div class="result-header">
                        <h4>${contrato.numero} - ${contrato.orgao?.nome || 'Órgão não informado'}</h4>
                        <span class="badge badge-${this.getSituacaoBadgeClass(contrato.situacao)}">${contrato.situacao}</span>
                    </div>
                    
                    <div class="result-body">
                        <p><strong>Objeto:</strong> ${contrato.objeto || 'Não informado'}</p>
                        <p><strong>Fornecedor:</strong> ${contrato.fornecedor?.nome || 'Não informado'}</p>
                        <p><strong>Vigência:</strong> ${this.formatDate(contrato.dataInicio)} a ${this.formatDate(contrato.dataFim)}</p>
                        <p><strong>Valor Global:</strong> ${this.formatCurrency(contrato.valorGlobal)}</p>
                    </div>
                    
                    <div class="result-footer">
                        <button class="btn btn-details" data-id="${contrato.id}">Ver Detalhes</button>
                    </div>
                </div>
            `;
        });
        
        resultsHTML += `</div>`;
        resultsContainer.innerHTML = resultsHTML;
    },
    
    // Exibe os detalhes de um contrato
    async showContratoDetails(contratoId) {
        const detailsContainer = document.querySelector(this.detailsSelector);
        
        this.showLoading();
        
        try {
            const detalhes = await comprasnetAPI.client.getContrato(contratoId);
            
            let detailsHTML = `
                <div class="details-header">
                    <h3>Detalhes do Contrato</h3>
                    <button class="btn btn-close" id="close-details">&times;</button>
                </div>
                
                <div class="details-content">
                    <div class="details-section">
                        <h4>Informações Gerais</h4>
                        <table class="details-table">
                            <tr>
                                <th>Número:</th>
                                <td>${detalhes.numero || 'Não informado'}</td>
                            </tr>
                            <tr>
                                <th>Objeto:</th>
                                <td>${detalhes.objeto || 'Não informado'}</td>
                            </tr>
                            <tr>
                                <th>Situação:</th>
                                <td><span class="badge badge-${this.getSituacaoBadgeClass(detalhes.situacao)}">${detalhes.situacao || 'Não informada'}</span></td>
                            </tr>
                            <tr>
                                <th>Data de Início:</th>
                                <td>${this.formatDate(detalhes.data_inicio)}</td>
                            </tr>
                            <tr>
                                <th>Data de Término:</th>
                                <td>${this.formatDate(detalhes.data_fim)}</td>
                            </tr>
                            <tr>
                                <th>Valor Global:</th>
                                <td>${this.formatCurrency(detalhes.valor_global)}</td>
                            </tr>
                            <tr>
                                <th>Órgão:</th>
                                <td>${detalhes.orgao?.nome || 'Não informado'}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div class="details-section">
                        <h4>Fornecedor</h4>
                        <table class="details-table">
                            <tr>
                                <th>Nome:</th>
                                <td>${detalhes.fornecedor?.nome || 'Não informado'}</td>
                            </tr>
                            <tr>
                                <th>CNPJ/CPF:</th>
                                <td>${detalhes.fornecedor?.cpf_cnpj || 'Não informado'}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div class="details-actions">
                        <button class="btn btn-primary" id="btn-cronograma" data-id="${contratoId}">Ver Cronograma</button>
                        <button class="btn btn-primary" id="btn-empenhos" data-id="${contratoId}">Ver Empenhos</button>
                        <button class="btn btn-primary" id="btn-historico" data-id="${contratoId}">Ver Histórico</button>
                    </div>
                </div>
            `;
            
            detailsContainer.innerHTML = detailsHTML;
            detailsContainer.classList.add('active');
            
            // Adiciona evento para fechar os detalhes
            document.getElementById('close-details').addEventListener('click', () => {
                detailsContainer.classList.remove('active');
            });
            
            // Adiciona eventos para os botões de ações
            document.getElementById('btn-cronograma').addEventListener('click', (event) => {
                const id = event.target.dataset.id;
                this.showCronograma(id);
            });
            
            document.getElementById('btn-empenhos').addEventListener('click', (event) => {
                const id = event.target.dataset.id;
                this.showEmpenhos(id);
            });
            
            document.getElementById('btn-historico').addEventListener('click', (event) => {
                const id = event.target.dataset.id;
                this.showHistorico(id);
            });
            
        } catch (error) {
            this.showError('Erro ao obter detalhes do contrato', error.message);
        } finally {
            this.hideLoading();
        }
    },
    
    // Exibe o cronograma de um contrato
    async showCronograma(contratoId) {
        this.showLoading();
        
        try {
            const cronograma = await comprasnetAPI.client.getCronogramasContrato(contratoId);
            
            const modalEl = document.createElement('div');
            modalEl.className = 'modal';
            
            let modalHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Cronograma do Contrato</h3>
                        <button class="btn-close" id="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
            `;
            
            if (!cronograma || cronograma.length === 0) {
                modalHTML += `<p>Nenhum cronograma encontrado para este contrato.</p>`;
            } else {
                modalHTML += `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Parcela</th>
                                <th>Data Prevista</th>
                                <th>Valor</th>
                                <th>Situação</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                
                cronograma.forEach(item => {
                    modalHTML += `
                        <tr>
                            <td>${item.parcela || '-'}</td>
                            <td>${this.formatDate(item.data_prevista)}</td>
                            <td>${this.formatCurrency(item.valor)}</td>
                            <td>${item.situacao || 'Não informada'}</td>
                        </tr>
                    `;
                });
                
                modalHTML += `
                        </tbody>
                    </table>
                `;
            }
            
            modalHTML += `
                    </div>
                </div>
            `;
            
            modalEl.innerHTML = modalHTML;
            document.body.appendChild(modalEl);
            
            // Adiciona evento para fechar o modal
            document.getElementById('close-modal').addEventListener('click', () => {
                modalEl.remove();
            });
            
        } catch (error) {
            this.showError('Erro ao obter cronograma do contrato', error.message);
        } finally {
            this.hideLoading();
        }
    },
    
    // Exibe os empenhos de um contrato
    async showEmpenhos(contratoId) {
        this.showLoading();
        
        try {
            const empenhos = await comprasnetAPI.client.fetchComprasnetContratos(`/api/contrato/${contratoId}/empenhos`);
            
            const modalEl = document.createElement('div');
            modalEl.className = 'modal';
            
            let modalHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Empenhos do Contrato</h3>
                        <button class="btn-close" id="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
            `;
            
            if (!empenhos || empenhos.length === 0) {
                modalHTML += `<p>Nenhum empenho encontrado para este contrato.</p>`;
            } else {
                modalHTML += `
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Número</th>
                                <th>Data</th>
                                <th>Valor</th>
                                <th>Situação</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                
                empenhos.forEach(item => {
                    modalHTML += `
                    
(Content truncated due to size limit. Use line ranges to read in chunks)