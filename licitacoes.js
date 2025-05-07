let apiUrl = "";
let currentPage = 1; // Página inicial
const resultsPerPage = 10; // Número de resultados por página
let totalPages = 0;
var responseData;

    // Carregar o header dinamicamente
    fetch('header.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('header-container').innerHTML = data;
      })
      .catch(error => console.error('Erro ao carregar o header:', error));


document.getElementById('licitacoes-search-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    currentPage = 1; // Reinicia para a primeira página
    await fetchAndRenderData();
});

document.getElementById('prev-page').addEventListener('click', async function () {
    if (currentPage > 1) {
        currentPage--;
        await fetchAndRenderData();
    }
});

document.getElementById('next-page').addEventListener('click', async function () {
    if (currentPage < totalPages) {
        currentPage++;
        await fetchAndRenderData();
    }
});

document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('modal-itens-edital').classList.add('hidden');
});

document.getElementById('close-modal-footer').addEventListener('click', () => {
    document.getElementById('modal-itens-edital').classList.add('hidden');
});


// Chama a função para carregar as modalidades ao carregar a página
document.addEventListener('DOMContentLoaded', carregarModalidades);

document.getElementById('limpar-button').addEventListener('click', () => {
    // Limpa o conteúdo da modal
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = '';

    // Fecha a modal
    document.getElementById('modal-itens-edital').classList.add('hidden');
});
async function carregarModalidades() {
    const selectModalidade = document.getElementById('search-modalidade');

    try {
        const response = await fetch('https://pncp.gov.br/api/pncp/v1/modalidades?statusAtivo=true', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao carregar modalidades: ${response.statusText}`);
        }

        const modalidades = await response.json();

        // Limpa o combo antes de adicionar as opções
        selectModalidade.innerHTML = '<option value="0">Selecione uma modalidade</option>';

        // Preenche o combo com as modalidades retornadas
        modalidades.forEach(modalidade => {
            const option = document.createElement('option');
            option.value = modalidade.id; // Define o ID como value
            option.textContent = modalidade.nome; // Define o nome como texto visível
            selectModalidade.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar modalidades:', error);
    }
}

async function fetchAndRenderData() {
    const dataInicio = document.getElementById('search-data-inicio').value;
    const dataFim = document.getElementById('search-data-fim').value;
    const modalidade = document.getElementById("search-modalidade").value;
    const estado = document.getElementById("search-estado").value;
    const licitacoesBody = document.getElementById("licitacoes-body");
    const termo = document.getElementById("search-termo").value;

    if (!dataInicio && !dataFim) {
        alert('Por favor, preencha as datas de início e fim.');
        return;
    }else if ((dataInicio && dataFim) && estado =="0") {
        const formattedDataInicio = dataInicio.replace(/-/g, '');
        const formattedDataFim = dataFim.replace(/-/g, '');
        apiUrl = `https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao?dataInicial=${formattedDataInicio}&dataFinal=${formattedDataFim}&codigoModalidadeContratacao=${modalidade}&pagina=${currentPage}&tamanhoPagina=${resultsPerPage}`;
    }else if ((dataInicio && dataFim) && estado != "0") {
        const formattedDataInicio = dataInicio.replace(/-/g, '');
        const formattedDataFim = dataFim.replace(/-/g, '');
        apiUrl = `https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao?dataInicial=${formattedDataInicio}&dataFinal=${formattedDataFim}&codigoModalidadeContratacao=${modalidade}&uf=${estado}&pagina=${currentPage}&tamanhoPagina=${resultsPerPage}`;  
    }

    licitacoesBody.innerHTML = ''; // Limpa os painéis antes de adicionar novos

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': '*/*'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        responseData = await response.json();
        if(termo != ''){
            responseData.data = responseData.data.filter(item => item.objetoCompra.toLowerCase().includes(termo.toLowerCase()));
        }

        if (responseData.data && Array.isArray(responseData.data)) {
            const licitacoesResults = document.getElementById("licitacoes-results");
            licitacoesResults.classList.remove("hidden");

            responseData.data.forEach(item => {
                const panel = document.createElement("div");
                panel.className = "p-4 bg-gray-100 rounded-lg shadow-md";

                panel.innerHTML = `
                    <p class="text-lg font-bold text-blue-600">${item.modalidadeNome}  ${item.processo} Município de ${item.unidadeOrgao.municipioNome}</h3>
                    <p><strong>Unidade Órgão:</strong> ${item.processo}</p>
                    <p><strong>Ano Compra:</strong> ${item.anoCompra || 'Não informado'}</p>
                    <p>${item.objetoCompra}</p>
                    <div class="flex space-x-2 mt-4">
                        <p><strong>Valor Total Estimado:</strong> ${item.valorTotalEstimado?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'Não informado'}</p>
                        <p><strong>Portal:</strong> ${item.usuarioNome || 'Não informado'}</p>
                        <p><strong>Data Encerramento:</strong> ${item.dataEncerramentoProposta ? new Date(item.dataEncerramentoProposta).toLocaleDateString('pt-BR') : 'Não informado'}</p>
                    </div>
                    <div class="flex space-x-2 mt-4">
                        <button class="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Participar
                        </button>
                        <button class="bg-gray-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                            Arquivos
                        </button>
                        <button class="bg-green-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" data-item='${JSON.stringify(item)}' onclick="toggleItensEdital(this)">
                            Ver Itens do Edital
                        </button>
                    </div>`;

                licitacoesBody.appendChild(panel);
            });

            // Atualiza a paginação
            totalPages = Math.ceil(responseData.totalRegistros / resultsPerPage);
            document.getElementById('current-page').textContent = `Página ${currentPage} de ${totalPages}`;
            document.getElementById('pagination-controls').classList.remove('hidden');
        } else {
            console.error('Os dados retornados não são um array ou estão vazios.');
        }
    } catch (error) {
        console.error('Erro ao buscar licitações:', error);
    }
}
async function toggleItensEdital(button) {
    const modal = document.getElementById("modal-itens-edital");
    const modalContent = document.getElementById("modal-content");
    const item = JSON.parse(button.dataset.item);
    // Limpa o conteúdo da modal antes de carregar os novos itens
    modalContent.innerHTML = '<p class="text-gray-500">Carregando itens...</p>';
    const apiUrlItem = `https://pncp.gov.br/api/pncp/v1/orgaos/${item.orgaoEntidade.cnpj}/compras/${item.anoCompra}/${item.sequencialCompra}/itens?pagina=1`;
;
    try {
        // Faz a requisição à API
        const response = await fetch(apiUrlItem, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar itens do edital: ${response.statusText}`);
        }

        const data = await response.json();

        // Verifica se há itens retornados
        if (data) {
            let tableRows = '';
        
            // Itera sobre os itens usando forEach
            data.forEach(item => {
                tableRows += `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">${item.numeroItem}</td>
                        <td class="px-6 py-4 whitespace-normal text-sm text-gray-900 border border-gray-300">${item.descricao || 'Não informado'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">${item.quantidade || 'Não informado'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">${item.valorUnitarioEstimado?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'Não informado'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">${(item.quantidade && item.valorUnitarioEstimado) ? (item.quantidade * item.valorUnitarioEstimado).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Não informado'}</td>
                    </tr>
                `;
            });
        
            // Insere as linhas na tabela
            modalContent.innerHTML = `
                <table class="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">Número</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">Descrição</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">Quantidade</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">Valor Unitário Estimado</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">Valor Total Estimado</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${tableRows}
                    </tbody>
                </table>
            `;
        } else {
            modalContent.innerHTML = '<p class="text-gray-500">Nenhum item encontrado.</p>';
        }
    } catch (error) {
        console.error('Erro ao buscar itens do edital:', error);
        modalContent.innerHTML = '<p class="text-red-500">Erro ao carregar os itens. Tente novamente mais tarde.</p>';
    }

    // Exibe a modal
    modal.classList.remove("hidden");
}