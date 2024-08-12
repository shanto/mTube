// Grid layout YT viewer

const { app, globalShortcut, ipcMain } = require("electron/main");
const { GridWindow } = require("./custom");
const { YtURL } = require("./utils");
const path = require("node:path");

app.name = "mTube 3^2";

app.whenReady().then(() => {
	const window = new GridWindow({
		width: 1620,
		height: 940,
		minWidth: 800,
		minHeight: 600,
		resizable: true,
		show: false,
		titleBarStyle: "hidden",
		titleBarOverlay: true,
		icon: path.join(__dirname, "youtube.png"),
	});
	app.mainWindow = window;
	window.setMenuBarVisibility(false);
	window.setBackgroundColor("black");
	window.setTitleBarOverlay({
		color: "#333",
		symbolColor: "white",
		height: 38,
	});

	const { getSources } = require("./sources");
	getSources().then((sources) => {
		window.initializeSources(sources);
		window.show();
		window.maximize();
	});

	globalShortcut.register("CommandOrControl+R", () => {
		console.log("CommandOrControl+R is pressed");
	});

	window;
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

ipcMain.on("mouse", (event, data) => {
	const window = app.mainWindow;
	if (data.type == "mouseenter") {
		window.lastActiveCell = event.sender.viewIndex;
		window.setupAudio();
	}
});

ipcMain.on("wheel", (event, data) => {
	var wc = event.sender;
	wc.focus();
	event.sender.sendInputEvent({
		type: "keyDown",
		keyCode: data.deltaY > 0 ? "Down" : "Up",
	});
});

ipcMain.on("key", (event, data) => {
	var window = app.mainWindow;
	switch (data.key) {
		case "Escape":
			window.restoreOrQuit();
			break;
		case "F5":
			window.reload();
			break;
	}
});

ipcMain.on("drop-youtube", (event, url) => {
	const ytURL = new YtURL(url);
	event.sender.loadURL(ytURL.embed());
});

ipcMain.on("drop", (event, data) => {
	const ytURL = new YtURL(data.url);
	event.sender.loadURL(ytURL.embed());
});
