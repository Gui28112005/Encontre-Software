document.addEventListener("DOMContentLoaded", async () => {
  const comercioList = document.getElementById("comercio-list");
  const searchInput = document.getElementById("searchInput");
  const categoriaTextoEl = document.getElementById("categoriaSelecionadaTexto");
  const loading = document.getElementById("loading");
  const comercioSection = document.getElementById("comercio-list");

  window.allComercios = [];

  async function carregarComercios(categoria = "todos") {
    try {
      if (loading) loading.style.display = "flex";

      let url = "https://encontreoficialback.azurewebsites.net/comercios";
      if (categoria !== "todos") {
        url += `?categoria=${encodeURIComponent(categoria)}`;
      }

      const response = await fetch(url);
      const comercios = await response.json();

      window.allComercios = comercios;

      renderComercios(comercios);
    } catch (error) {
      console.error("Erro ao carregar comércios:", error);
      if (comercioList) {
        comercioList.innerHTML = "<p>Erro ao carregar comércios.</p>";
      }
    } finally {
      if (loading) loading.style.display = "none";
    }
  }

  function renderComercios(comercios) {
    if (!comercioList) return;

    comercioList.innerHTML = "";

    if (comercios.length === 0) {
      comercioList.innerHTML = `
        <div class="no-results">
          <div class="icon">⚠️</div>
          <p>Nenhum comércio encontrado.</p>
        </div>
      `;
      return;
    }

    comercios.forEach((comercio, index) => {
      const comercioItem = document.createElement("div");
      comercioItem.classList.add("comercio-card");

      let imagens = [];
      if (comercio.imagem_capa) imagens.push(comercio.imagem_capa);
      if (comercio.imagem_capa_2) imagens.push(comercio.imagem_capa_2);
      if (comercio.imagem_capa_3) imagens.push(comercio.imagem_capa_3);

      let imagensHtml = imagens
        .map(
          (img, i) => `
            <img src="${img}" class="comercio-imagem ${
            i === 0 ? "active" : ""
          }" data-index="${i}" />
          `
        )
        .join("");

      let controlsHtml =
        imagens.length > 1
          ? `
              <button class="prev">&#10094;</button>
              <button class="next">&#10095;</button>
            `
          : "";

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
          ${
            comercio.endereco
              ? `<a href="${comercio.endereco}" target="_blank" class="btn-social">Maps</a>`
              : ""
          }
        </div>
      `;

      comercioItem.innerHTML = `
        <div class="comercio-card-content">
          <h3>${comercio.nome}</h3>
          <div class="carrossel" id="carrossel-${index}">
            ${imagensHtml}
            ${controlsHtml}
          </div>
          <div id="detalhes-${
            comercio.id
          }" class="detalhes" style="display:none">
            <p><strong>Categoria:</strong> ${comercio.categoria}</p>
            <p><strong>Endereço:</strong> ${comercio.endereco}</p>
            <p><strong>Horário:</strong> ${
              comercio.horario_funcionamento || "Não informado"
            }</p>
            <p><strong>Descrição:</strong> ${
              comercio.descricao || "Sem descrição"
            }</p>
            <p><strong>Contato:</strong> ${
              comercio.contato || "Não disponível"
            }</p>
            ${socialLinksHtml}
                  <button onclick="compartilharComercio(${
                    comercio.id
                  })" class="btn-compartilhar">
           Compartilhar comércio 🔗
           </button>
          </div>
        </div>
      `;

      comercioList.appendChild(comercioItem);

      if (imagens.length > 1) {
        const carrossel = comercioItem.querySelector(".carrossel");
        const prevButton = carrossel.querySelector(".prev");
        const nextButton = carrossel.querySelector(".next");

        prevButton?.addEventListener("click", () => mudarImagem(carrossel, -1));
        nextButton?.addEventListener("click", () => mudarImagem(carrossel, 1));

        iniciarCarrossel(carrossel);
      }
    });
  }

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

  document.querySelectorAll(".category").forEach((category) => {
    category.addEventListener("click", () => {
      const categoriaSelecionada = category.getAttribute("data-category");
      carregarComercios(categoriaSelecionada);

      if (comercioSection) {
        comercioSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      const categoriaTexto = category.querySelector("h3")?.innerText;
      if (categoriaTextoEl) {
        categoriaTextoEl.innerText = `Comércios de ${categoriaTexto}`;
      }
    });
  });

  carregarComercios();
});

// Funções globais
window.toggleFavorite = function (comercioId) {
  const icon = document.getElementById(`favorite-icon-${comercioId}`);
  if (icon.classList.contains("fas")) {
    icon.classList.remove("fas");
    icon.classList.add("far");
  } else {
    icon.classList.remove("far");
    icon.classList.add("fas");
  }
};

window.toggleMenu = function () {
  document.getElementById("nav").classList.toggle("show");
};

window.scrollCategorias = function (direction) {
  const container = document.querySelector(".categories");
  const scrollAmount = 300;
  container.scrollBy({
    left: direction * scrollAmount,
    behavior: "smooth",
  });
};

window.verMais = function (comercioId) {
  const detalhes = document.getElementById(`detalhes-${comercioId}`);
  const btn = document.querySelector(
    `button[onclick="verMais(${comercioId})"]`
  );

  if (detalhes.style.display === "none" || detalhes.style.display === "") {
    detalhes.style.display = "block";
    if (btn) btn.textContent = "Ver menos";
  } else {
    detalhes.style.display = "none";
    if (btn) btn.textContent = "Ver mais";
  }
};

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
window.compartilharComercio = function (comercioId) {
  const comercio = window.allComercios.find((c) => c.id === comercioId);
  if (!comercio) return;

  const texto = `${comercio.nome}\n${
    comercio.descricao || ""
  }\nVeja mais no Encontre!`;
  const url = `${window.location.origin}/comercio.html?id=${comercioId}`;

  if (navigator.share) {
    navigator
      .share({
        title: comercio.nome,
        text: texto,
        url: url,
      })
      .then(() => console.log("Compartilhado com sucesso"))
      .catch((err) => console.error("Erro ao compartilhar:", err));
  } else {
    navigator.clipboard.writeText(url);
    alert("Link copiado para a área de transferência!");
  }
};
