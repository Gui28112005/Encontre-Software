document
  .getElementById("go-to-site-button")
  .addEventListener("click", function () {
    window.location.href = "aviso.html";
  });

document
  .getElementById("back-to-form-button")
  .addEventListener("click", function () {
    window.location.href = "encontrenegocio1.html";
  });

function toggleMenu() {
  document.querySelector(".header-buttons").classList.toggle("show");
}
