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

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          chrome.tabs.sendMessage(tab.id, { action: "showPopup", result: data.result });
        } else {
          console.error("No se encontró el resultado en la respuesta.");
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "search_with_popup") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.executeScript(tabs[0].id, {
        code: "window.getSelection().toString();"
      }, (selection) => {
        if (selection && selection[0]) {
          let question = encodeURIComponent(selection[0]);
          let url = `http://localhost:5000/search?question=${question}`;

          fetch(url)
            .then(response => response.json())
            .then(data => {
              if (data.result) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "showPopup", result: data.result });
              } else {
                console.error("No se encontró el resultado en la respuesta.");
              }
            })
            .catch(error => {
              console.error("Error:", error);
            });
        } else {
          console.error("No hay texto seleccionado.");
        }
      });
    });
  }
});
