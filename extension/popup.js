const URL_APP = "https://estimo-joy-create.lovable.app/";
const ORIGEM_APP = new URL(URL_APP).origin;
const CHAVE_IMPRESSAO = "coktelitas.impressao";

document.getElementById("aba").onclick = () => { chrome.tabs.create({ url: URL_APP }); window.close(); };
document.getElementById("janela").onclick = () => {
  chrome.windows.create({ url: URL_APP, type: "popup", width: 1366, height: 860 });
  window.close();
};

// "Gerar PDF" dentro desta janelinha: o Chrome não abre a caixa de impressão
// aqui, então o site envia o orçamento para cá e abrimos uma aba de impressão
// da própria extensão (imprimir.html), que entrega o orçamento ao site.
window.addEventListener("message", async (e) => {
  const quadro = document.getElementById("app");
  if (e.origin !== ORIGEM_APP || e.source !== quadro.contentWindow) return;
  if (!e.data || e.data.tipo !== "coktelitas-ext-imprimir") return;
  const responder = (msg) => e.source.postMessage(msg, ORIGEM_APP);
  try {
    if (!e.data.payload) throw new Error("Orçamento vazio.");
    await chrome.storage.local.set({ [CHAVE_IMPRESSAO]: e.data.payload });
    responder({ tipo: "coktelitas-ext-aceito" });
    await chrome.tabs.create({ url: chrome.runtime.getURL("imprimir.html") });
  } catch (err) {
    console.error("[Coktelitas] Falha ao preparar a impressão:", err);
    responder({ tipo: "coktelitas-ext-erro", mensagem: String((err && err.message) || err) });
  }
});
