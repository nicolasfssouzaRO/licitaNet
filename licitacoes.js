let apiUrl = "";
let currentPage = 1; // Página inicial
const resultsPerPage = 10; // Número de resultados por página
let totalPages = 0;

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

async function fetchAndRenderData() {
    const dataInicio = document.getElementById('search-data-inicio').value;
    const dataFim = document.getElementById('search-data-fim').value;
    const tbody = document.getElementById("licitacoes-body");

    if (!dataInicio || !dataFim) {
        alert('Por favor, preencha as datas de início e fim.');
        return;
    }

    const formattedDataInicio = dataInicio.replace(/-/g, '');
    const formattedDataFim = dataFim.replace(/-/g, '');
    apiUrl = `https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao?dataInicial=${formattedDataInicio}&dataFinal=${formattedDataFim}&codigoModalidadeContratacao=1&pagina=${currentPage}&tamanhoPagina=${resultsPerPage}`;

    tbody.innerHTML = ''; // Limpa o corpo da tabela antes de adicionar novas linhas

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

        const responseData = await response.json();
        console.log(responseData); // Verifique os dados retornados

        if (responseData.data && Array.isArray(responseData.data)) {
            const licitacoesResults = document.getElementById("licitacoes-results");
            licitacoesResults.classList.remove("hidden");

            responseData.data.forEach(item => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.numeroCompra || 'Não informado'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.unidadeOrgao?.nomeUnidade || 'Não informado'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.anoCompra || 'Não informado'}</td>
                    <td class="px-6 py-4 whitespace-normal break-words text-sm text-gray-900">${item.objetoCompra || 'Não informado'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.valorTotalEstimado?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'Não informado'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.situacaoCompraNome || 'Não informado'}</td>
                `;

                tbody.appendChild(row);
            });

            // Atualiza a paginação
            totalPages = Math.ceil(responseData.totalRegistros / resultsPerPage); // Calcula o total de páginas
            document.getElementById('current-page').textContent = `Página ${currentPage} de ${totalPages}`;
            document.getElementById('pagination-controls').classList.remove('hidden');
        } else {
            console.error('Os dados retornados não são um array ou estão vazios.');
        }
    } catch (error) {
        console.error('Erro ao buscar licitações:', error);
    }
}