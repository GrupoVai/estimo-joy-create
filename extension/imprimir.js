// Aba de impressão da extensão: carrega a página /imprimir do site num quadro e
// entrega o orçamento que a janelinha guardou. O próprio site abre a caixa de
// impressão (ali o Chrome permite), imprimindo só o documento.
const URL_APP = "https://estimo-joy-create.lovable.app/";
const ORIGEM_APP = new URL(URL_APP).origin;
const CHAVE_IMPRESSAO = "coktelitas.impressao";

const status = document.getElementById("status");
const quadro = document.getElementById("doc");
const erro = (texto) => {
  status.hidden = false;
  status.textContent = texto;
  quadro.style.display = "none";
};

chrome.storage.local.get(CHAVE_IMPRESSAO).then((r) => {
  const payload = r[CHAVE_IMPRESSAO];
  if (!payload) {
    erro("Nenhum orçamento recebido. Volte à extensão e clique em Gerar PDF.");
    return;
  }
  let recebido = false;
  window.addEventListener("message", (e) => {
    if (e.origin !== ORIGEM_APP || e.source !== quadro.contentWindow) return;
    if (e.data && e.data.tipo === "coktelitas-ext-pronto") {
      quadro.contentWindow.postMessage({ tipo: "coktelitas-ext-payload", payload }, ORIGEM_APP);
    } else if (e.data && e.data.tipo === "coktelitas-ext-recebido") {
      recebido = true;
      status.hidden = true;
    }
  });
  setTimeout(() => {
    if (!recebido)
      erro("Não foi possível carregar o orçamento. Verifique a internet e clique em Gerar PDF novamente.");
  }, 20000);
  quadro.src = URL_APP + "imprimir";
}, (err) => erro("Erro ao ler o orçamento: " + err.message));
