const ytsr = require("ytsr");
const { preferences } = require("./prefs");

const slots = preferences.value('behaviour.video_cells');
const query = preferences.value('source.keywords').join(" | ");
const blacklist = {
	ch_id: [],
	ch_name: preferences.value('filter.blacklist_channels'),
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
