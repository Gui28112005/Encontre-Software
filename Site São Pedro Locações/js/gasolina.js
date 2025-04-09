function toggleMenu() {
  const menu = document.querySelector(".header-buttons");
  menu.classList.toggle("show");
}

async function loadFuelPrices() {
  try {
    const response = await fetch("https://encontreoficialback.azurewebsites.net/fuel-prices");
    const data = await response.json();
    const tableBody = document
      .getElementById("fuel-list")
      .getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";

    data.forEach((post) => {
      const row = tableBody.insertRow();

      row.innerHTML = `
  <td>${post.nome}</td>
  <td>${post.endereco}</td>
  <td>${post.tipo_combustivel}</td>
  <td>${post.cidade}</td>
  <td>${post.estado}</td>
  <td class="price">R$ ${parseFloat(post.preco).toFixed(2)}</td>
  <td class="actions">
    <button class="edit-btn" onclick="editFuelPrice(${post.id}, '${
        post.preco
      }')">Editar Preço</button>
  </td>
`;
    });
  } catch (error) {
    console.error("Erro ao carregar os dados:", error);
  }
}

document
  .getElementById("add-fuel-price-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    const endereco = document.getElementById("endereco").value;
    const tipo_combustivel = document.getElementById("tipo_combustivel").value;
    const preco = document.getElementById("preco").value;
    const cidade = document.getElementById("cidade").value;
    const estado = document.getElementById("estado").value;

    try {
      const response = await fetch("https://encontreoficialback.azurewebsites.net/add-fuel-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          endereco,
          tipo_combustivel,
          preco,
          cidade,
          estado,
        }),
      });

      if (response.ok) {
        const result = await response.json(); // Supondo que o backend retorna o ID do posto cadastrado
        saveUserPost(result.id); // Salva o ID no localStorage
        alert("Posto cadastrado com sucesso!");
        loadFuelPrices();
      } else {
        alert("Erro ao cadastrar o posto.");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  });

async function editFuelPrice(id, currentPrice) {
  const newPrice = prompt(
    "Digite o novo valor (atual: R$ " +
      parseFloat(currentPrice).toFixed(2) +
      "):"
  );
  if (newPrice === null || newPrice === "") return;

  const normalizedPrice = newPrice.replace(",", ".");

  try {
    const response = await fetch(`https://encontreoficialback.azurewebsites.net/fuel-price/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preco: normalizedPrice }),
    });

    if (response.ok) {
      alert("Preço atualizado!");
      loadFuelPrices();
    } else {
      alert("Erro ao atualizar o preço.");
    }
  } catch (error) {
    console.error("Erro:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector("header");

  function toggleHeaderOnScroll() {
    if (!header) return;

    if (window.scrollY <= 0) {
      header.classList.remove("hide-header");
    } else {
      header.classList.add("hide-header");
    }
  }

  window.addEventListener("scroll", toggleHeaderOnScroll);
  toggleHeaderOnScroll();
});

function toggleMenu() {
  const headerButtons = document.querySelector(".header-buttons");
  headerButtons.classList.toggle("show");
}

async function loadFuelPrices(cidade = "", estado = "") {
  try {
    let url = "https://encontreoficialback.azurewebsites.net/fuel-prices"; //http://localhost:8080

    // Construir query parameters corretamente
    const params = new URLSearchParams();
    if (cidade) params.append("cidade", cidade);
    if (estado) params.append("estado", estado);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error("Erro ao buscar dados");

    const data = await response.json();
    const tableBody = document
      .getElementById("fuel-list")
      .getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";

    if (data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Nenhum posto encontrado.</td></tr>`;
      return;
    }

    data.forEach((post) => {
      const row = tableBody.insertRow();

      row.innerHTML = `
  <td>${post.nome}</td>
  <td>${post.endereco}</td>
  <td>${post.tipo_combustivel}</td>
  <td>${post.cidade}</td>
  <td>${post.estado}</td>
  <td class="price">R$ ${parseFloat(post.preco).toFixed(2)}</td>
  <td class="actions">
    <button class="edit-btn" onclick="editFuelPrice(${post.id}, '${
        post.preco
      }')">Editar</button>
    <button class="delete-btn" onclick="deleteFuelStation(${
      post.id
    })" style="background-color: red; color: white;">Excluir</button>
  </td>
`;
    });
  } catch (error) {
    console.error("Erro ao carregar os dados:", error);
  }
}

function filterFuelPrices() {
  const cidade = document.getElementById("filter-cidade").value;
  const estado = document.getElementById("filter-estado").value;
  loadFuelPrices(cidade, estado);
}

loadFuelPrices();

function searchFuelPrices() {
  const searchValue = document
    .getElementById("search-input")
    .value.toLowerCase();
  const rows = document.querySelectorAll("#fuel-list tbody tr");

  rows.forEach((row) => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(searchValue) ? "" : "none";
  });
}

async function deleteFuelStation(id) {
  if (!confirm("Tem certeza que deseja excluir este posto?")) return;

  try {
    const response = await fetch(`https://encontreoficialback.azurewebsites.net/fuel-station/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Posto excluído com sucesso!");
      loadFuelPrices();
    } else {
      alert("Erro ao excluir o posto.");
    }
  } catch (error) {
    console.error("Erro ao excluir o posto:", error);
  }
}

async function saveUserPost() {
  const nome = document.getElementById("nome").value;
  const endereco = document.getElementById("endereco").value;
  const cidade = document.getElementById("cidade").value;
  const estado = document.getElementById("estado").value;
  const tipo_combustivel = document.getElementById("tipo_combustivel").value;
  const preco = parseFloat(document.getElementById("preco").value);

  if (
    !nome ||
    !endereco ||
    !cidade ||
    !estado ||
    !tipo_combustivel ||
    isNaN(preco)
  ) {
    alert("Por favor, preencha todos os campos corretamente.");
    return;
  }

  try {
    const response = await fetch("https://encontreoficialback.azurewebsites.net/add-fuel-price", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome,
        endereco,
        cidade,
        estado,
        tipo_combustivel,
        preco,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Posto cadastrado com sucesso!");
      document.getElementById("add-fuel-price-form").reset();
    } else {
      alert("Erro ao cadastrar: " + data.message);
    }
  } catch (err) {
    console.error("Erro na requisição:", err);
    alert("Erro ao conectar com o servidor.");
  }
}
