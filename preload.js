const { ipcRenderer } = require("electron");
const crel = require("crel");

document.onreadystatechange = async (e) => {
	if (document.readyState != "complete") return;
	var play = document.querySelector('button[aria-label="Play"]');
	if (play) {
		play.click();
		document.querySelector("div.ytp-embed").style.background = "#999";
	}
	var css = ipcRenderer.sendSync("read-css", "sub.css");
	document.head.appendChild(crel('style', { type: "text/css" }, css));
	document.head.appendChild(crel('link', {
		href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@24,300,0,0",
			// "https://kit.fontawesome.com/f2c6038123.js"
		rel: "stylesheet",
		onload: e => {
			document.querySelector('div.toolbar').classList.remove("hidden");
		}
	}));
	document.body.appendChild(crel("div", {class: "toolbar"}, [
		crel("span", { class: "button material-symbols-sharp" }, "video_search"),
		crel("span", { class: "button material-symbols-sharp" }, "fullscreen"),
		// crel("span", { class: "button material-symbols-sharp"}, "collapse_content"),
		crel(
			"span", {
			class: "button material-symbols-sharp",
			draggable: true,
			ondragstart: (e) => {
				var viewIndex = ipcRenderer.sendSync("view-index");
				e.dataTransfer.setData(
					"text/plain",
					JSON.stringify([{ idx: viewIndex, url: location.href }])
				);
				e.target.classList.add("dragging");
			},
			ondragend: (e) => {
				e.target.classList.remove("dragging");
			}
		}, "drag_pan"),
	]));

	var snap_i = 0, button, buttons = document.evaluate("//*[contains(@class, 'ytp-settings-button')]/following-sibling::*", document.body, null, 7);
	while (button = buttons.snapshotItem(snap_i++)) {
		button.remove();
	}
	document.querySelector(".ytp-chrome-top-buttons").remove();
};
document.addEventListener("mouseleave", (e) => {
	document.body.classList.toggle("active", false);
});
document.addEventListener("mouseenter", (e) => {
	document.body.classList.toggle("active", true);
	if (!e.ctrlKey) ipcRenderer.send("mouse", stringifyEvent(e));
});
document.addEventListener("keyup", (e) => {
	ipcRenderer.send("key", stringifyEvent(e));
});
document.addEventListener("dragover", (e) => {
	console.log(e.dataTransfer.getData("URL"));
	e.preventDefault();
});
document.addEventListener("drop", (e) => {
	var data = stringifyEvent(e);
	var viewIndex = ipcRenderer.sendSync("view-index");
	try {
		var urls = JSON.parse(e.dataTransfer.getData("text/plain"));
		urls.push({ idx: viewIndex, url: location.href });
		data.text = JSON.stringify(urls);
	} catch (e) {
		data.text = e.dataTransfer.getData("text");
	}
	data.url = e.dataTransfer.getData("url");
	data.file = e.dataTransfer.getData("file");
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
