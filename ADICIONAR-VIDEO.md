# Como adicionar um vídeo

Edite somente [`dist/content.json`](dist/content.json). **Não edite os cartões nos arquivos `index.html`**: eles são gerados automaticamente e atualizados pelo JavaScript.

1. Abra `dist/content.json` no GitHub e clique no lápis.
2. Na lista `"videos"`, adicione um objeto no início, logo depois de `[`.
3. Preencha o link real do YouTube, título e, se quiser, jogo e pensador ou tema.
4. Salve em **Commit changes** na branch `master`. A Cloudflare publicará a atualização.

Modelo (substitua o link pelo vídeo real):

```json
{
  "url": "https://www.youtube.com/watch?v=ID_DO_VIDEO",
  "title": "Título do vídeo novo",
  "game": "Minecraft",
  "thinker": "Epicuro"
},
```

A vírgula final separa esse objeto do vídeo que já estava na lista. O último objeto da lista não leva vírgula depois da chave. Use aspas duplas; JSON não aceita comentários.

## O que muda automaticamente

- O primeiro vídeo da lista vira o destaque da Home.
- Os três seguintes aparecem em “Outras histórias”.
- A página Vídeos mostra a lista inteira e a contagem correta.
- A numeração segue a ordem da lista e é a mesma na Home e em Vídeos.
- A miniatura é obtida pelo ID do YouTube se `thumbnail` não for informado.

Você também pode usar `"id": "ID_DE_11_CARACTERES"` no lugar de `url`. São aceitos links `youtube.com/watch?v=…`, `youtu.be/…` e `youtube.com/shorts/…`.

## Campos opcionais

| Campo | Uso |
|---|---|
| `game` | Nome do jogo |
| `thinker` | Nome do pensador |
| `theme` | Tema, quando não há pensador |
| `duration` | Duração, por exemplo `7:31` |
| `thumbnail` | URL HTTPS de uma miniatura personalizada |
| `gameLabel` | Trocar “Jogo” por “Cenário”, por exemplo |
| `referenceLabel` | Trocar “Pensador” por “Autor”, “Poeta” ou “Referência” |

Somente título e link/ID são obrigatórios. Campos ausentes não aparecem vazios no cartão. O site não importa novos vídeos do canal sozinho: você cadastra cada vídeo uma única vez nessa lista. Não é necessário mexer em HTML nem renumerar os demais.

## Verificar localmente

Execute `node complete-pages.mjs` para validar o catálogo e `node preview.mjs` para abrir http://127.0.0.1:4173. Nenhum HTML é reescrito. Se o catálogo não carregar, o site mostra um aviso com link para o canal.
