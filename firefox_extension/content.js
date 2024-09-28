// Escuchar mensajes enviados desde el background.js
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "searchText") {
      // Rellenar el campo de búsqueda con el texto enviado
      document.getElementById("question").value = message.text;
  
      // Simular el envío del formulario automáticamente
      document.getElementById("searchForm").submit();
    }
  });
  