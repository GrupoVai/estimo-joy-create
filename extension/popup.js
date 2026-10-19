const URL_APP = "https://estimo-joy-create.lovable.app/";
document.getElementById("aba").onclick = () => { chrome.tabs.create({ url: URL_APP }); window.close(); };
document.getElementById("janela").onclick = () => {
  chrome.windows.create({ url: URL_APP, type: "popup", width: 1366, height: 860 });
  window.close();
};
