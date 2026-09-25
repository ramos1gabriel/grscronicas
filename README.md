# GRS Crônicas

Site estático em português: Home, Vídeos, Downloads, Sobre e Contato.

## Onde editar

| Conteúdo | Arquivo |
|---|---|
| Textos e estrutura da Home | `dist/index.html` |
| Textos e estrutura de Vídeos | `dist/videos/index.html` |
| Textos e estrutura de Downloads | `dist/downloads/index.html` |
| História e meta do projeto | `dist/sobre/index.html` |
| Contatos | `dist/contato/index.html` |
| Cores, fontes e espaçamentos | `dist/style.css` |
| Cadastro de vídeos e traduções | `dist/content.json` |
| Arquivos ZIP | `dist/downloads/` |

**Os HTMLs são definitivos e podem ser editados diretamente. Nenhum comando de publicação os reescreve.** Cabeçalho e rodapé estão em cada HTML; para mudar um link em todo o site, atualize as cinco páginas.

O JavaScript preenche somente os blocos marcados com `data-featured-video`, `data-latest-videos`, `data-video-grid`, `data-video-count` e `data-download-list`. Preserve esses marcadores e os scripts ao editar o HTML. A mensagem de Downloads vazio pode ser editada no `<template id="downloads-empty">`.

Apenas as listas `videos` e `downloads` do JSON alimentam o site automaticamente. Os outros campos históricos (redes sociais, data, avatar e banner) não atualizam os HTMLs: edite esses dados nas páginas onde aparecem.

## Adicionar conteúdo

- [Como adicionar um vídeo](ADICIONAR-VIDEO.md): cadastre uma vez; numeração, miniaturas e destaque são automáticos.
- [Como adicionar uma tradução ZIP](ADICIONAR-TRADUCAO.md): envie o arquivo e cadastre título, descrição e caminho.

## Visualização e verificação

Execute `node preview.mjs` e abra http://127.0.0.1:4173. Use o servidor local, pois os catálogos precisam ser carregados por HTTP.

Execute `node complete-pages.mjs` para validar e `node --test` para rodar os testes. O nome antigo foi mantido para funcionar com a configuração existente da Cloudflare; ele apenas chama `validate-site.mjs`, que lê os arquivos e verifica os catálogos. Não gera páginas.

## Publicação

A integração Cloudflare Workers Builds publica a branch `master` do repositório https://github.com/ramos1gabriel/grscronicas. A pasta pública continua sendo `dist`, e o comando existente `node complete-pages.mjs` continua funcionando. Não é preciso alterar a configuração da Cloudflare para esta mudança.

Salve suas alterações no GitHub e aguarde a publicação. Site: https://grscronicas.com.
