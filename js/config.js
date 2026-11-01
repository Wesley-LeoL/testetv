/*
 * Configuração do Smart HUD. Edite à vontade.
 * Cada atalho: { title, url, color, icon }  (icon = texto/emoji curto)
 */
var HUD_CONFIG = {
  userName: "",               // ex.: "Wesley" -> "Boa noite, Wesley"
  weather: {
    enabled: true,
    city: "São Paulo",
    latitude: -23.55,
    longitude: -46.63
  },
  apps: [
    { title: "YouTube",    url: "https://www.youtube.com/tv",     color: "#e62117", icon: "▶" },
    { title: "Globoplay",  url: "https://globoplay.globo.com",    color: "#fb0234", icon: "G" },
    { title: "Spotify",    url: "https://open.spotify.com",       color: "#1db954", icon: "♫" },
    { title: "Pluto TV",   url: "https://pluto.tv/br",            color: "#2b2b2b", icon: "P" },
    { title: "Twitch",     url: "https://www.twitch.tv",          color: "#9146ff", icon: "T" },
    { title: "Google",     url: "https://www.google.com",         color: "#4285f4", icon: "G" }
  ],
  favorites: [
    { title: "Notícias",   url: "https://g1.globo.com",           color: "#c4170c", icon: "N" },
    { title: "Futebol",    url: "https://ge.globo.com",           color: "#06aa48", icon: "⚽" },
    { title: "Previsão",   url: "https://www.climatempo.com.br",  color: "#0077c8", icon: "☀" }
  ]
};
