// Grid layout YT viewer

const { app, ipcMain } = require("electron/main");
const { GridWindow } = require("./window");
const { YtURL } = require("./utils");
const path = require("node:path");
const { preferences } = require("./prefs");
const { getSources } = require("./sources");
const { isEqual } = require("lodash");
const { mainMenu } = require("./menu");
const fs = require("node:fs");

app.name = "mTube";

if (require("electron-squirrel-startup")) app.quit();

let mainWindow;

const initWindow = () => {
	if (!mainWindow) {
		mainWindow = createWindow();
	}

	getSources().then((sources) => {
		mainWindow.initializeSources(sources);
		mainWindow.maximize();
		mainWindow.show();
	});
};

app.whenReady().then(initWindow);

const createWindow = () => {
	const window = new GridWindow({
		width: 1620,
		height: 940,
		minWidth: 800,
		minHeight: 600,
		resizable: true,
		show: false,
		setBackgroundColor: "black",
		titleBarStyle: "hidden",
		titleBarOverlay: {
			color: "#222",
			symbolColor: "#999",
			height: 30,
		},
		icon: path.join(__dirname, "icons", "icon"),
	});
	window.setMenuBarVisibility(false);
	return window;
};

// GLOBAL (app) event handlers

ipcMain.on("menu-preferences", () => {
	const old_prefs = preferences.preferences;
	preferences.show();
	preferences.prefsWindow.once("close", () => {
		if (isEqual(old_prefs, preferences.preferences)) return;
		app.relaunch();
		app.exit();
	});
});

ipcMain.on("menu-reload", () => {
	mainWindow.reload();
});

ipcMain.on("menu-debug", (a, b, c) => {
	mainWindow.contentView.children.forEach((child) => {
		if (child.webContents.isFocused()) {
			child.webContents.openDevTools();
			return;
		}
	});
});

ipcMain.on("menu-restore-or-quit", () => {});

ipcMain.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

// IPC (from sub views) event handlers:

ipcMain.on("mouse", (event, data) => {
	if (data.type == "mouseenter") {
		mainWindow.lastActiveCell = event.sender.viewIndex;
		mainWindow.setupAudio();
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
	switch (data.key) {
		case "Escape":
		case "Q":
			mainWindow.restoreOrQuit();
			break;
		case "F5":
			mainWindow.reload();
			break;
	}
});

ipcMain.on("view-index", (event) => {
	event.returnValue = event.sender.viewIndex;
})

ipcMain.on("drop", (event, data) => {
	var urls;
	try {
		urls = JSON.parse(data.text);
		if(urls && urls.length == 2) {
			try {
				mainWindow.views[urls[0].idx].webContents.loadURL(YtURL.embed(urls[1].url))
				mainWindow.views[urls[1].idx].webContents.loadURL(YtURL.embed(urls[0].url))
			} catch(e) {
				console.dir(data);
				console.dir(event);
			}
			return;
		}
	} catch(e) {

	}
	
	try {
		event.sender.loadURL(ytURL.embed(data.url));
	} catch (e) {
		event.sender.loadURL(data.url);
	}
});

ipcMain.on("read-css", async (event, file) => {
	event.returnValue = fs.readFileSync(path.join(__dirname, file), "utf8").replaceAll(/[\r\n]+/g, " ");
});
