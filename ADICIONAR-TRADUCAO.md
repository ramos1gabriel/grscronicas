# Como adicionar uma tradução ZIP

1. No GitHub, abra a pasta `dist/downloads` e escolha **Add file → Upload files**.
2. Envie o ZIP com um nome simples, sem espaços, como `meu-jogo-ptbr-v1.zip`, e salve o commit.
3. Abra `dist/content.json`, clique no lápis e adicione o registro na lista `downloads`:

```json
"downloads": [
  {
    "title": "Meu jogo — Tradução PT-BR",
    "description": "Versão 1.0. Compatível com a edição Steam. Extraia o ZIP na pasta do jogo. Consulte o LEIA-ME incluído para instruções completas.",
    "url": "/downloads/meu-jogo-ptbr-v1.zip"
  }
]
```

Adapte as instruções ao seu patch. Inclua um LEIA-ME no ZIP com instalação, compatibilidade e créditos. Se já houver traduções, separe os objetos com vírgula. O último não leva vírgula.

4. Salve em **Commit changes** na branch `master`. Depois da publicação pela Cloudflare, o cartão e o botão aparecem automaticamente na página Downloads.

Não é necessário editar HTML nem JavaScript para cadastrar traduções. O nome em `url` deve ser exatamente igual ao arquivo enviado, incluindo maiúsculas e minúsculas. O validador verifica se os ZIPs locais cadastrados existem antes de publicar. Também são aceitos links HTTPS diretos para ZIPs hospedados em outro lugar.

Para mudar o título da página ou a mensagem de que ainda não há arquivos, edite `dist/downloads/index.html`.
