const { BrowserWindow, WebContentsView } = require("electron/main");
const { YtURL } = require("./utils");
const path = require("node:path");
const { preferences } = require("./prefs")
const slots = preferences.value('behaviour.video_cells');
const _ = require("underscore")

class GridWindow extends BrowserWindow {
	views = [];
	lastActiveCell = 0;
	constructor(options) {
		options.webPreferences = _.extend(options.webPreferences || {}, {
			preload: path.join(__dirname, "shell.js"),
			sandbox: false
		})
		super(options);
		this.on("resize", this.resizeViews);
		this.webContents.loadFile("./shell.html");
	}
	initializeSources(sources) {
		Array(sources.length < slots ? slots - sources.length : 0).forEach(() => {
			sources.push("about:blank");
		})
		sources.forEach((s, i) => {
			const view = this.createChildView(i, s)
			this.views[i] = view;
		});
		this.resizeViews();
		this.setupAudio();
	}
	createChildView(index, source) {
		const view = new WebContentsView({
			webPreferences: {
				webViewTag: false,
				sandbox: false,
				preload: path.join(__dirname, "preload.js"),
			},
		});
		this.contentView.addChildView(view);
		view.webContents.viewIndex = index;
		view.webContents.setWindowOpenHandler(this.windowOpenHandler);
		view.window = this;
		view.webContents.loadURL(source);
		return view
	}
	windowOpenHandler(details) {
		const ytURL = new YtURL(details.url);
		if (ytURL.id) this.loadURL(ytURL.embed());
		return { action: "deny" };
	}
	resizeViews() {
		const size = this.views.length;
		const bounds = this.contentView.getBounds();
		const vOffset = this.isMaximized() ? 0 : 30;
		bounds.y += vOffset;
		bounds.height -= vOffset;
		this.contentView.setBounds(bounds);
		this.views.forEach((view, i) => {
			view.setBounds(this.getCellBounds(i, size));
		});
	}
	setupAudio() {
		this.views.forEach((view, i) => {
			try {
				view.webContents.audioMuted = i == this.lastActiveCell ? false : true;
			} catch (err) {
				console.dir(err);
			}
		});
	}
	getCellBounds(n, size) {
		var b = this.contentView.getBounds();
		var d = Math.ceil(Math.sqrt(size));
		var w = Math.round(b.width / d),
			h = Math.round(b.height / d);
		var x = Math.round(w * (n % d)),
			y = Math.round(h * Math.floor(n / d)) + (this.isMaximized() ? 0 : 30);
		var r = {
			x: x,
			y: y,
			width: w,
			height: h,
		};
		return r;
	}
	restoreOrQuit() {
		if (this.isMaximized()) {
			this.restore();
		} else {
			this.close();
		}
	}
	reload() {
		this.views.forEach((view) => {
			view.webContents.reload();
		});
	}
}

module.exports = { GridWindow };
