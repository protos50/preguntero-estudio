chrome.contextMenus.create({
  id: "sendToSearch",
  title: "Ask a question",
  contexts: ["selection"]
});

chrome.contextMenus.create({
  id: "sendToAlert",
  title: "Buscar y mostrar en alerta",
  contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "sendToSearch") {
    chrome.tabs.query({ url: "http://localhost:5000/*" }, (tabs) => {
      if (tabs && tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "searchText", text: info.selectionText });
      } else {
        chrome.tabs.create({ url: "http://localhost:5000?question=" + encodeURIComponent(info.selectionText) });
      }
    });
  } else if (info.menuItemId === "sendToAlert") {
    let question = encodeURIComponent(info.selectionText);
    let url = `http://localhost:5000/search?question=${question}&searchMode=800`;

    // Realiza una solicitud fetch para obtener la respuesta
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Envía el resultado al content script para mostrar el popup
        chrome.tabs.sendMessage(tab.id, { action: "showPopup", result: data.result });
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }
});
