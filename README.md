# Smart HUD — app para TV Panasonic TC-32DS600B

Tela inicial (HUD) para a seção Smart da TV, feita em HTML5 puro (sem build),
que roda **no navegador da própria TV**, hospedada no **GitHub Pages** — não precisa
de computador ligado.

- **TV:** Panasonic TC-32DS600B (linha 2015, sistema *My Home Screen* baseado em
  Firefox OS), IP `192.168.0.110`
- **Local:** Maringá - PR · horário de Brasília (UTC-3)

## O que tem
- Relógio e data em **horário de Brasília**, mesmo que o fuso da TV esteja errado;
  se o relógio da TV estiver adiantado/atrasado, a hora é corrigida pelo servidor
- Clima atual de **Maringá - PR** (Open-Meteo, sem chave de API, atualiza a cada 30 min)
- Linhas de atalhos **Apps** e **Favoritos**, configuráveis em `js/config.js`
- Navegação com as setas do controle, **OK** abre o atalho
- Botões coloridos: 🔴 recarregar · 🟢 tela cheia · 🟡 tema claro/escuro · 🔵 sobre
- Layout 1920×1080 escalado automaticamente (a TC-32DS600B é HD)
- JavaScript ES5, compatível com o navegador Gecko/Firefox OS da TV

## 1. Publicar no GitHub Pages (uma vez só)

1. No GitHub, abra o repositório → **Settings → Pages**.
2. Em **Build and deployment → Source**, escolha **Deploy from a branch**.
3. Selecione a branch `ccr-886de490-3d0cmh` (ou `main`, se fizer o merge) e a pasta
   **/ (root)** → **Save**.
4. Em 1–2 minutos o HUD fica disponível em:
   **https://wesley-leol.github.io/testetv/**

> ⚠️ Este repositório é **privado**. O GitHub Pages em repositório privado exige
> conta paga (GitHub Pro). Na conta gratuita, torne o repositório público em
> **Settings → General → Danger Zone → Change visibility**. Não há senhas nem
> dados pessoais no código.

Qualquer alteração enviada para a branch é publicada automaticamente; na TV, aperte
🔴 para recarregar.

## 1b. Endereço sem HTTPS (se a TV disser "conexão não segura")

O navegador da TC-32DS600B (2015) pode não aceitar os certificados HTTPS atuais.
Endereços `*.github.io` sempre forçam HTTPS, mas com um **domínio próprio** o GitHub
Pages pode servir em HTTP simples. Dá para fazer tudo pelo celular, de graça:

1. **Teste antes:** no navegador da TV abra `http://neverssl.com`. Se abrir, a TV
   navega normalmente em HTTP e este caminho vai funcionar.
2. **Crie um subdomínio grátis** em <https://freedns.afraid.org> (crie a conta →
   *Subdomains* → *Add*):
   - **Type:** `CNAME`
   - **Subdomain:** um nome, ex.: `smarthud-maringa`
   - **Domain:** escolha um domínio compartilhado da lista (ex.: `mooo.com`)
   - **Destination:** `wesley-leol.github.io`
   - Salve. Resultado: `smarthud-maringa.mooo.com`
3. **No GitHub:** *Settings → Pages → Custom domain* → digite
   `smarthud-maringa.mooo.com` → **Save**. Aguarde o "DNS check successful".
4. **Deixe "Enforce HTTPS" DESMARCADO.**
5. Na TV, abra **`http://smarthud-maringa.mooo.com`** (com `http://`).

O clima passa a ser buscado em HTTP automaticamente quando a página está em HTTP.
Se preferir um domínio `.com.br` próprio (≈ R$ 40/ano no registro.br), o processo
é o mesmo: crie um registro CNAME apontando para `wesley-leol.github.io`.

> Os atalhos (YouTube, Globoplay…) são sites HTTPS. Se o problema for o navegador
> antigo da TV, eles podem mostrar o mesmo aviso — o HUD em si funciona.

## 2. Colocar na TV (TC-32DS600B)

1. Aperte **HOME** no controle e abra o **Navegador da Web** (Web Browser).
2. Digite `wesley-leol.github.io/testetv` (ou o seu endereço `http://` do passo 1b) e confirme.
3. Com a página aberta, aperte **OPTION** no controle e escolha
   **Fixar na Página Inicial** (*Pin to Home*). O HUD vira um ícone na tela Smart
   (o nome exato da opção pode variar com a versão do firmware).
4. Para abrir, aperte **HOME** e selecione o ícone **Smart HUD**. Use 🟢 para
   tela cheia.

Dica: se a data/hora da TV estiver errada, ajuste também em **Menu → Temporizador →
Ajuste do relógio** (ou deixe em automático); o HUD já se corrige sozinho.

## Ajustar a tela (resolução/bordas cortadas)
Se o HUD aparecer pequeno, grande, cortado ou fora do lugar:
1. Selecione o bloco **⚙ Ajustar tela** (último em Favoritos) e aperte **OK** —
   ou aperte o botão **azul** ou a tecla **0** do controle.
2. **▲ / ▼** aumenta/diminui o tamanho. **OK** muda para o modo posição (setas movem).
3. **Amarelo** ou **5** volta ao padrão. **Azul**, **0** ou **Voltar** salva.
O ajuste fica gravado na TV. O painel mostra também a resolução que o navegador informa.

## Personalizar
Edite `js/config.js`:
- `userName` — seu nome na saudação
- `utcOffsetHours` — fuso (−3 = Brasília)
- `weather` — cidade e coordenadas (Maringá: −23.4205, −51.9333)
- `apps` / `favorites` — atalhos (`title`, `url`, `color`, `icon`)

> Observação: os atalhos abrem sites no navegador da TV. Apps nativos (Netflix,
> YouTube nativo) não podem ser iniciados por uma página web; por isso o YouTube
> aponta para a versão web para TV (`youtube.com/tv`).
