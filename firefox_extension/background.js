// Crear el menú contextual para la selección de texto
browser.menus.create({
    id: "sendToSearch",
    title: "Enviar texto a mi buscador",
    contexts: ["selection"]
  });
  
  // Cuando se selecciona la opción en el menú contextual
  browser.menus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "sendToSearch") {
      // Buscar si la pestaña de tu aplicación ya está abierta
      browser.tabs.query({ url: "http://localhost:5000/*" }, (tabs) => {
        if (tabs.length > 0) {
          // Si está abierta, enviar un mensaje a la pestaña con el texto seleccionado
          browser.tabs.sendMessage(tabs[0].id, { action: "searchText", text: info.selectionText });
        } else {
          // Si no está abierta, abrir una nueva pestaña con el texto seleccionado
          browser.tabs.create({ url: "http://localhost:5000?question=" + encodeURIComponent(info.selectionText) });
        }
      });
    }
  });
  