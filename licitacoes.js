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

// Chama a função para carregar as modalidades ao carregar a página
document.addEventListener('DOMContentLoaded', carregarModalidades);

async function fetchAndRenderData() {
    const dataInicio = document.getElementById('search-data-inicio').value;
    const dataFim = document.getElementById('search-data-fim').value;
    const modalidade = document.getElementById("search-modalidade").value;
    const estado = document.getElementById("search-estado").value;
    const licitacoesBody = document.getElementById("licitacoes-body");

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

        const responseData = await response.json();

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
                    <p><strong>Objeto Compra:</strong> ${item.objetoCompra || 'Não informado'}</p>
                    <div class="flex space-x-2 mt-4">
                        <p><strong>Valor Total Estimado:</strong> ${item.valorTotalEstimado?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'Não informado'}</p>
                        <p><strong>Portal:</strong> ${item.usuarioNome || 'Não informado'}</p>
                    </div>
                    <div class="flex space-x-2 mt-4">
                        <img src="icones/adicionar.png" alt="Participar" class="w-5 h-5 cursor-pointer" title="Participar">
                        <img src="icones/documento.png" alt="Arquivos" class="w-5 h-5 cursor-pointer" title="Arquivos">
                    </div>
                `;

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