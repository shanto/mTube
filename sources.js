const ytsr = require("ytsr");

const slots = 9;
const query = [
	"Jamuna TV",
	"Independent TV",
	"Barta24",
	"Ekhon TV",
	"DBC news",
	"Channel 24",
	"News24 BD",
	"Somoy TV",
	"Ekattor TV",
	"Al-Jazeera",
	"BBC News",
].join(" | ");
const blacklist = {
	ch_id: [],
	ch_name: [
		"APB ANANDA",
		"Hindustan Times",
		"Jamuna TV Plus",
		"NDTV India",
        "Jomuna Vision",
		"TV9 Bangla",
		"Zee 24 Ghanta",
		"Zee News",
        "WION"
	],
};

const getSources = async () => {
	const filters = await ytsr.getFilters(query);
	const filter_vid = filters.get("Type").get("Video");
	const filters_vid = await ytsr.getFilters(filter_vid.url);
	const filter_vid_live = filters_vid.get("Features").get("Live");
	const options = {};
	console.debug("Query: " + query);
	const ret = await ytsr(filter_vid_live.url, options);
	var sources = [],
		counter = 0;
	ret.items
		.filter((v) => {
			if (
				blacklist.ch_name
					.map((x) => x.toLowerCase())
					.indexOf(v.author.name.toLowerCase()) >= 0
			)
				return false;
			if (blacklist.ch_id.indexOf(v.author.channelID) >= 0) return false;
			return true;
		})
		.forEach((v, i) => {
			if (counter++ >= slots) return;
			v.embed = "https://www.youtube.com/embed/" + v.id;
			sources.push(v);
		});
	console.dir(sources.map(x => x.author.name + ": " + x.title));
	return sources.map(x => x.embed);
};

module.exports = { getSources };
