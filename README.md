# GRS Crônicas

Site em português com Home, Vídeos, Downloads, Sobre e Contato. HTML estático, CSS responsivo e JavaScript sem dependências.

## Conteúdo

Edite `dist/content.json` e execute `node complete-pages.mjs` para atualizar as cinco páginas. Redes e e-mail oficiais já estão cadastrados. O início do projeto é 6 de junho de 2026.

Vídeos: `{"id":"ID_DO_YOUTUBE","title":"Título do vídeo","thumbnail":"https://endereco-da-miniatura","duration":"5:00"}`. O ID precisa ser o identificador de 11 caracteres do YouTube. O catálogo inicial contém 15 vídeos consultados na página pública do canal em 13/09/2026. As atualizações são manuais; o site não depende de uma API do YouTube para abrir.

Downloads: `{"title":"Nome do jogo — PT-BR","description":"Versão, compatibilidade e instruções de instalação","url":"https://endereco-do-patch.zip"}`. Disponibilize os patches de tradução, com instruções e versão compatível.

## Visualização local

Execute `node preview.mjs` e abra http://127.0.0.1:4173.

## Publicação

A pasta pública é `dist`, sem etapa de compilação. Ela pode ser hospedada no Cloudflare Pages. O domínio pretendido é `grscronicas.com`; seu DNS ainda não foi alterado.

## Pendências de conteúdo

- Adicionar arquivos de tradução.
- Repositório: https://github.com/ramos1gabriel/grscronicas
- Conectar o domínio grscronicas.com.
