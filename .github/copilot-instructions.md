# Instruções para agentes (Copilot) — Hapuque-doces

Objetivo rápido: ajudar agentes a serem produtivos neste site estático (HTML/CSS/JS). Concentre-se em editar arquivos estáticos sob o diretório raiz; não há build system nem dependências Node/Python declaradas.

- **Arquitetura (big picture):** site estático multi-página. Páginas HTML em `/` e em `/html/*.html`. Estilos em `css/style.css`. Comportamento em `javascript/*.js`. Imagens em `assets/img/`.

- **Padrões e convenções detectáveis:**
  - CSS usa variáveis em `:root` (ex.: `--CorPrincipal`, `--CorTercearia`) — use essas variáveis ao ajustar cores.
  - Navegação/estado controlado por classes: `header.scrolled`, `menu-hamburger.active`, `menu-overlay.active`, `.visible` (IntersectionObserver), `body.menu-open`.
  - Scripts registram eventos no DOM (`DOMContentLoaded`) e esperam IDs/CLASSES específicos: `#menuToggle`, `#menuOverlay`, `#btnGerarPDF`, `.card-3d`, `#campoBusca`.
  - Busca no `javascript/busca.js` pesquisa por elementos com a classe `.doce-item` — porém nos templates os produtos usam `class="doce"`. Verifique este seletor ao alterar o sistema de busca (pode indicar discrepância).

- **Arquivos-chave para mudanças comuns:**
  - `index.html` — referência principal (inclui `css/style.css` e scripts). Ex.: `jsPDF` é incluído via CDN no final de `index.html`.
  - `html/cardapio.html` — listagem do cardápio; sincronize alterações aqui com `javascript/pdf-generator.js` se mudar itens.
  - `css/style.css` — design e responsividade; contém regras para desktop/mobile e variáveis de tema.
  - `javascript/menu.js` — toggle do menu, header scrolled e animações (IntersectionObserver).
  - `javascript/pdf-generator.js` — objeto `cardapioCompleto` contém os dados usados para gerar o PDF; editar esse arquivo altera o PDF gerado.
  - `javascript/busca.js` — lógica de filtragem do cardápio (seletor de itens: `.doce-item`).

- **Integrações externas:**
  - jsPDF via CDN em `index.html` (versão usada no arquivo: `2.5.1`). Evitar mudanças que removam essa importação sem prover alternativa.
  - Google Maps iframe no rodapé; redes sociais são links externos.

- **Fluxos de dados e comunicação:**
  - Alterar o cardápio visual exige editar o HTML das páginas (`html/cardapio.html` ou `index.html` se houver listagem) e, quando aplicável, atualizar `javascript/pdf-generator.js` para manter o PDF sincronizado.
  - Interações UI são DOM-driven (classes + event listeners). Para adicionar uma nova animação, siga o padrão: CSS define a classe e JS adiciona/removes essa classe (ver `menu.js` e `.visible`).

- **Como executar/testar localmente (rápido):**
  - Não há build; abra arquivos diretamente ou sirva com um servidor estático. Exemplos (PowerShell):
    - `python -m http.server 8000` (na raiz do projeto) — abra `http://localhost:8000`.
    - Use a extensão Live Server do VS Code se preferir recarregamento automático.

- **Dicas de edição segura:**
  - Preserve os nomes de IDs e classes usados por JS (ex.: `#btnGerarPDF`, `#campoBusca`, `#menuToggle`, `#menuOverlay`). Mudar esses nomes exige atualizar os seletores JS correspondentes.
  - Ao alterar cores, prefira atualizar variáveis CSS em `:root` ao invés de substituir valores literais.
  - Ao modificar o PDF, atualize `cardapioCompleto` em `javascript/pdf-generator.js` — o gerador usa `jsPDF` diretamente (não há testes automatizados).
  - Verifique a consistência entre `class="doce"` e o seletor `.doce-item` em `busca.js` antes de ajustar a busca.

- **Erros/checagens rápidas ao depurar:**
  - Console do navegador: seletores nulos (e.g., `document.getElementById('btnGerarPDF')`) indicam que o ID foi alterado ou o script foi carregado antes do DOM.
  - Se o PDF não gera, confira a importação do `jspdf` em `index.html` e mensagens de erro no console.
  - Performance: parallax/background-attachment é usado; em mobile o CSS já desativa o parallax (`background-attachment: scroll`).

- **Exemplos concretos (quando editar):**
  - Adicionar item novo ao cardápio: editar `html/cardapio.html` (novo bloco `.doce`), e opcionalmente adicionar entrada correspondente em `javascript/pdf-generator.js` dentro da categoria apropriada.
  - Corrigir busca que não encontra itens: trocar o seletor em `javascript/busca.js` de `.doce-item` para `.doce`, ou adicionar ambos nas entradas HTML.

- **Quando abrir PRs:**
  - Descreva claramente mudanças em seletores/IDs (ex.: "Altera `#campoBusca` para `#searchField` — atualizados os seletores em `busca.js` e `cardapio.html`").

Se algo estiver faltando nesta documentação (por exemplo: um script de deploy, CI, ou convenção de commits), me indique o que quer que eu investigue e eu atualizo o arquivo.
