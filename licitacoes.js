 //Buscar licitações
// Adiciona um listener para o evento de submit do formulário   
let apiUrl ="";
document.getElementById('licitacoes-search-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita o envio padrão do formulário
    // Obtém os valores dos campos do formulário
    let termo = document.getElementById('search-termo').value;
    let modalidade = document.getElementById('search-modalidade').value;
    let situacao = document.getElementById('search-situacao').value;
    let dataInicio = document.getElementById('search-data-inicio').value;
    let dataFim = document.getElementById('search-data-fim').value;

if (!dataInicio || !dataFim) {
        alert('Por favor, preencha as datas de início e fim.');
        return;
    }else{
        dataInicio = dataInicio.replace(/-/g, '');
        dataFim = dataFim.replace(/-/g, '');
        apiUrl = `https://pncp.gov.br/api/consulta/v1/contratos?${dataInicio}&dataFinal=${dataFim}&pagina=10`;
    }
    

    try {
        // Faz a requisição à API
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': '*/*'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        // Converte a resposta para JSON
        const data = await response.json();

        // Exibe os resultados no contêiner
        const resultsContainer = document.getElementById('licitacoes-results');
        resultsContainer.innerHTML = ''; // Limpa resultados anteriores

        if (data && data.length > 0) {
            data.forEach(item => {
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                resultItem.innerHTML = `
                    <h3>${item.titulo || 'Sem título'}</h3>
                    <p>${item.descricao || 'Sem descrição'}</p>
                `;
                resultsContainer.appendChild(resultItem);
            });
        } else {
            resultsContainer.innerHTML = '<p>Nenhum resultado encontrado.</p>';
        }
    } catch (error) {
        console.error('Erro ao buscar licitações:', error);
        document.getElementById('licitacoes-results').innerHTML = '<p>Erro ao buscar licitações. Tente novamente mais tarde.</p>';
    }
});


// Configurações da interface de licitações
const licitacoesUI = {
    // Elemento onde será renderizada a interface de licitações
    containerSelector: '#licitacoes-container',
    
    // Elemento do formulário de busca
    searchFormSelector: '#licitacoes-search-form',
    
    // Elemento onde serão exibidos os resultados
    resultsSelector: '#licitacoes-results',
    
    // Elemento para exibição de detalhes de uma licitação
    detailsSelector: '#licitacao-details',
    
    // Inicializa a interface de licitações
    init() {
        this.container = document.querySelector(this.containerSelector);
        if (!this.container) {
            console.error('Container de licitações não encontrado');
            return;
        }
        
        this.renderSearchForm();
        this.setupEventListeners();
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
                    const licitacaoId = detailButton.dataset.id;
                    this.showLicitacaoDetails(licitacaoId);
                }
            });
        }
    },
    
    // Manipula a busca de licitações
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
            const licitacoes = await comprasnetAPI.integration.buscarLicitacoes(params);
            this.renderResults(licitacoes);
        } catch (error) {
            this.showError('Erro ao buscar licitações', error.message);
        } finally {
            this.hideLoading();
        }
    },
    
    // Renderiza os resultados da busca
    renderResults(licitacoes) {
        const resultsContainer = document.querySelector(this.resultsSelector);
        
        if (licitacoes.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>Nenhuma licitação encontrada com os critérios informados.</p>
                </div>
            `;
            return;
        }
        
        let resultsHTML = `
            <h3>Resultados da Busca</h3>
            <div class="results-count">${licitacoes.length} licitações encontradas</div>
            <div class="results-list">
        `;
        
        licitacoes.forEach(licitacao => {
            resultsHTML += `
                <div class="result-item">
                    <div class="result-header">
                        <h4>${licitacao.numero} - ${licitacao.orgao?.nome || 'Órgão não informado'}</h4>
                        <span class="badge badge-${this.getSituacaoBadgeClass(licitacao.situacao)}">${licitacao.situacao}</span>
                    </div>
                    
                    <div class="result-body">
                        <p><strong>Objeto:</strong> ${licitacao.objeto || 'Não informado'}</p>
                        <p><strong>Modalidade:</strong> ${licitacao.modalidade || 'Não informada'}</p>
                        <p><strong>Data de Abertura:</strong> ${this.formatDate(licitacao.dataAbertura)}</p>
                        <p><strong>Valor Estimado:</strong> ${this.formatCurrency(licitacao.valorEstimado)}</p>
                    </div>
                    
                    <div class="result-footer">
                        <button class="btn btn-details" data-id="${licitacao.id}">Ver Detalhes</button>
                    </div>
                </div>
            `;
        });
        
        resultsHTML += `</div>`;
        resultsContainer.innerHTML = resultsHTML;
    },
    
    // Exibe os detalhes de uma licitação
    async showLicitacaoDetails(licitacaoId) {
        const detailsContainer = document.querySelector(this.detailsSelector);
        
        this.showLoading();
        
        try {
            const detalhes = await comprasnetAPI.integration.obterDetalhesLicitacao(licitacaoId);
            
            let detailsHTML = `
                <div class="details-header">
                    <h3>Detalhes da Licitação</h3>
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
                                <th>Modalidade:</th>
                                <td>${detalhes.modalidade?.descricao || 'Não informada'}</td>
                            </tr>
                            <tr>
                                <th>Situação:</th>
                                <td><span class="badge badge-${this.getSituacaoBadgeClass(detalhes.situacao)}">${detalhes.situacao || 'Não informada'}</span></td>
                            </tr>
                            <tr>
                                <th>Data de Abertura:</th>
                                <td>${this.formatDate(detalhes.data_abertura)}</td>
                            </tr>
                            <tr>
                                <th>Valor Estimado:</th>
                                <td>${this.formatCurrency(detalhes.valor_estimado)}</td>
                            </tr>
                            <tr>
                                <th>Órgão:</th>
                                <td>${detalhes.orgao?.nome || 'Não informado'}</td>
                            </tr>
                            <tr>
                                <th>UASG:</th>
                                <td>${detalhes.uasg?.descricao || 'Não informada'}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div class="details-section">
                        <h4>Itens da Licitação</h4>
                        ${this.renderItensLicitacao(detalhes.itens)}
                    </div>
                </div>
            `;
            
            detailsContainer.innerHTML = detailsHTML;
            detailsContainer.classList.add('active');
            
            // Adiciona evento para fechar os detalhes
            document.getElementById('close-details').addEventListener('click', () => {
                detailsContainer.classList.remove('active');
            });
            
        } catch (error) {
            this.showError('Erro ao obter detalhes da licitação', error.message);
        } finally {
            this.hideLoading();
        }
    },
    
    // Renderiza a tabela de itens da licitação
    renderItensLicitacao(itens) {
        if (!itens || itens.length === 0) {
            return '<p>Nenhum item encontrado para esta licitação.</p>';
        }
        
        let itensHTML = `
            <table class="itens-table">
                <thead>
                    <tr>
                        <th>Nº</th>
                        <th>Descrição</th>
                        <th>Quantidade</th>
                        <th>Unidade</th>
                        <th>Valor Estimado</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        itens.forEach(item => {
            itensHTML += `
                <tr>
                    <td>${item.numero}</td>
                    <td>${item.descricao}</td>
                    <td>${item.quantidade}</td>
                    <td>${item.unidade}</td>
                    <td>${this.formatCurrency(item.valorEstimado)}</td>
                </tr>
            `;
        });
        
        itensHTML += `
                </tbody>
            </table>
        `;
        
        return itensHTML;
    },
    
    // Exibe mensagem de carregamento
    showLoading() {
        const loadingEl = document.createElement('div');
        loadingEl.className = 'loading-overlay';
        loadingEl.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Carregando...</div>
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
        
        return 'secondary';
    }

    
};
// Exporta o módulo de interface de licitações
module.exports = licitacoesUI;

