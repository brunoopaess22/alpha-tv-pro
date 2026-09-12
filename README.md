# Alpha TV Pro — site de download

Landing page estática hospedada na Vercel. O APK fica nos GitHub Releases.

## Estrutura

- `index.html`: conteúdo, instalação e perguntas frequentes.
- `styles.css`: layout responsivo, foco de teclado e movimento reduzido.
- `app.js`: abas acessíveis e atualização dos dados da versão.
- `assets/`: marca SVG e ilustração otimizada WebP (800 e 1600 px).
- `api/versao.js`: consulta do último release, com cache compartilhado.
- `vercel.json`: mantém `/apk` apontando para o download mais recente.

Sem framework, fontes externas ou dependências de frontend. A imagem dos aparelhos é ilustrativa, não uma captura do app. Os demais exemplos visuais são HTML/CSS.

## Publicação do site

O push na branch `main` dispara a implantação na Vercel. Framework: **Other**; sem comando de build. Confirmar após o deploy:

1. A página abre e carrega `styles.css`, `app.js` e as imagens.
2. `/api/versao` continua retornando versão, data, tamanho e URL do APK.
3. `/apk` continua redirecionando para o APK publicado.
4. Testar celular e desktop, abas, navegação por teclado e perguntas.

Este redesign não modifica o endpoint de atualização nem exige uma versão nova do Android.

## Publicação de APK

1. Gerar e testar o APK de release assinado com a mesma chave das versões anteriores.
2. Criar um release público com tag da versão, por exemplo `v4.4.13`.
3. Anexar o arquivo com nome exato **`AlphaTVPro.apk`**.
4. Publicar como release mais recente, não rascunho ou pré-release.
5. Conferir a API e o download; o cache pode atrasar a atualização dos metadados.

Os botões têm `/apk` como fallback e funcionam mesmo sem JavaScript ou com a API indisponível. Quando a consulta funciona, o site aceita somente URLs HTTPS de APKs do repositório oficial. Não alterar o nome fixo do anexo: clientes que usam o atalho `/apk` dependem dele.

## Segurança e escopo

Este repositório público contém **somente o site**. Nunca adicionar o código Android, credenciais de provedores, tokens, arquivos de assinatura ou senhas. Guardar backups seguros do keystore; a chave precisa ser preservada para permitir atualizações sobre o app instalado.

Ao mudar o repositório, atualizar `api/versao.js`, a validação de URL em `app.js`, `vercel.json` e o link de novidades no HTML. Ao mudar o domínio, atualizar os links visíveis de instalação e a imagem Open Graph.

Não anunciar recursos ainda não implementados. Catálogo, partidas, transmissões, EPG e catch-up dependem dos dados do provedor; estabilidade também depende da rede, do dispositivo e do player.
