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
    const licitacoesResults = document.getElementById("licitacoes-results");
    const paginationControls = document.getElementById("pagination-controls");
    const termo = document.getElementById("search-termo").value;

    // Limpa os resultados anteriores
    licitacoesBody.innerHTML = ''; // Limpa os painéis de resultados
    licitacoesResults.classList.add("hidden"); // Oculta a seção de resultados
    paginationControls.classList.add("hidden"); // Oculta os controles de paginação

    if (!dataInicio || !dataFim) {
        alert('Por favor, preencha as datas de início e fim.');
        return;
    }

    const formattedDataInicio = dataInicio.replace(/-/g, '');
    const formattedDataFim = dataFim.replace(/-/g, '');

    // Define a URL base da API
    let baseUrl = '';
    if (estado === "0" && modalidade === "0") {
        baseUrl = `https://pncp.gov.br/api/consulta/v1/contratos?dataInicial=${formattedDataInicio}&dataFinal=${formattedDataFim}&pagina=1`;
    } else if (estado !== "0" && modalidade !== "0") {
        baseUrl = `https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao?dataInicial=${formattedDataInicio}&dataFinal=${formattedDataFim}&codigoModalidadeContratacao=${modalidade}&uf=${estado}&pagina=1`;
    } else if (estado === "0" && modalidade !== "0") {
        baseUrl = `https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao?dataInicial=${formattedDataInicio}&dataFinal=${formattedDataFim}&codigoModalidadeContratacao=${modalidade}&pagina=1`;
    }

    try {
        // Faz a primeira requisição para obter o total de páginas
        const initialResponse = await fetch(`${baseUrl}&pagina=1&tamanhoPagina=${resultsPerPage}`, {
            method: 'GET',
            headers: {
                'Accept': '*/*'
            }
        });

        if (!initialResponse.ok) {
            throw new Error(`Erro na requisição: ${initialResponse.statusText}`);
        }

        const initialData = await initialResponse.json();
        totalPages = Math.ceil(initialData.totalRegistros / resultsPerPage);

        let allData = []; // Array para armazenar todos os resultados

        // Itera por todas as páginas para acumular os dados
        for (let page = 1; page <= totalPages; page++) {
            const pageUrl = `${baseUrl}&pagina=${page}&tamanhoPagina=${resultsPerPage}`;
            const response = await fetch(pageUrl, {
                method: 'GET',
                headers: {
                    'Accept': '*/*'
                }
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição da página ${page}: ${response.statusText}`);
            }

            const pageData = await response.json();
            allData = allData.concat(pageData.data); // Acumula os dados
        }

        // Aplica o filtro pelo termo, se fornecido
        if (termo) {
            allData = allData.filter(item =>
                item.objetoCompra &&
                item.objetoCompra.toLowerCase().includes(termo.toLowerCase())
            );
        }

        // Renderiza os resultados
        if (allData.length > 0) {
            licitacoesResults.classList.remove("hidden");

            allData.forEach(item => {
                const panel = document.createElement("div");
                panel.className = "p-4 bg-gray-100 rounded-lg shadow-md";

                panel.innerHTML = `
                    <p class="text-lg font-bold text-blue-600">${item.modalidadeNome} Nº Processo: ${item.numeroCompra} Município de ${item.unidadeOrgao.municipioNome}</h3>
                    <p><strong>Aviso de Contratação Direta nº: ${item.numeroCompra}/${item.anoCompra}</strong></p>
                    <p><strong>Nº Controle PNCP:</strong> ${item.numeroControlePNCP}</p>
                    <p><strong>Unidade Órgão:</strong> ${item.unidadeOrgao.codigoUnidade} - ${item.unidadeOrgao.nomeUnidade}</p>
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
                        <button class="bg-gray-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" data-item='${JSON.stringify(item)}' onclick="toggleArquivos(this)">
                            Arquivos
                        </button>
                        <button class="bg-green-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" data-item='${JSON.stringify(item)}' onclick="toggleItensEdital(this)">
                            Ver Itens do Edital
                        </button>
                    </div>`;

                licitacoesBody.appendChild(panel);
            });

            document.getElementById('current-page').textContent = `Página ${currentPage} de ${totalPages}`;
            paginationControls.classList.remove("hidden");
        } else {
            console.error('Nenhum dado encontrado após o filtro.');

            // Exibe o modal com a mensagem de erro
            const modal = document.getElementById("modal-itens-edital");
            const modalContent = document.getElementById("modal-content");
            modalContent.innerHTML = '<p class="text-red-500">Nenhum dado encontrado após o filtro.</p>';
            modal.classList.remove("hidden");
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

async function toggleArquivos(button) {
    const modal = document.getElementById("modal-itens-edital");
    const modalContent = document.getElementById("modal-content");
    const item = JSON.parse(button.dataset.item);
    const apiUrlItem = `https://pncp.gov.br/api/pncp/v1/orgaos/${item.orgaoEntidade.cnpj}/compras/${item.anoCompra}/${item.sequencialCompra}/arquivos`;

    try {
        // Faz a requisição à API
        const response = await fetch(apiUrlItem, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar arquivos: ${response.statusText}`);
        }

        const data = await response.json();

        // Verifica se há arquivos retornados
        if (data && Array.isArray(data)) {
            let tableRows = '';
            document.getElementById('titulo-modal').text = 'Arquivos do Edital';
            // Itera sobre os itens usando forEach
            data.forEach(item => {
                tableRows += `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border border-gray-300">${item.sequencialDocumento}</td>
                        <td class="px-6 py-4 whitespace-normal text-sm text-gray-900 border border-gray-300"><a href="${item.url}" target="_blank" class="text-blue-500 underline">
                            Baixar</a></td>
                    </tr>
                `;
            });
            
            // Insere as linhas na tabela
            modalContent.innerHTML = `
                <table class="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">Nº</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">Link do Arquivo</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${tableRows}
                    </tbody>
                </table>
            `;
        } else {
            modalContent.innerHTML = '<p class="text-gray-500">Nenhum arquivo encontrado.</p>';
        }
    } catch (error) {
        console.error('Erro ao buscar arquivos:', error);
        modalContent.innerHTML = '<p class="text-red-500">Erro ao carregar os arquivos. Tente novamente mais tarde.</p>';
    }

    // Exibe a modal
    modal.classList.remove("hidden");
}