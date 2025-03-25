document.addEventListener("DOMContentLoaded", async () => {
  const comercioList = document.getElementById("comercio-list");
  const searchInput = document.getElementById("searchInput");
  const urlParams = new URLSearchParams(window.location.search);
  const comercioId = urlParams.get("id");

  // Agora você pode usar o comercioId para buscar e exibir as avaliações
  console.log("ID do comércio:", comercioId);

  // Armazena todos os comércios carregados
  let allComercios = [];

  async function carregarDestaque() {
    try {
      const response = await fetch(
        "https://encontreoficialback.azurewebsites.net/all-businesses-details"
      );
      const data = await response.json();

      // Ordena os comércios: maior nota primeiro; em caso de empate, menor gasto primeiro
      data.sort((a, b) => {
        const notaA = parseFloat(a.nota_media) || 0;
        const notaB = parseFloat(b.nota_media) || 0;
        if (notaB !== notaA) return notaB - notaA;
        const gastoA =
          a.menor_valor_gasto === null
            ? Infinity
            : parseFloat(a.menor_valor_gasto);
        const gastoB =
          b.menor_valor_gasto === null
            ? Infinity
            : parseFloat(b.menor_valor_gasto);
        return gastoA - gastoB;
      });

      const destaque = data[0];

      // Criação do container destaque
      let destaqueHTML = `
        <div class="comercio-destaque-card">
          <div class="destaque-icone">🏆</div>
          <h3 class="destaque-titulo">Comércio Destaque</h3>
          <div class="destaque-info">
            <p class="destaque-nome">${
              destaque.comercio_nome || destaque.nome
            }</p>
            <p class="destaque-nota">⭐ ${
              destaque.nota_media
                ? parseFloat(destaque.nota_media).toFixed(1)
                : "N/A"
            }</p>
          </div>
          <div class="destaque-botoes">
            <button class="destaque-maps-btn" onclick="window.open('https://www.google.com/maps/search/${encodeURIComponent(
              destaque.endereco || ""
            )}', '_blank')">
              abrir no  Maps
          </div>
           <h3 class="destaque-titulo">veja os comercios avaliados na tela avaliações ⭐</h3>
        </div>
      `;

      const destaqueContainer = document.getElementById("comercio-destaque");
      if (destaqueContainer) {
        destaqueContainer.innerHTML = destaqueHTML;
      }
    } catch (error) {
      console.error("Erro ao carregar comércio destaque:", error);
    }
  }

  function irParaOutraTela(comercioId) {
    window.location.href = `/buscaravaliacao.html?id=${comercioId}`;
  }

  // Chamar a função ao iniciar a página
  carregarDestaque();

  // Função que carrega os comércios da API (com filtro opcional por categoria)
  async function carregarComercios(categoria = "todos") {
    try {
      // Exibe skeleton loader enquanto carrega
      comercioList.innerHTML = `
              <div class="skeleton-card">
                  <div class="skeleton skeleton-image"></div>
                  <div class="skeleton skeleton-text"></div>
                  <div class="skeleton skeleton-text" style="width: 60%;"></div>
              </div>
              <div class="skeleton-card">
                  <div class="skeleton skeleton-image"></div>
                  <div class="skeleton skeleton-text"></div>
                  <div class="skeleton skeleton-text" style="width: 60%;"></div>
              </div>
              <div class="skeleton-card">
                  <div class="skeleton skeleton-image"></div>
                  <div class="skeleton skeleton-text"></div>
                  <div class="skeleton skeleton-text" style="width: 60%;"></div>
              </div>
        `;

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

  // Função que renderiza os comércios na tela (com limite de 50)
  function renderComercios(comercios) {
    comercioList.innerHTML = "";
    if (comercios.length === 0) {
      comercioList.innerHTML = "<p>Nenhum comércio encontrado.</p>";
      return;
    }

    // Limita o número de comércios exibidos a 50
    const comerciosLimitados = comercios.slice(0, 20);

    comerciosLimitados.forEach((comercio, index) => {
      const comercioItem = document.createElement("div");
      comercioItem.classList.add("comercio-card");

      let imagens = [];
      if (comercio.imagem_capa) imagens.push(comercio.imagem_capa);
      if (comercio.imagem_capa_2) imagens.push(comercio.imagem_capa_2);
      if (comercio.imagem_capa_3) imagens.push(comercio.imagem_capa_3);

      let imagensHtml = imagens
        .map(
          (img, i) =>
            `<img src="${img}" class="comercio-imagem ${
              i === 0 ? "active" : ""
            }" data-index="${i}" />`
        )
        .join("");

      let controlsHtml =
        imagens.length > 1
          ? `<button class="prev">&#10094;</button>
           <button class="next">&#10095;</button>`
          : "";

      let socialLinksHtml = `
      <div class="comercio-links">
        <a href="${
          comercio.link_facebook || "#"
        }" target="_blank" class="btn-social ${
        comercio.link_facebook ? "" : "disabled"
      }">
          Facebook ${comercio.link_facebook ? "" : "(Indisponível)"}
        </a>
        <a href="${
          comercio.link_instagram || "#"
        }" target="_blank" class="btn-social ${
        comercio.link_instagram ? "" : "disabled"
      }">
          Instagram ${comercio.link_instagram ? "" : "(Indisponível)"}
        </a>
        <a href="${
          comercio.link_site_pessoal || "#"
        }" target="_blank" class="btn-social ${
        comercio.link_site_pessoal ? "" : "disabled"
      }">
          Site ${comercio.link_site_pessoal ? "" : "(Indisponível)"}
        </a>
        <a href="${
          comercio.telefone
            ? `https://wa.me/${comercio.telefone.replace(/\D/g, "")}`
            : "#"
        }" target="_blank" class="btn-social ${
        comercio.telefone ? "" : "disabled"
      }">
          WhatsApp ${comercio.telefone ? "" : "(Indisponível)"}
        </a>
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
      <p><strong>Horário:</strong> ${
        comercio.horario_funcionamento || "Não informado"
      }</p>
      ${socialLinksHtml}
    `;

      comercioList.appendChild(comercioItem);

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
    });
  });

  // Carrega o destaque e os comércios ao iniciar a página
  carregarDestaque();
  carregarComercios();
});

// Outras funções auxiliares
function toggleMenu() {
  document.getElementById("nav").classList.toggle("show");
}

let currentIndex = 0;
function moveSlide(direction) {
  const slides = document.querySelectorAll(".carousel-slide");
  const totalSlides = slides.length;
  currentIndex += direction;
  if (currentIndex >= totalSlides) {
    currentIndex = 0;
  } else if (currentIndex < 0) {
    currentIndex = totalSlides - 1;
  }
  document.querySelector(".carousel-container").style.transform = `translateX(${
    -currentIndex * 100
  }%)`;
}

document.addEventListener("DOMContentLoaded", () => {
  // Verifica se o cookie já foi aceito
  if (getCookie("privacyAccepted") === "true") {
    document.getElementById("privacyPopup").style.display = "none";
  } else {
    document.getElementById("privacyPopup").style.display = "block"; // Exibe o pop-up
  }
});

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}

function acceptPrivacy() {
  const checkbox = document.getElementById("privacyCheckbox");
  if (!checkbox.checked) {
    alert("Por favor, marque a caixa para aceitar a política de privacidade.");
    return;
  }
  setCookie("privacyAccepted", "true", 30);
  document.getElementById("privacyPopup").style.display = "none";
}

function startVoiceSearch() {
  if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "pt-BR";
    recognition.start();
    recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      document.getElementById("searchInput").value = transcript;
      performSearch(); // Dispara a busca automática
    };
    recognition.onerror = function (event) {
      alert("Erro ao capturar voz. Tente novamente!");
    };
  } else {
    alert("Seu navegador não suporta pesquisa por voz.");
  }
}

function openPopup() {
  const popup = document.getElementById("privacyPopup");
  popup.style.display = "flex"; // Exibir o popup corretamente
}

function closePopup() {
  const popup = document.getElementById("privacyPopup");
  popup.style.display = "none"; // Ocultar o popup
}

function scrollCategories(direction) {
  const categories = document.querySelector(".categories");
  const scrollAmount = 300; // ajuste conforme necessário

  if (direction === "left") {
    categories.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  } else if (direction === "right") {
    categories.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  }
}
