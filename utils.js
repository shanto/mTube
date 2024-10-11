const { _ } = require("underscore");
const crel = require("crel");

class YtURL {
	hosts = ["www.youtube.com", "youtube.com", "www.youtu.be", "youtu.be"];
	constructor(url) {
		const pu = new URL(url);
		var match;
		if (this.hosts.indexOf(pu.host) >= 0) {
			this.origin = pu.origin.replace("http:", "https:");
		}
		if (pu.pathname == "/watch") {
			this.id = pu.searchParams.get("v");
		}
		if (match = pu.pathname.match(/^\/embed\/([^\/]+)/)) {
			this.id = match[1];
		}
		if (!this.id || !this.origin) {
			console.log("Unable to parse URL: " + url);
		}
	}
	embed(url, params) {
		params = params || "?autoplay=1";
		return this.origin + "/embed/" + this.id;
	}
}

YtURL.embed = function (url, params) {
	var self = new YtURL(url);
	return self.embed();
}

function stringifyEvent(e) {
	const obj = {};
	for (let k in e) {
		obj[k] = e[k];
	}
	return JSON.stringify(
		obj,
		(k, v) => {
			if (v instanceof Node) return "Node";
			if (v instanceof Window) return "Window";
			return v;
		},
		" "
	);
}

module.exports = { YtURL, stringifyEvent };
