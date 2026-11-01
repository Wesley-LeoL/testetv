# Smart HUD — app para TV Panasonic

Tela inicial (HUD) para a seção Smart da TV, feita em HTML5 puro (sem build),
pensada para rodar **no navegador da própria TV** e ser navegada pelo controle remoto.

TV alvo: Panasonic em `192.168.0.110` (funciona também em Android TV / Fire TV).

## O que tem
- Relógio, data e saudação (bom dia / boa tarde / boa noite)
- Clima atual (Open-Meteo, sem chave de API)
- Linhas de atalhos **Apps** e **Favoritos**, configuráveis em `js/config.js`
- Navegação espacial com as setas do controle, **OK** abre o atalho
- Botões coloridos: 🔴 recarregar · 🟢 tela cheia · 🟡 tema claro/escuro · 🔵 sobre
- Layout fixo 1920×1080 escalado automaticamente (TVs 720p, 1080p e 4K)
- JavaScript ES5, compatível com navegadores antigos de TV

## Como colocar na TV

A TV só precisa abrir uma URL. Duas formas:

### 1. Servir a partir de um PC na mesma rede (mais rápido)
```bash
cd testetv
python3 -m http.server 8080
```
Descubra o IP do PC (ex.: `192.168.0.50`) e, no navegador da TV, abra
`http://192.168.0.50:8080`. O PC precisa ficar ligado.

### 2. Hospedar online (GitHub Pages, Netlify etc.)
Publique a pasta e abra a URL no navegador da TV. Não depende do PC.

### Fixar na tela inicial da Panasonic (My Home Screen)
1. Abra o **Navegador da Web** da TV e carregue a URL do HUD.
2. Use o menu do navegador → **Adicionar à Tela Inicial** (ou *Fixar na Página
   Inicial*, conforme o modelo). O HUD vira um ícone na seção Smart.
3. Aperte 🟢 para tela cheia.

Em Android TV / Fire TV use um navegador (ex.: TV Bro) ou peça um wrapper APK.

## Personalizar
Edite `js/config.js`: seu nome, cidade/coordenadas do clima e a lista de atalhos
(`title`, `url`, `color`, `icon`).

> Observação: o HUD abre os atalhos no navegador da TV. Apps nativos (Netflix,
> Prime Video) não podem ser iniciados por uma página web; para eles use as versões
> web compatíveis com TV (ex.: `youtube.com/tv`).
