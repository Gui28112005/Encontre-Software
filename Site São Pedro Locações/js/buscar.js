document.addEventListener("DOMContentLoaded", function () {
  const comercioList = document
    .getElementById("mergedTable")
    .querySelector("tbody");
  const rankingContainer = document.getElementById("rankingContainer");
  const rankingUsersContainer = document.getElementById(
    "rankingUsersContainer"
  );

  // Exibe skeleton loader enquanto os dados carregam
  comercioList.innerHTML = `
        <tr>
            <td colspan="7">
                <div class="loading-container">
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
                </div>
            </td>
        </tr>
    `;

  // Busca e exibe os detalhes dos comércios
  fetch("https://encontreoficialback.azurewebsites.net/all-businesses-details")
    .then((response) => response.json())
    .then((data) => {
      // Remove skeleton loader
      comercioList.innerHTML = "";

      // Ordena os dados: maior nota_media primeiro; em caso de empate, menor valor gasto
      data.sort((a, b) => {
        const notaA = parseFloat(a.nota_media) || 0;
        const notaB = parseFloat(b.nota_media) || 0;
        if (notaB !== notaA) {
          return notaB - notaA;
        }
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

      // Seção de Ranking dos Top 3 Comercios com Cards
      const topThree = data.slice(0, 3);
      if (topThree.length > 0) {
        let rankingHTML = `
                  <h2 class="mb-4">Ranking dos Top 3 Comercios</h2>
                  <div class="row">
                `;
        topThree.forEach((item, index) => {
          let iconSrc = `./img/${index + 1}lugar.png`;
          let rating =
            item.total_avaliacoes > 0
              ? parseFloat(item.nota_media).toFixed(1)
              : "-";
          rankingHTML += `
                        <div class="col-md-4 mb-3">
                          <div class="card ranking-card">
                            <div class="card-body text-center">
                              <img src="${iconSrc}" class="ranking-icon mb-3" alt="${
            index + 1
          }º Lugar">
                              <h5 class="card-title">${index + 1}º Lugar</h5>
                              <p class="card-text"><strong>${
                                item.comercio_nome
                              }</strong><br>Nota: ${rating}</p>
                            </div>
                          </div>
                        </div>
                    `;
        });
        rankingHTML += `</div>`;
        rankingContainer.innerHTML = rankingHTML;
      }

      // Preenche a tabela completa com os detalhes de cada comércio
      data.forEach((item, index) => {
        const tr = document.createElement("tr");
        const position = index + 1;
        let positionContent = `<img src="./img/${
          position <= 3 ? position : "5"
        }lugar.png" class="position-image" alt="${position}º lugar">`;

        // Exibe apenas os dois primeiros horários de pico
        let horarios = "-";
        if (item.horario_pico) {
          const arr = item.horario_pico.split(",").map((h) => h.trim());
          horarios = arr.slice(0, 2).join(", ");
        }

        tr.innerHTML = `
                  <td>${positionContent}</td>
                  <td>${item.comercio_nome}</td>
                  <td>${
                    item.total_avaliacoes > 0
                      ? parseFloat(item.nota_media).toFixed(1)
                      : "-"
                  }</td>
                  <td>${horarios}</td>
                  <td>${
                    item.menor_valor_gasto !== null
                      ? "R$ " + parseFloat(item.menor_valor_gasto).toFixed(2)
                      : "-"
                  }</td>
                  <td>${item.cidade || "-"}</td>
                  <td>${
                    item.endereco
                      ? `<button class="btn btn-primary" onclick="window.open('https://www.google.com/maps/search/${encodeURIComponent(
                          item.endereco
                        )}', '_blank')"><i class="bi bi-geo-alt"></i>Mapa</button>`
                      : "-"
                  }</td>
                `;
        comercioList.appendChild(tr);
      });
    })
    .catch((error) => {
      console.error("Erro ao buscar dados dos comércios:", error);
      comercioList.innerHTML =
        "<tr><td colspan='7' style='text-align: center; color: red;'>Erro ao carregar os dados.</td></tr>";
    });

  // Busca e exibe o ranking dos avaliadores (pessoas que mais fizeram avaliações)
  fetch("https://encontreoficialback.azurewebsites.net/all-users-details")
    .then((response) => response.json())
    .then((users) => {
      // Ordena os usuários: os que mais fizeram avaliações primeiro
      users.sort((a, b) => b.total_avaliacoes - a.total_avaliacoes);

      // Seção de Ranking dos Top 3 Avaliadores com Cards
      const topThreeUsers = users.slice(0, 3);
      if (topThreeUsers.length > 0) {
        let rankingUsersHTML = `
                  <h2 class="mb-4">Ranking dos Top 3 Avaliadores</h2>
                  <div class="row">
                `;
        topThreeUsers.forEach((user, index) => {
          let iconSrc = `./img/${index + 1}lugar.png`;
          rankingUsersHTML += `
                        <div class="col-md-4 mb-3">
                          <div class="card ranking-card">
                            <div class="card-body text-center">
                              <img src="${iconSrc}" class="ranking-icon mb-3" alt="${
            index + 1
          }º Lugar">
                              <h5 class="card-title">${index + 1}º Lugar</h5>
                              <p class="card-text"><strong>${
                                user.usuario_nome
                              }</strong><br>Total de Avaliações: ${
            user.total_avaliacoes
          }</p>
                            </div>
                          </div>
                        </div>
                    `;
        });
        rankingUsersHTML += `</div>`;
        rankingUsersContainer.innerHTML = rankingUsersHTML;
      }
    })
    .catch((error) =>
      console.error("Erro ao buscar dados dos usuários:", error)
    );
});

// Controle do áudio de fundo
document.addEventListener("DOMContentLoaded", function () {
  const audio = document.getElementById("backgroundMusic");
  audio.volume = 0.5; // Define o volume (0.0 a 1.0)

  // Para garantir a reprodução automática em alguns navegadores
  document.body.addEventListener("click", function () {
    if (audio.paused) {
      audio.play();
    }
  });
});

// Função para filtrar comércios pelo nome
function filtrarComercios() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const rows = document.querySelectorAll("#mergedTable tbody tr");

  rows.forEach((row) => {
    const nomeComercio = row.cells[1].textContent.toLowerCase();
    row.style.display = nomeComercio.includes(input) ? "" : "none";
  });
}
