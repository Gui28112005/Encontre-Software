const urlParams = new URLSearchParams(window.location.search);
const targetUrl = urlParams.get("url") || "https://postimages.org/";
let timeLeft = 10;

const countdownElement = document.getElementById("countdown");
const countdownInterval = setInterval(() => {
  timeLeft--;
  countdownElement.textContent = timeLeft;
  if (timeLeft <= 0) {
    clearInterval(countdownInterval);
    window.location.href = targetUrl;
  }
}, 1000);

document.getElementById("cancel-btn").addEventListener("click", function () {
  clearInterval(countdownInterval);
  window.history.back();
});

document.getElementById("go-now-btn").addEventListener("click", function () {
  clearInterval(countdownInterval);
  window.location.href = targetUrl;
});
