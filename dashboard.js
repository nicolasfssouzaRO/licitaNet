/**
 * Módulo de interface para dashboard de acompanhamento
 * Implementa a interface de usuário para visualização de dados consolidados do Compranet
 */

// Importa o módulo de integração com o Compranet
const comprasnetAPI = require('../api');

// Configurações da interface de dashboard
const dashboardUI = {
    // Elemento onde será renderizado o dashboard
    containerSelector: '#dashboard-container',
    
    // Inicializa a interface de dashboard
    init() {
        this.container = document.querySelector(this.containerSelector);
        if (!this.container) {
            console.error('Container de dashboard não encontrado');
            return;
        }
        
        this.renderDashboard();
        this.loadDashboardData();
    },
    
    // Renderiza a estrutura do dashboard
    renderDashboard() {
        const dashboardHTML = `
            <div class="dashboard-header">
                <h2>Dashboard de Compras Públicas</h2>
                <div class="dashboard-actions">
                    <button id="btn-refresh-dashboard" class="btn btn-primary">Atualizar Dados</button>
                    <select id="dashboard-period" class="form-select">
                        <option value="7">Últimos 7 dias</option>
                        <option value="30" selected>Últimos 30 dias</option>
                        <option value="90">Últimos 90 dias</option>
                        <option value="365">Último ano</option>
                    </select>
                </div>
            </div>
            
            <div class="dashboard-content">
                <div class="dashboard-row">
                    <div class="dashboard-card" id="card-licitacoes">
                        <div class="card-header">
                            <h3>Licitações</h3>
                        </div>
                        <div class="card-body">
                            <div class="card-value" id="total-licitacoes">--</div>
                            <div class="card-label">Total de Licitações</div>
                        </div>
                        <div class="card-footer">
                            <div class="card-stats">
                                <div class="stat">
                                    <span class="stat-label">Abertas:</span>
                                    <span class="stat-value" id="licitacoes-abertas">--</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-label">Homologadas:</span>
                                    <span class="stat-value" id="licitacoes-homologadas">--</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dashboard-card" id="card-contratos">
                        <div class="card-header">
                            <h3>Contratos</h3>
                        </div>
                        <div class="card-body">
                            <div class="card-value" id="total-contratos">--</div>
                            <div class="card-label">Total de Contratos</div>
                        </div>
                        <div class="card-footer">
                            <div class="card-stats">
                                <div class="stat">
                                    <span class="stat-label">Vigentes:</span>
                                    <span class="stat-value" id="contratos-vigentes">--</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-label">Valor Total:</span>
                                    <span class="stat-value" id="contratos-valor">--</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dashboard-card" id="card-fornecedores">
                        <div class="card-header">
                            <h3>Fornecedores</h3>
                        </div>
                        <div class="card-body">
                            <div class="card-value" id="total-fornecedores">--</div>
                            <div class="card-label">Fornecedores Ativos</div>
                        </div>
                        <div class="card-footer">
                            <div class="card-stats">
                                <div class="stat">
                                    <span class="stat-label">Novos:</span>
                                    <span class="stat-value" id="fornecedores-novos">--</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-label">Com Impedimentos:</span>
                                    <span class="stat-value" id="fornecedores-impedidos">--</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="dashboard-row">
                    <div class="dashboard-chart-container">
                        <h3>Licitações por Modalidade</h3>
                        <div id="chart-modalidades" class="chart-area"></div>
                    </div>
                    
                    <div class="dashboard-chart-container">
                        <h3>Valor de Contratos por Mês</h3>
                        <div id="chart-contratos-mes" class="chart-area"></div>
                    </div>
                </div>
                
                <div class="dashboard-row">
                    <div class="dashboard-table-container">
                        <h3>Últimas Licitações Publicadas</h3>
                        <div id="table-ultimas-licitacoes" class="table-responsive">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Número</th>
                                        <th>Objeto</th>
                                        <th>Modalidade</th>
                                        <th>Data de Abertura</th>
                                        <th>Valor Estimado</th>
                                        <th>Situação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colspan="6" class="text-center">Carregando dados...</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.container.innerHTML = dashboardHTML;
        
        // Configura os listeners de eventos
        document.getElementById('btn-refresh-dashboard').addEventListener('click', () => {
            this.loadDashboardData();
        });
        
        document.getElementById('dashboard-period').addEventListener('change', (event) => {
            this.loadDashboardData(event.target.value);
        });
    },
    
    // Carrega os dados do dashboard
    async loadDashboardData(days = 30) {
        this.showLoading();
        
        try {
            // Calcula a data de início com base no período selecionado
            const dataInicio = new Date();
            dataInicio.setDate(dataInicio.getDate() - parseInt(days));
            
            // Formata a data para o formato esperado pela API
            const dataInicioFormatada = dataInicio.toISOString().split('T')[0];
            
            // Parâmetros para as consultas
            const params = {
                data_inicio: dataInicioFormatada
            };
            
            // Busca os dados necessários para o dashboard
            const [licitacoes, contratos, fornecedores] = await Promise.all([
                comprasnetAPI.integration.buscarLicitacoes(params),
                comprasnetAPI.integration.buscarContratos(params),
                comprasnetAPI.client.getFornecedores(params)
            ]);
            
            // Atualiza os cards com os totais
            this.updateDashboardCards(licitacoes, contratos, fornecedores);
            
            // Atualiza os gráficos
            this.updateDashboardCharts(licitacoes, contratos);
            
            // Atualiza a tabela de últimas licitações
            this.updateLicitacoesTable(licitacoes);
            
        } catch (error) {
            this.showError('Erro ao carregar dados do dashboard', error.message);
        } finally {
            this.hideLoading();
        }
    },
    
    // Atualiza os cards do dashboard com os dados obtidos
    updateDashboardCards(licitacoes, contratos, fornecedores) {
        // Atualiza o card de licitações
        document.getElementById('total-licitacoes').textContent = licitacoes.length;
        
        const licitacoesAbertas = licitacoes.filter(l => 
            l.situacao && l.situacao.toLowerCase().includes('aberta')).length;
        
        const licitacoesHomologadas = licitacoes.filter(l => 
            l.situacao && l.situacao.toLowerCase().includes('homologada')).length;
        
        document.getElementById('licitacoes-abertas').textContent = licitacoesAbertas;
        document.getElementById('licitacoes-homologadas').textContent = licitacoesHomologadas;
        
        // Atualiza o card de contratos
        document.getElementById('total-contratos').textContent = contratos.length;
        
        const contratosVigentes = contratos.filter(c => 
            c.situacao && c.situacao.toLowerCase().includes('vigente')).length;
        
        const valorTotalContratos = contratos.reduce((total, contrato) => 
            total + (contrato.valorGlobal || 0), 0);
        
        document.getElementById('contratos-vigentes').textContent = contratosVigentes;
        document.getElementById('contratos-valor').textContent = this.formatCurrency(valorTotalContratos);
        
        // Atualiza o card de fornecedores
        const totalFornecedores = fornecedores && fornecedores._embedded ? 
            fornecedores._embedded.fornecedores.length : 0;
        
        document.getElementById('total-fornecedores').textContent = totalFornecedores;
        
        // Aqui seriam necessárias consultas adicionais para obter fornecedores novos e com impedimentos
        // Por simplicidade, estamos usando valores fictícios
        document.getElementById('fornecedores-novos').textContent = Math.floor(totalFornecedores * 0.1);
        document.getElementById('fornecedores-impedidos').textContent = Math.floor(totalFornecedores * 0.05);
    },
    
    // Atualiza os gráficos do dashboard
    updateDashboardCharts(licitacoes, contratos) {
        // Aqui seria implementada a lógica para criar gráficos usando uma biblioteca como Chart.js
        // Por simplicidade, apenas simulamos a existência dos gráficos
        
        const chartModalidades = document.getElementById('chart-modalidades');
        chartModalidades.innerHTML = `<div class="chart-placeholder">Gráfico de Licitações por Modalidade</div>`;
        
        const chartContratosMes = document.getElementById('chart-contratos-mes');
        chartContratosMes.innerHTML = `<div class="chart-placeholder">Gráfico de Valor de Contratos por Mês</div>`;
    },
    
    // Atualiza a tabela de últimas licitações
    updateLicitacoesTable(licitacoes) {
        const tableBody = document.querySelector('#table-ultimas-licitacoes tbody');
        
        if (licitacoes.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center">Nenhuma licitação encontrada no período selecionado.</td></tr>`;
            return;
        }
        
        // Ordena as licitações pela data de abertura (mais recentes primeiro)
        const licitacoesOrdenadas = [...licitacoes].sort((a, b) => {
            const dataA = a.dataAbertura ? new Date(a.dataAbertura) : new Date(0);
            const dataB = b.dataAbertura ? new Date(b.dataAbertura) : new Date(0);
            return dataB - dataA;
        });
        
        // Limita a 10 licitações
        const ultimasLicitacoes = licitacoesOrdenadas.slice(0, 10);
        
        let tableHTML = '';
        
        ultimasLicitacoes.forEach(licitacao => {
            tableHTML += `
                <tr>
                    <td>${licitacao.numero || '-'}</td>
                    <td>${this.truncateText(licitacao.objeto, 50) || 'Não informado'}</td>
                    <td>${licitacao.modalidade || 'Não informada'}</td>
                    <td>${this.formatDate(licitacao.dataAbertura)}</td>
                    <td>${this.formatCurrency(licitacao.valorEstimado)}</td>
                    <td><span class="badge badge-${this.getSituacaoBadgeClass(licitacao.situacao)}">${licitacao.situacao || 'Não informada'}</span></td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = tableHTML;
    },
    
    // Trunca texto para exibição
    truncateText(text, maxLength) {
        if (!text) return '';
        
        if (text.length <= maxLength) {
            return text;
        }
        
        return text.substring(0, maxLength) + '...';
    },
    
    // Exibe mensagem de carregamento
    showLoading() {
        const loadingEl = document.createElement('div');
        loadingEl.className = 'loading-overlay';
        loadingEl.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Carregando dados do dashboard...</div>
        `;
        
        document.body.appendChild(loadingEl);
    },
    
    // Oculta mensagem de carregamento
    hideLoading() {
        const loadingEl = document.querySelector('.loading-overlay');
        if (loadingEl) {
            loadingEl.remove();
        }
    },
    
    // Exibe mensagem de erro
    showError(title, message) {
        const errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.innerHTML = `
            <div class="error-header">
                <h4>${title}</h4>
                <button class="btn-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="error-body">
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(errorEl);
        
        // Remove automaticamente após 5 segundos
        setTimeout(() => {
            if (document.body.contains(errorEl)) {
                errorEl.remove();
            }
        }, 5000);
    },
    
    // Formata data para exibição
    formatDate(dateString) {
        if (!dateString) return 'Não informada';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    },
    
    // Formata valor monetário para exibição
    formatCurrency(value) {
        if (!value) return 'Não informado';
        
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },
    
    // Retorna a classe CSS para o badge de situação
    getSituacaoBadgeClass(situacao) {
        if (!situacao) return 'secondary';
        
        const situacaoLower = situacao.toLowerCase();
        
        if (situacaoLower.includes('aberta')) return 'success';
        if (situacaoLower.includes('andamento')) return 'primary';
        if (situacaoLower.includes('homologada')) return 'info';
        if (situacaoLower.includes('revogada') || situacaoLower.includes('anulada')) return 'danger';
       
(Content truncated due to size limit. Use line ranges to read in chunks)