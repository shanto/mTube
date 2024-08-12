class YtURL {
	hosts = ['www.youtube.com', 'youtube.com', 'www.youtu.be', 'youtu.be']
	constructor(url) {
		const pu = new URL(url);
		if(this.hosts.indexOf(pu.host) >= 0) {
			this.origin = pu.origin.replace('http:', 'https:')
		}
		if(pu.pathname == '/watch') {
			this.id = pu.searchParams.get("v")
		}
		if(!this.id || !this.origin) {
			console.log("Unable to parse URL: " + url);
		}
	}
	embed(url) {
		if(!this) {
			var self = new YtURL(url)
			return self.embed()
		}
		return this.origin + "/embed/" + this.id;
	}
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

module.exports = { YtURL, stringifyEvent }