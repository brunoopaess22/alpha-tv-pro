// Intermediário entre o site e a API do GitHub.
//
// POR QUE ISSO EXISTE
// A primeira versão do site consultava api.github.com direto do navegador de cada
// visitante. A API pública do GitHub permite 60 chamadas por hora POR IP — e no Brasil
// muita operadora usa CGNAT, onde dezenas de clientes saem pelo mesmo IP público.
// Resultado: bastava movimento normal pra estourar a cota e os visitantes verem o aviso
// de "não consegui carregar a versão". Aconteceu de verdade em 2026-08-03.
//
// Agora quem fala com o GitHub é o servidor, uma vez, e a resposta fica guardada no CDN
// da Vercel. Mil visitantes = as mesmas ~4 chamadas por hora ao GitHub.

const REPO = "brunoopaess22/alpha-tv-pro";

export default async function handler(req, res) {
  // s-maxage=900   : o CDN guarda por 15 min e responde todo mundo de lá.
  // stale-while-revalidate=86400 : se o GitHub cair, continua servindo o último valor
  //   bom por até 24h enquanto tenta atualizar por baixo. O site não quebra junto.
  res.setHeader("Cache-Control", "public, s-maxage=900, stale-while-revalidate=86400");

  try {
    const r = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
      headers: {
        // O GitHub recusa requisição sem User-Agent.
        "User-Agent": "alpha-tv-pro-site",
        "Accept": "application/vnd.github+json",
      },
    });

    if (!r.ok) {
      // 404 = ainda não tem release publicado. 403 = cota estourada (agora raríssimo).
      return res.status(502).json({ erro: `github ${r.status}` });
    }

    const d = await r.json();
    const apk = (d.assets || []).find((a) => /\.apk$/i.test(a.name));

    return res.status(200).json({
      versao: String(d.tag_name || "").replace(/^v/i, "") || null,
      publicado: d.published_at || null,
      tamanho: apk ? apk.size : null,
      // Devolvido pro caso do anexo ter sido publicado com outro nome — aí o site
      // conserta o botão sozinho em vez de apontar pra uma URL que daria 404.
      url: apk ? apk.browser_download_url : null,
      nomeArquivo: apk ? apk.name : null,
    });
  } catch (e) {
    return res.status(502).json({ erro: "falha ao consultar o github" });
  }
}
