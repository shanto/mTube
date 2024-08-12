const { BaseWindow, WebContentsView } = require("electron/main");
const { YtURL } = require("./utils");
const path = require("node:path");

class GridWindow extends BaseWindow {
	views = [];
	lastActiveCell = 0;
	constructor(options) {
		super(options);
		this.on("resize", this.resizeViews);
	}
	initializeSources(sources) {
		sources.forEach((s, i) => {
			const view = new WebContentsView({
				webPreferences: {
					webViewTag: false,
					preload: path.join(__dirname, "preload.js"),
				},
			});
			this.contentView.addChildView(view);
			view.webContents.viewIndex = i;
			view.webContents.loadURL(s);
			view.webContents.setWindowOpenHandler(this.windowOpenHandler);
			view.window = this;
			this.views[i] = view;
		});
		this.resizeViews();
		this.setupAudio();
	}
	windowOpenHandler(details) {
		const ytURL = new YtURL(details.url);
		if (ytURL.id) this.loadURL(ytURL.embed());
		return { action: "deny" };
	}
	resizeViews() {
		var size = this.views.length;
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
		var b = this.getContentBounds();
		var d = Math.ceil(Math.sqrt(size));
		var w = Math.round(b.width / d),
			h = Math.round(b.height / d);
		var x = Math.round(w * (n % d)),
			y = Math.round(h * Math.floor(n / d));
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
		console;
	}
}

module.exports = { GridWindow };
