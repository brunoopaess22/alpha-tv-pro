// Código curto → endereço do servidor IPTV.
//
// PARA QUE SERVE
// Na tela de login do app, em vez de digitar "http://primewhatch.com" com o controle da
// TV, o cliente digita só o código (ex.: 2030). O app pergunta aqui qual servidor é e
// segue o login normal com usuário e senha.
//
// O GANHO DE VERDADE
// O app guarda o CÓDIGO, não o endereço, e confere esta tabela a cada abertura. Se o
// servidor trocar de domínio, basta mudar a linha abaixo: todos os clientes que entraram
// com o código passam a usar o endereço novo sozinhos, sem reinstalar nem redigitar.
//
// ⚠️ ESTE REPOSITÓRIO É PÚBLICO. Aqui só entra o ENDEREÇO do servidor — nunca usuário ou
// senha. Endereço não é segredo (está dentro do app de qualquer concorrente); credencial
// é, e um código curto é fácil de adivinhar.
//
// COMO MUDAR: edite a tabela, faça commit e push. A Vercel publica em ~1 minuto, e o CDN
// guarda a resposta por até 5 minutos (s-maxage abaixo) — depois disso todo mundo já vê
// o endereço novo.

const CODIGOS = {
  "2030": "http://primewhatch.com",
};

export default function handler(req, res) {
  const codigo = String((req.query && req.query.codigo) || "").trim();

  // Só números, de 3 a 10 dígitos. Qualquer outra coisa nem consulta a tabela.
  if (!/^\d{3,10}$/.test(codigo)) {
    res.setHeader("Cache-Control", "no-store");
    return res.status(400).json({ erro: "codigo invalido" });
  }

  const servidor = CODIGOS[codigo];
  if (!servidor) {
    // Cache curto pro "não existe": um código recém-criado aparece rápido.
    res.setHeader("Cache-Control", "public, s-maxage=60");
    return res.status(404).json({ erro: "codigo nao encontrado" });
  }

  // 5 min no CDN; se a Vercel engasgar, serve o último valor bom por até 1 dia.
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=86400");
  return res.status(200).json({ codigo, servidor });
}
