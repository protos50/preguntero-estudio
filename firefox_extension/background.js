chrome.contextMenus.create({
  id: "sendToSearch",
  title: "Ask a question",
  contexts: ["selection"]
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "sendToSearch") {
      // Buscar si la pestaña de tu aplicación ya está abierta
      chrome.tabs.query({ url: "http://localhost:5000/*" }, (tabs) => {
          if (tabs.length > 0) {
              // Si está abierta, enviar un mensaje a la pestaña con el texto seleccionado
              chrome.tabs.sendMessage(tabs[0].id, { action: "searchText", text: info.selectionText });
          } else {
              // Si no está abierta, abrir una nueva pestaña con el texto seleccionado
              chrome.tabs.create({ url: "http://localhost:5000?question=" + encodeURIComponent(info.selectionText) });
          }
      });
  }
});



