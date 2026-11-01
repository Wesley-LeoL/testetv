/*
 * Smart HUD — app web para o navegador da TV (Panasonic Viera / My Home Screen,
 * Android TV, Fire TV). Escrito em ES5 para funcionar em navegadores antigos de TV.
 */
(function () {
  "use strict";

  var cfg = window.HUD_CONFIG || {};

  // Códigos de tecla: setas/OK são padrão; botões coloridos e "voltar"
  // seguem o padrão HbbTV/CE-HTML usado pela Panasonic.
  var KEY = {
    LEFT: [37], UP: [38], RIGHT: [39], DOWN: [40],
    OK: [13],
    BACK: [8, 27, 166, 461, 10009],
    RED: [403, 82], GREEN: [404, 71], YELLOW: [405, 89], BLUE: [406, 66]
  };
  function is(code, name) { return KEY[name].indexOf(code) !== -1; }

  // ---------- Escala do palco 1920x1080 ----------
  var stage = document.getElementById("stage");
  function fit() {
    var s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    var ox = (window.innerWidth - 1920 * s) / 2;
    var oy = (window.innerHeight - 1080 * s) / 2;
    var t = "translate(" + ox + "px," + oy + "px) scale(" + s + ")";
    stage.style.webkitTransform = t;
    stage.style.transform = t;
  }
  window.addEventListener("resize", fit);
  fit();

  // ---------- Relógio e saudação ----------
  var DAYS = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
  var MONTHS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
                "agosto", "setembro", "outubro", "novembro", "dezembro"];
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  // Hora "local" calculada a partir do UTC + fuso configurado, para não depender
  // do fuso/relógio da TV. clockSkew é corrigido pela hora do servidor.
  var clockSkew = 0;
  var offsetH = typeof cfg.utcOffsetHours === "number" ? cfg.utcOffsetHours : -3;
  function now() {
    // Date com os campos getUTC* representando a hora local desejada
    return new Date(Date.now() + clockSkew + offsetH * 3600000);
  }
  function syncClock() {
    if (!cfg.syncClockWithServer || location.protocol.indexOf("http") !== 0) return;
    var xhr = new XMLHttpRequest();
    var t0 = Date.now();
    xhr.open("HEAD", location.href.split("#")[0].split("?")[0] + "?t=" + t0, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      var h = xhr.getResponseHeader("Date");
      var server = h ? Date.parse(h) : NaN;
      if (!isNaN(server)) {
        var skew = server - (t0 + Date.now()) / 2;
        // Header Date tem resolução de 1s: só corrige se a diferença for relevante
        clockSkew = Math.abs(skew) > 30000 ? skew : 0;
        tick();
      }
    };
    xhr.send();
  }

  function tick() {
    var d = now();
    var day = DAYS[d.getUTCDay()];
    document.getElementById("clock").textContent = pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes());
    document.getElementById("date").textContent =
      day.charAt(0).toUpperCase() + day.slice(1) + ", " + d.getUTCDate() + " de " +
      MONTHS[d.getUTCMonth()] + " de " + d.getUTCFullYear();
    var h = d.getUTCHours();
    var g = h < 5 ? "Boa noite" : (h < 12 ? "Bom dia" : (h < 18 ? "Boa tarde" : "Boa noite"));
    document.getElementById("greeting").textContent = g + (cfg.userName ? ", " + cfg.userName : "");
  }
  tick();
  setInterval(tick, 10000);
  syncClock();
  setInterval(syncClock, 6 * 3600000);

  // ---------- Clima (Open-Meteo, sem chave de API) ----------
  var WMO = {
    0: "Céu limpo", 1: "Predomínio de sol", 2: "Parcialmente nublado", 3: "Nublado",
    45: "Neblina", 48: "Neblina", 51: "Garoa", 53: "Garoa", 55: "Garoa forte",
    61: "Chuva fraca", 63: "Chuva", 65: "Chuva forte", 80: "Pancadas de chuva",
    81: "Pancadas de chuva", 82: "Temporal", 95: "Trovoadas", 96: "Trovoadas", 99: "Trovoadas"
  };
  function loadWeather() {
    var w = cfg.weather;
    var el = document.getElementById("weather");
    if (!w || !w.enabled) { el.style.display = "none"; return; }
    // Em página HTTP (TV sem suporte aos certificados atuais) usa a API em HTTP também
    var proto = location.protocol === "http:" ? "http:" : "https:";
    var url = proto + "//api.open-meteo.com/v1/forecast?latitude=" + w.latitude +
              "&longitude=" + w.longitude + "&current_weather=true&timezone=" + encodeURIComponent(w.timezone || "auto");
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        try {
          var c = JSON.parse(xhr.responseText).current_weather;
          document.getElementById("weather-temp").textContent = Math.round(c.temperature) + "°";
          document.getElementById("weather-desc").textContent =
            (WMO[c.weathercode] || "—") + " · " + (w.city || "");
          return;
        } catch (e) { /* cai no erro abaixo */ }
      }
      document.getElementById("weather-desc").textContent = "Clima indisponível";
    };
    xhr.send();
  }
  loadWeather();
  setInterval(loadWeather, 30 * 60 * 1000);

  // ---------- Atalhos ----------
  function buildRow(containerId, items) {
    var box = document.getElementById(containerId);
    for (var i = 0; i < (items || []).length; i++) {
      var it = items[i];
      var t = document.createElement("div");
      t.className = "tile";
      t.style.background = it.color || "#333";
      t.setAttribute("data-url", it.url);
      t.innerHTML = '<div class="icon"></div><div class="label"></div>';
      t.firstChild.textContent = it.icon || it.title.charAt(0);
      t.lastChild.textContent = it.title;
      box.appendChild(t);
    }
  }
  buildRow("tiles-apps", cfg.apps);
  buildRow("tiles-favorites", cfg.favorites);

  // ---------- Navegação espacial pelo controle ----------
  var tiles = Array.prototype.slice.call(document.querySelectorAll(".tile"));
  var current = null;

  function focus(el) {
    if (!el) return;
    if (current) current.className = current.className.replace(" focused", "");
    current = el;
    current.className += " focused";
    try { localStorage.setItem("hud.focus", String(tiles.indexOf(el))); } catch (e) {}
  }

  function center(el) {
    var r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  // Escolhe o atalho mais próximo na direção pedida
  function move(dx, dy) {
    if (!current) { focus(tiles[0]); return; }
    var c = center(current), best = null, bestScore = Infinity;
    for (var i = 0; i < tiles.length; i++) {
      var t = tiles[i];
      if (t === current) continue;
      var p = center(t), vx = p.x - c.x, vy = p.y - c.y;
      var along = vx * dx + vy * dy;          // distância na direção
      if (along <= 1) continue;
      var across = Math.abs(vx * dy) + Math.abs(vy * dx); // desvio lateral
      var score = along + across * 2.5;
      if (score < bestScore) { bestScore = score; best = t; }
    }
    if (best) focus(best);
  }

  function open(el) {
    var url = el && el.getAttribute("data-url");
    if (!url) return;
    toast("Abrindo " + el.lastChild.textContent + "…");
    setTimeout(function () { window.location.href = url; }, 300);
  }

  // ---------- Ações dos botões coloridos ----------
  var toastTimer;
  function toast(msg) {
    var el = document.getElementById("toast");
    el.textContent = msg;
    el.className = "toast show";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.className = "toast"; }, 2500);
  }

  function toggleFullscreen() {
    var d = document, e = d.documentElement;
    var fs = d.fullscreenElement || d.webkitFullscreenElement || d.mozFullScreenElement;
    if (fs) {
      (d.exitFullscreen || d.webkitExitFullscreen || d.mozCancelFullScreen).call(d);
    } else {
      var req = e.requestFullscreen || e.webkitRequestFullscreen || e.mozRequestFullScreen;
      if (req) req.call(e); else toast("Tela cheia não suportada neste navegador");
    }
  }

  function toggleTheme() {
    var light = document.body.className.indexOf("light") === -1;
    document.body.className = light ? "light" : "";
    try { localStorage.setItem("hud.theme", light ? "light" : "dark"); } catch (e) {}
  }

  try { if (localStorage.getItem("hud.theme") === "light") document.body.className = "light"; } catch (e) {}

  document.addEventListener("keydown", function (ev) {
    var k = ev.keyCode;
    var handled = true;
    if (is(k, "LEFT")) move(-1, 0);
    else if (is(k, "RIGHT")) move(1, 0);
    else if (is(k, "UP")) move(0, -1);
    else if (is(k, "DOWN")) move(0, 1);
    else if (is(k, "OK")) open(current);
    else if (is(k, "RED")) window.location.reload();
    else if (is(k, "GREEN")) toggleFullscreen();
    else if (is(k, "YELLOW")) toggleTheme();
    else if (is(k, "BLUE")) toast("Smart HUD · " + window.innerWidth + "×" + window.innerHeight);
    else handled = false;
    if (handled && ev.preventDefault) ev.preventDefault();
  }, false);

  // Mouse/ponteiro (controle com ponteiro ou testes no PC)
  for (var i = 0; i < tiles.length; i++) {
    (function (t) {
      t.addEventListener("mouseover", function () { focus(t); });
      t.addEventListener("click", function () { focus(t); open(t); });
    })(tiles[i]);
  }

  var saved = 0;
  try { saved = parseInt(localStorage.getItem("hud.focus"), 10) || 0; } catch (e) {}
  focus(tiles[saved] || tiles[0]);
})();
