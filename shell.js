const { ipcRenderer } = require("electron");

document.onreadystatechange = async (e) => {
   if (document.readyState != "complete") return;
}

document.addEventListener("keyup", (e) => {
    ipcRenderer.send("key", stringifyEvent(e));
});