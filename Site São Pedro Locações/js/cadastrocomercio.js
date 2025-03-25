function updatePreview() {
  const nome = document.getElementById("nome").value;
  const categoria = document.getElementById("categoria").value;
  const cidade = document.getElementById("cidade").value;
  const estado = document.getElementById("estado").value;
  const telefone = document.getElementById("telefone").value;
  const descricao = document.getElementById("descricao").value;
  const linkCardapio = document.getElementById("link_cardapio").value;
  const linkFacebook = document.getElementById("link_facebook").value;
  const linkInstagram = document.getElementById("link_instagram").value;
  const linkSitePessoal = document.getElementById("link_site_pessoal").value;
  const imagemCapa = document.getElementById("imagem_capa").value;

  document.getElementById("previewNome").textContent =
    nome || "Nome do Comércio";
  document.getElementById("previewCategoria").textContent =
    categoria || "Categoria";
  document.getElementById("previewEndereco").textContent =
    (cidade || "Cidade") + " / " + (estado || "Estado");
  document.getElementById("previewTelefone").textContent =
    telefone || "Telefone";
  document.getElementById("previewDescricao").textContent =
    descricao || "Descrição do comércio";

  if (imagemCapa) {
    document.getElementById("previewImagem").src = imagemCapa;
  } else {
    document.getElementById("previewImagem").src =
      "https://via.placeholder.com/600x200?text=Imagem+Capa";
  }

  // Atualiza os botões de links
  const previewLinks = document.getElementById("previewLinks");
  if (previewLinks) {
    previewLinks.innerHTML = "";
    if (linkCardapio) {
      const btnCardapio = document.createElement("button");
      btnCardapio.textContent = "Cardápio";
      btnCardapio.className = "link-button";
      btnCardapio.onclick = () => window.open(linkCardapio, "_blank");
      previewLinks.appendChild(btnCardapio);
    }
    if (linkFacebook) {
      const btnFacebook = document.createElement("button");
      btnFacebook.textContent = "Facebook";
      btnFacebook.className = "link-button";
      btnFacebook.onclick = () => window.open(linkFacebook, "_blank");
      previewLinks.appendChild(btnFacebook);
    }
    if (linkInstagram) {
      const btnInstagram = document.createElement("button");
      btnInstagram.textContent = "Instagram";
      btnInstagram.className = "link-button";
      btnInstagram.onclick = () => window.open(linkInstagram, "_blank");
      previewLinks.appendChild(btnInstagram);
    }
    if (linkSitePessoal) {
      const btnSite = document.createElement("button");
      btnSite.textContent = "Site Pessoal";
      btnSite.className = "link-button";
      btnSite.onclick = () => window.open(linkSitePessoal, "_blank");
      previewLinks.appendChild(btnSite);
    }
  }
}

// Atualiza a pré-visualização em tempo real ao digitar
const inputs = document.querySelectorAll(
  "#comercioForm input, #comercioForm textarea, #comercioForm select"
);
inputs.forEach((input) => {
  input.addEventListener("input", updatePreview);
});

// Envio do formulário para o backend
document
  .getElementById("comercioForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    fetch("https://encontreoficialback.azurewebsites.net/comercios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObject),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          alert("Comércio cadastrado com sucesso! ID: " + data.id);
        } else {
          alert("Erro ao cadastrar o comércio.");
        }
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert("Erro ao cadastrar o comércio.");
      });
  });

// Função para alternar a exibição do menu em telas menores
function toggleMenu() {
  const menu = document.querySelector(".header-buttons");
  menu.classList.toggle("show");
}
