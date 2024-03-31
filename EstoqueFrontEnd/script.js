function adicionarProduto() {

    const produto = document.getElementById('itemadicionar').value;
    const quantidade = document.getElementById('quantidadeAdicionar').value;

    if(quantidade <= 0)
    {
        alert("A quantidade do produto deve ser maior que 0.");
        return;
    }

    dados = { 
        nome: produto, 
        quantidade: quantidade
    };

    fetch("https://localhost:7038/estoque", {
        method: 'POST', 
        headers: {
            'Content-Type' : 'Application/json'
        },
        body: JSON.stringify(dados)
    })
    .then(response => {
        if(!response.ok) {
            throw new Error("Erro ao enviar dados");
        }
        return response.json();
    })
    .then(data => {
        alert("Produto adicionado ao estoque");
    })
    .catch(error => {
        console.error('erro:', error);
    });
};
document.getElementById('botaoAdicionar').addEventListener('click', (event) => {
    event.preventDefault();
    adicionarProduto();
});

function pesquisarEstoque() {
    const itemPesquisado = document.getElementById("itemPesquisar").value;

    fetch(`https://localhost:7038/estoque/pesquisarnoestoque?nome=${itemPesquisado}`, {
        method: 'GET',
        headers: {
            'Content-Type' : 'Application/json'
        }
    })
    .then(response => {
        if(!response.ok) {
            throw new Error("Erro ao pesquisar");
        }
        return response.json();
    })
    .then(data => {

        const tbody = document.querySelector('.tabela-produto tbody');
        tbody.innerHTML = '';

        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.id}</td>
                <td>${item.nome}</td>
                <td>${item.quantidade}</td>
            `;
            tbody.appendChild(tr);
        });
    })
    .catch(error => {
        console.error('erro:', error);
    });
}
document.getElementById('botaoProcurar').addEventListener('click', (event) => {
    event.preventDefault();
    pesquisarEstoque();
});


function removerProduto() {
    const produtoId = document.getElementById('idProduto').value;
    const quantidade = document.getElementById('quantidadeRemover').value;


    fetch(`https://localhost:7038/Estoque/${produtoId}?quantidade=${quantidade} `, {
        method: 'DELETE',
        headers: {
            'Content-Type' : 'Application/json'
        }
    })
        .then(response => {
        if(!response.ok) {
            alert("Quantidade inserida maior que disponivel no estoque");
        }
        return response.json();
    })
    .then(data => {
        alert("Produto Removido do estoque");
    })
    .catch(error => {
        console.error('erro:', error);
    });
}
document.getElementById('botaoRemover').addEventListener('click', (event) => {
    event.preventDefault();
    removerProduto();
});

function estoqueCompleto() {
    fetch('https://localhost:7038/Estoque/visualizarestoque', {
        method: 'GET',
        headers: {
            'Content-Type' : 'Application/json'
        }
    })
    .then(response => {
        if(!response.ok) {
            throw new Error("Erro ao obter dados do estoque");
        }
        return response.json();
    })
    .then(data => {

        const tbody = document.querySelector('.tabela-produto tbody');
        tbody.innerHTML = '';

        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.id}</td>
                <td>${item.nome}</td>
                <td>${item.quantidade}</td>
            `;
            tbody.appendChild(tr);
        });
    })
    .catch(error => {
        console.error('erro:', error);
    });
};
document.getElementById("visualizarEstoque").addEventListener("click", (event) => {
    event.preventDefault();
    estoqueCompleto();
});

document.getElementById('limparTabela').addEventListener('click', () => {
    const tbody = document.querySelector('.tabela-produto tbody');
    tbody.innerHTML = '';
});
