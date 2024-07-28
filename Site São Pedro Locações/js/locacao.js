function acceptCookies() {
    var d = new Date();
    d.setTime(d.getTime() + (30*24*60*60*1000)); // 30 dias
    var expires = "expires=" + d.toUTCString();
    document.cookie = "cookies_accepted=true;" + expires + ";path=/";
    document.getElementById('cookie-consent').style.display = 'none';
    document.getElementById('consent-message').style.display = 'block';
}

window.onload = function() {
    if (document.cookie.indexOf("cookies_accepted=true") === -1) {
        setTimeout(function() {
            document.getElementById('cookie-consent').style.display = 'flex';
        }, 1000);
    } else {
        document.getElementById('consent-message').style.display = 'block';
    }
};