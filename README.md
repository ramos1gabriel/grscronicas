# GRS Crônicas

Site em português com Home, Vídeos, Downloads, Sobre e Contato. HTML estático, CSS responsivo e JavaScript sem dependências.

## Conteúdo

Para adicionar vídeos, siga [ADICIONAR-VIDEO.md](ADICIONAR-VIDEO.md). Edite somente a lista `videos` em `dist/content.json`: o JavaScript atualiza cartões, números, total e destaque da Home automaticamente. Não edite os cartões nos arquivos HTML.

Vídeo mínimo: `{"url":"https://www.youtube.com/watch?v=ID_DO_VIDEO","title":"Título do vídeo"}`. Miniatura e numeração são automáticas. Jogo, pensador, tema e duração são opcionais. Adicione no início para destacar na Home. O cadastro é manual em um único lugar; não há importação automática do canal.

Downloads: `{"title":"Nome do jogo — PT-BR","description":"Versão, compatibilidade e instruções de instalação","url":"https://endereco-do-patch.zip"}`. Disponibilize os patches de tradução, com instruções e versão compatível.

## Visualização local

Execute `node preview.mjs` e abra http://127.0.0.1:4173.

## Publicação

A pasta pública é `dist`. A Cloudflare Pages publica a branch `master` com o comando `node complete-pages.mjs` e diretório de saída `dist`. O gerador mantém uma versão HTML para funcionar mesmo sem JavaScript; o navegador atualiza os vídeos a partir de `content.json`. Site: https://grscronicas.com.

## Pendências de conteúdo

- Adicionar arquivos de tradução.
- Repositório: https://github.com/ramos1gabriel/grscronicas
## Verificação

Execute `node --test tests/video-catalog.test.mjs` e `node complete-pages.mjs`.
