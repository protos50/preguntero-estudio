// content.js

// Función para obtener el texto seleccionado
function getSelectedText() {
    return window.getSelection().toString();
}

// Escucha los mensajes del background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "showPopup") {
        // Crear el contenedor del popup
        let popup = document.createElement("div");
        popup.id = "customPopup";
        popup.innerHTML = `<p>${message.result}</p>`;

        // Aplicar estilos básicos al popup
        popup.style.position = "fixed";
        popup.style.bottom = "20px";
        popup.style.right = "20px";
        popup.style.width = "300px";
        popup.style.padding = "15px";
        popup.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        popup.style.color = "white";
        popup.style.borderRadius = "8px";
        popup.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
        popup.style.zIndex = "1000";
        popup.style.fontFamily = "Arial, sans-serif";
        popup.style.fontSize = "14px";
        popup.style.lineHeight = "1.5";

        // Añadir un botón para cerrar el popup
        let closeButton = document.createElement("span");
        closeButton.innerHTML = "&times;";
        closeButton.style.position = "absolute";
        closeButton.style.top = "10px";
        closeButton.style.right = "10px";
        closeButton.style.cursor = "pointer";
        closeButton.style.color = "white";
        closeButton.style.fontSize = "18px";
        closeButton.onclick = function () {
            document.body.removeChild(popup);
        };

        let closeButton2 = document.createElement("button");
        closeButton2.textContent = "Cerrar";
        closeButton2.style.display = "block";
        closeButton2.style.marginTop = "10px";
        closeButton2.style.padding = "5px 10px";
        closeButton2.style.backgroundColor = "#007bff";
        closeButton2.style.color = "#fff";
        closeButton2.style.border = "none";
        closeButton2.style.cursor = "pointer";

        // Evento para cerrar el popup
        closeButton2.addEventListener("click", () => {
            popup.remove();
        });

        popup.appendChild(closeButton2);
        popup.appendChild(closeButton);

        // Agregar el popup al cuerpo del documento
        document.body.appendChild(popup);

        // Quitar el popup después de 10 segundos (opcional)
        setTimeout(() => {
            if (popup) {
                popup.remove();
            }
        }, 15000); // 10 segundos
    } else if (message.action === "getSelectedText") {
        const selectedText = getSelectedText();
        sendResponse({ text: selectedText });
    }
});
