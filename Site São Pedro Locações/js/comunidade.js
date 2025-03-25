function searchBusiness() {
  const searchTerm = document.getElementById("comercio-search").value.trim();
  const resultsContainer = document.getElementById("search-results");
  const businessList = document.getElementById("business-list");
  const evaluationContainer = document.getElementById("evaluation-container");

  let url = "https://encontreoficialback.azurewebsites.net/search-business?";
  if (searchTerm) {
    url += `nome=${encodeURIComponent(searchTerm)}`;
  }

  if (searchTerm.length >= 3) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        businessList.innerHTML = "";

        if (data.message) {
          businessList.innerHTML += `<p>${data.message}</p>`;
        } else {
          data.forEach((item) => {
            const div = document.createElement("div");
            div.classList.add("business-item");
            div.innerHTML = `
              <strong>${item.nome}</strong>
              <button onclick="selectBusiness('${item.nome}')">Selecionar</button>
            `;
            businessList.appendChild(div);
          });

          resultsContainer.style.display = "block";
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar comércios:", error);
      });
  } else {
    resultsContainer.style.display = "none";
    evaluationContainer.style.display = "none";
  }
}

function selectBusiness(nome) {
  const comercioNomeInput = document.getElementById("comercio-nome");
  const comercioSearchInput = document.getElementById("comercio-search");
  const businessList = document.getElementById("business-list");
  const evaluationContainer = document.getElementById("evaluation-container");
  const resultsContainer = document.getElementById("search-results");

  comercioNomeInput.value = nome;
  comercioSearchInput.value = nome;
  businessList.innerHTML = "";

  resultsContainer.style.display = "block";
  evaluationContainer.style.display = "block";
}

// Submete a avaliação para o back-end
document
  .getElementById("rating-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const comercio_nome = document.getElementById("comercio-nome").value;
    const nome = document.getElementById("nome").value;
    const nota = document.getElementById("nota").value;
    const valor_gasto = document.getElementById("valor_gasto").value;
    const horario_pico = document.getElementById("horario_pico").value;

    if (!nome.trim()) {
      alert("Por favor, insira seu nome antes de enviar a avaliação.");
      return;
    }

    const ratingData = {
      comercio_nome: comercio_nome,
      nome: nome,
      nota: parseInt(nota),
      valor_gasto: parseFloat(valor_gasto),
      horario_pico: horario_pico,
    };

    fetch("https://encontreoficialback.azurewebsites.net/rate-business", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ratingData),
    })
      .then((response) => response.json())
      .then((data) => {
        const messageDiv = document.getElementById("message");
        if (data.message) {
          messageDiv.textContent = data.message;
          document.getElementById("rating-form").reset();
          loadRatedBusinesses();
        } else {
          messageDiv.textContent = "Erro ao enviar avaliação.";
        }
      })
      .catch((error) => {
        console.error("Erro:", error);
        document.getElementById("message").textContent =
          "Erro ao enviar avaliação.";
      });
  });

// Função para carregar e exibir os comércios avaliados
function loadRatedBusinesses() {
  fetch("https://encontreoficialback.azurewebsites.net/get-rated-businesses")
    .then((response) => response.json())
    .then((data) => {
      const ratedBusinesses = document.getElementById("rated-businesses");
      ratedBusinesses.innerHTML = "<h2>Comércios Avaliados</h2>";
      if (data.message) {
        ratedBusinesses.innerHTML += `<p>${data.message}</p>`;
      } else {
        data.forEach((item) => {
          const div = document.createElement("div");
          div.classList.add("business-item");
          div.innerHTML = `
            <strong>${item.comercio_nome}</strong>
            <p>Avaliador: <span class="avaliador">${item.avaliador_nome}</span></p>
            <p>Nota: <span class="nota">${item.nota}</span></p>
            <p>Valor Gasto: R$ ${item.valor_gasto}</p>
            <p>Horário de Pico: ${item.horario_pico}</p>
          `;
          ratedBusinesses.appendChild(div);
        });
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar comércios avaliados:", error);
    });
}

// Ajuste para esconder/mostrar o cabeçalho conforme a rolagem da página
document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".header");

  function toggleHeaderOnScroll() {
    if (window.scrollY <= 0) {
      header.classList.remove("hide-header");
    } else {
      header.classList.add("hide-header");
    }
  }

  window.addEventListener("scroll", toggleHeaderOnScroll);
  toggleHeaderOnScroll();

  loadRatedBusinesses();
});

function toggleMenu() {
  const menu = document.querySelector(".header-buttons");
  menu.classList.toggle("show");
}
