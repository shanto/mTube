const { ipcRenderer } = require("electron");

document.onreadystatechange = (e) => {
	if (document.readyState != "complete") return;
	document.querySelector('button[aria-label="Play"]').click();
	document.querySelector('div.ytp-embed').style.background = '#999';
};
document.addEventListener("mouseenter", (e) => {
	e.target.querySelector("video").attributes["draggable"] = true;
	if (!e.ctrlKey) ipcRenderer.send("mouse", stringifyEvent(e));
});
document.addEventListener("keydown", (e) => {
	ipcRenderer.send("key", stringifyEvent(e));
});
document.addEventListener("dragover", (e) => {
	e.preventDefault();
});
document.addEventListener("drop", (e) => {
	var data = stringifyEvent(e);
	data.url = e.dataTransfer.getData("url");
	data.file = e.dataTransfer.getData("file");
	data.text = e.dataTransfer.getData("text");
	ipcRenderer.send("drop", data);
	e.preventDefault();
});
document.addEventListener("wheel", (e) => {
	e.target.focus();
	ipcRenderer.send("wheel", stringifyEvent(e));
});
function stringifyEvent(e) {
	const obj = {};
	for (let k in e) {
		obj[k] = e[k];
	}
	return JSON.parse(
		JSON.stringify(
			obj,
			(k, v) => {
				if (v instanceof Node) return "Node";
				if (v instanceof Window) return "Window";
				return v;
			},
			" "
		)
	);
}
