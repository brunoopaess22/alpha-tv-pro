# Alpha TV Pro — site de download

Site estático (um arquivo só) que distribui o APK do Alpha TV Pro.

- **Site:** hospedado na Vercel
- **APK:** hospedado no GitHub Releases deste mesmo repositório

O botão de download aponta para um link **permanente** que sempre entrega o release mais
recente. Isso significa que **você nunca precisa mexer no site para lançar uma versão nova.**

---

## ⚠️ Este repositório NÃO pode conter o código-fonte do app

O `app/build.gradle` do projeto Android tem a **senha do keystore em texto puro**.
Se ele for para um repositório público, a senha de assinatura vaza.

Aqui vive **só o site**. O código do app fica no seu PC.

---

## Como lançar uma versão nova (o processo inteiro)

1. Gere o APK de release assinado no Android Studio
2. **Renomeie o arquivo para exatamente `AlphaTVPro.apk`**
3. No GitHub: **Releases → Draft a new release**
4. Em *Choose a tag*, digite `v3.9.0` (a versão) e escolha **Create new tag**
5. Título: `Alpha TV Pro 3.9.0`. Na descrição, o que mudou
6. Arraste o `AlphaTVPro.apk` para a área de anexos
7. **Publish release**

Pronto. O site já está entregando a versão nova, e o número/tamanho/data no topo da
página se atualizam sozinhos.

### O nome do arquivo é obrigatório

O link fixo é:

```
https://github.com/brunoopaess22/alpha-tv-pro/releases/latest/download/AlphaTVPro.apk
```

Esse `/latest/download/NOME` só funciona se o anexo tiver **esse nome exato, em todo
release**. Se você subir como `AlphaTVPro-3.9.0.apk`, o link quebra.

(O site tem uma rede de proteção: se detectar que o anexo tem outro nome, ele corrige o
botão sozinho via API. Mas quem digitar o link direto no Downloader da TV Box vai tomar
404 — então mantenha o nome fixo.)

### A chave de assinatura nunca pode mudar

O Android só instala uma atualização por cima se o APK novo estiver assinado com a
**mesma chave** da versão instalada. Se o keystore for perdido, todo cliente vai precisar
desinstalar e instalar de novo, perdendo login, favoritos e progresso.

**Faça backup do `.jks` em dois lugares separados.**

---

## Configuração inicial (uma vez só)

### 1. Criar o repositório

No GitHub: **New repository** → nome `alpha-tv-pro` → **Public**
(precisa ser público para o link de download funcionar sem login).

### 2. Subir o site

```bash
cd "C:\Users\Bruno Paes\Desktop\alpha-tv-site"
git init
git add .
git commit -m "Site de download do Alpha TV Pro"
git branch -M main
git remote add origin https://github.com/brunoopaess22/alpha-tv-pro.git
git push -u origin main
```

### 3. Publicar na Vercel

1. Entre em [vercel.com](https://vercel.com) com a conta do GitHub
2. **Add New → Project** → escolha `alpha-tv-pro`
3. Framework Preset: **Other**. Não mexa em mais nada.
4. **Deploy**

Sai no ar em `alpha-tv-pro.vercel.app`. A partir daí, todo `git push` reimplanta sozinho.

### 4. Domínio próprio (opcional)

Vercel → Project → **Settings → Domains** → adicione o domínio e siga as instruções de DNS.

---

## Se mudar o nome do repositório

Ajuste as duas constantes no topo do `<script>` em `index.html`:

```js
var GH_USUARIO = "brunoopaess22";
var GH_REPO    = "alpha-tv-pro";
```
