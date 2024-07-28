        const carrinho = [];
        const produtosAdicionados = new Set();

        function adicionarAoCarrinho(button) {
            const produto = button.closest('.produto');
            const nome = produto.getAttribute('data-nome');
            const quantidadeInput = produto.querySelector('.quantidade');
            const quantidade = quantidadeInput ? parseInt(quantidadeInput.value, 10) : 1;

            if (quantidadeInput && (isNaN(quantidade) || quantidade <= 0)) {
                alert('Por favor, insira uma quantidade válida.');
                return;
            }

            if (produtosAdicionados.has(nome)) {
                alert(`${nome} já foi adicionado ao carrinho.`);
                return;
            }

            carrinho.push({ nome, quantidade });
            produtosAdicionados.add(nome);
            atualizarCarrinho();
            alert(`${nome} (${quantidade}) adicionado ao carrinho!`);
        }

        function atualizarCarrinho() {
            const lista = document.getElementById('carrinho-lista');
            const total = document.getElementById('carrinho-total');
            lista.innerHTML = '';
            let totalItens = 0;

            const contagem = carrinho.reduce((acc, item) => {
                if (!acc[item.nome]) {
                    acc[item.nome] = 0;
                }
                acc[item.nome] += item.quantidade;
                return acc;
            }, {});

            for (const [nome, quantidade] of Object.entries(contagem)) {
                const li = document.createElement('li');
                li.innerHTML = `${nome} <span>${quantidade}</span> <button onclick="removerDoCarrinho('${nome}')">Remover</button>`;
                lista.appendChild(li);
                totalItens += quantidade;
            }

            total.textContent = `Total de itens: ${totalItens}`;
        }

        function removerDoCarrinho(nome) {
            const index = carrinho.findIndex(item => item.nome === nome);
            if (index > -1) {
                carrinho.splice(index, 1);
                produtosAdicionados.delete(nome);
                atualizarCarrinho();
                alert(`${nome} removido do carrinho!`);
            }
        }

        function finalizar() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio.');
        return;
    }

    const numeroWhatsApp = '+5516994392545'; // Número de WhatsApp formatado
    const mensagem = carrinho.map(item => `${item.nome}: ${item.quantidade}`).join('\n');
    const textoMensagem = `Olá, gostaria de solicitar um orçamento para os seguintes produtos:\n\n${mensagem}`;
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(textoMensagem)}`;

    // Redireciona o usuário para o WhatsApp com a mensagem pré-preenchida
    window.location.href = urlWhatsApp;
    
    // Limpa o carrinho
    carrinho.length = 0;
    produtosAdicionados.clear();
    atualizarCarrinho();
}

        function voltar() {
            window.history.back();
        }