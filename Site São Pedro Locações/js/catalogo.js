document.addEventListener("DOMContentLoaded", async () => {
  const comercioList = document.getElementById("comercio-list");
  const searchInput = document.getElementById("searchInput");

  // Armazena todos os comércios carregados
  let allComercios = [];

  // Função que carrega os comércios da API (com filtro opcional por categoria)
  async function carregarComercios(categoria = "todos") {
    try {
      let url = "https://encontreoficialback.azurewebsites.net/comercios";
      if (categoria !== "todos") {
        url += `?categoria=${categoria}`;
      }

      const response = await fetch(url);
      const comercios = await response.json();

      // Armazena os dados para a busca global
      allComercios = comercios;
      renderComercios(comercios);
    } catch (error) {
      console.error("Erro ao carregar comércios:", error);
      comercioList.innerHTML = "<p>Erro ao carregar comércios.</p>";
    }
  }

  // Função para renderizar os comércios na tela
  function renderComercios(comercios) {
    comercioList.innerHTML = "";
    if (comercios.length === 0) {
      comercioList.innerHTML = "<p>Nenhum comércio encontrado.</p>";
      return;
    }

    comercios.forEach((comercio, index) => {
      const comercioItem = document.createElement("div");
      comercioItem.classList.add("comercio-card");

      // Coleta as imagens disponíveis
      let imagens = [];
      if (comercio.imagem_capa) imagens.push(comercio.imagem_capa);
      if (comercio.imagem_capa_2) imagens.push(comercio.imagem_capa_2);
      if (comercio.imagem_capa_3) imagens.push(comercio.imagem_capa_3);

      // Cria o HTML para as imagens
      let imagensHtml = imagens
        .map(
          (img, i) =>
            `<img src="${img}" class="comercio-imagem ${
              i === 0 ? "active" : ""
            }" data-index="${i}" />`
        )
        .join("");

      // Adiciona controles se houver mais de uma imagem
      let controlsHtml =
        imagens.length > 1
          ? ` 
              <button class="prev">&#10094;</button>
              <button class="next">&#10095;</button>
            `
          : "";

      // Cria os botões sociais se os links estiverem disponíveis
      let socialLinksHtml = `
            <div class="comercio-links">
              ${
                comercio.link_facebook
                  ? `<a href="${comercio.link_facebook}" target="_blank" class="btn-social">Facebook</a>`
                  : ""
              }
              ${
                comercio.link_instagram
                  ? `<a href="${comercio.link_instagram}" target="_blank" class="btn-social">Instagram</a>`
                  : ""
              }
              ${
                comercio.link_site_pessoal
                  ? `<a href="${comercio.link_site_pessoal}" target="_blank" class="btn-social">Site</a>`
                  : ""
              }
            </div>
          `;

      comercioItem.innerHTML = `
      <div class="carrossel" id="carrossel-${index}">
          ${imagensHtml}
          ${controlsHtml}
      </div>
      <h3>${comercio.nome}</h3>
      <p><strong>Categoria:</strong> ${comercio.categoria}</p>
      <p><strong>Endereço:</strong> ${comercio.endereco}</p>
      <p><strong>Horário:</strong> ${comercio.horario_funcionamento || "Não informado"}</p>
      <p><strong>Descrição:</strong></p>
      <p>${comercio.descricao || ""}</p>
      ${socialLinksHtml}
      <button class="favorite-btn" onclick="toggleFavorite(${comercio.id})">
          <i class="fas fa-heart" id="favorite-icon-${comercio.id}"></i>
      </button>
    `;

      comercioList.appendChild(comercioItem);

      // Adiciona os event listeners dos botões do carrossel (se houver)
      if (imagens.length > 1) {
        const carrossel = comercioItem.querySelector(".carrossel");
        const prevButton = carrossel.querySelector(".prev");
        const nextButton = carrossel.querySelector(".next");

        prevButton.addEventListener("click", () => mudarImagem(carrossel, -1));
        nextButton.addEventListener("click", () => mudarImagem(carrossel, 1));

        iniciarCarrossel(carrossel);
      }
    });
  }

  // Função para alterar a imagem do carrossel
  function mudarImagem(carrossel, direction) {
    const imagens = carrossel.querySelectorAll(".comercio-imagem");
    let activeIndex = Array.from(imagens).findIndex((img) =>
      img.classList.contains("active")
    );
    imagens[activeIndex].classList.remove("active");

    let newIndex = (activeIndex + direction + imagens.length) % imagens.length;
    imagens[newIndex].classList.add("active");
  }

  function iniciarCarrossel(carrossel) {
    setInterval(() => mudarImagem(carrossel, 1), 3000);
  }

  // Função de busca que filtra por nome, categoria, endereço e descrição
  window.performSearch = function () {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
      renderComercios(allComercios);
      return;
    }
    const filtered = allComercios.filter(
      (comercio) =>
        (comercio.nome && comercio.nome.toLowerCase().includes(query)) ||
        (comercio.categoria &&
          comercio.categoria.toLowerCase().includes(query)) ||
        (comercio.endereco &&
          comercio.endereco.toLowerCase().includes(query)) ||
        (comercio.descricao && comercio.descricao.toLowerCase().includes(query))
    );
    renderComercios(filtered);
  };

  // Evento para clicar nas categorias e filtrar os comércios
  document.querySelectorAll(".category").forEach((category) => {
    category.addEventListener("click", () => {
      const categoriaSelecionada = category.getAttribute("data-category");
      carregarComercios(categoriaSelecionada);

      // Rola até a seção de comércios após o filtro
      document.getElementById("comercio").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Atualiza o texto da categoria selecionada
      const categoriaTexto = category.querySelector("h3").innerText;
      document.getElementById("categoriaSelecionadaTexto").innerText = `Comércios de ${categoriaTexto}`;
    });
  });

  // Carrega os comércios ao iniciar a página
  carregarComercios();
});

// Função para alternar o estado de favorito
function toggleFavorite(comercioId) {
  const icon = document.getElementById(`favorite-icon-${comercioId}`);
  // Verificar o estado atual (cheio ou vazio)
  if (icon.classList.contains('fas')) {
    icon.classList.remove('fas');
    icon.classList.add('far'); // Altera para o coração vazio
  } else {
    icon.classList.remove('far');
    icon.classList.add('fas'); // Altera para o coração cheio
  }
}
