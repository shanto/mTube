// https://www.npmjs.com/package/electron-preferences#field-types

const electron = require("electron");
const app = electron.app;
const path = require("path");
const ElectronPreferences = require("electron-preferences");

const preferences = new ElectronPreferences({
	dataStore: path.resolve(app.getPath("userData"), "preferences.json"),

	defaults: {
		source: {
			keywords: [
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
			],
		},
		filter: {
			blacklist_channels: [
				"APB ANANDA",
				"Hindustan Times",
				"Jamuna TV Plus",
				"NDTV India",
				"Jomuna Vision",
				"TV9 Bangla",
				"Zee 24 Ghanta",
				"Zee News",
				"WION",
			],
		},
		behaviour: {
			video_cells: 9,
			audio_mode: "hover",
			patrol_interval: 5,
		},
	},

	sections: [
		{
			id: "source",
			label: "Video Sources",
			icon: "cloud-26",
			form: {
				groups: [
					{
						label: "Search Keywords",
						fields: [
							{
								// label: "Keywords",
								key: "keywords",
								type: "list",
								size: 25,
								style: {
									width: "75%",
								},
								help: "List of keywords to search for to fill up the cells",
								orderable: true,
							},
						],
					},
				],
			},
		},
		{
			id: "filter",
			label: "Filtering",
			icon: "cloud-26",
			form: {
				groups: [
					{
						label: "Blacklisted Channels",
						fields: [
							{
								// label: "",
								key: "blacklist_channels",
								type: "list",
								size: 25,
								style: {
									width: "75%",
								},
								help: "List of channel names to exclude from results. E.g. spammers.",
								orderable: true,
							},
						],
					},
				],
			},
		},
		{
			id: "behaviour",
			label: "App Behaviour",
			icon: "settings-gear-63",
			form: {
				groups: [
					{
						// label: "Other Settings",
						fields: [
							{
								label: "Video Cells",
								key: "video_cells",
								type: "radio",
								style: {
									width: "25%",
								},
								options: [
									{ label: "4 = 2x2", value: 4 },
									{ label: "9 = 3x2", value: 9 },
									{ label: "16 = 4x4", value: 16 },
								],
								help: "Make sure to adjust your source settings to allow engough results to fill up the cells.",
							},
							{
								label: "Audio Mode",
								key: "audio_mode",
								type: "radio",
								options: [
									{ label: "Hover", value: "hover" },
									{ label: "Patrol", value: "patrol" },
									{ label: "Multiplex All", value: "multiplex" },
								],
								help: "Hover activates the cell under pointer. Patrol keeps rotating through the cells for specified interval. Multiplex plays all cells at the same time.",
							},
							{
								label: "Patrol Interval (seconds)",
								key: "patrol_interval",
								type: "number",
								style: {
									width: "25%",
								},
								min: 1,
								max: 10,
								hideFunction: (preferences) => {
									// hide when sectionsEnabler.group2 preference is false
									return preferences.behaviour.audio_mode != "patrol";
								},
							},
						],
					},
				],
			},
		},
	],

	browserWindowOverrides: {
		enablePreferredSizeMode: false,
		width: 900,
		// maxWidth: 1000,
		height: 700,
		// maxHeight: 1000,
		resizable: false,
		maximizable: false,
		//...
	},

	menu: {},

	css: undefined,
});

module.exports = { preferences };
