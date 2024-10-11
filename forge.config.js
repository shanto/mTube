const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");
const path = require("node:path");
const less = require("less");

module.exports = {
	packagerConfig: {
		name: "mTube",
		asar: true,
		icon: path.join(__dirname, "icons", "icon"),
	},
	rebuildConfig: {},
	hooks: {
		generateAssets: async (config, platform, arch) => {
			less.fs.globSync("./*.less").forEach((lessfile) => {
				less.render(less.fs.readFileSync(lessfile).toString(), (err, out) => {
					less.fs.writeFileSync(lessfile.replace(/.less$/, ".css"), out.css);
				});
			});
		},
	},
	makers: [
		{
			name: "@electron-forge/maker-squirrel",
			config: {},
		},
		{
			name: "@electron-forge/maker-zip",
			platforms: ["darwin"],
		},
		{
			name: "@electron-forge/maker-deb",
			config: {},
		},
		{
			name: "@electron-forge/maker-rpm",
			config: {},
		},
	],
	plugins: [
		// {
		//   name: '@electron-forge/plugin-auto-unpack-natives',
		//   config: {},
		// },
		// Fuses are used to enable/disable various Electron functionality
		// at package time, before code signing the application
		new FusesPlugin({
			version: FuseVersion.V1,
			[FuseV1Options.RunAsNode]: false,
			[FuseV1Options.EnableCookieEncryption]: true,
			[FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
			[FuseV1Options.EnableNodeCliInspectArguments]: false,
			[FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
			[FuseV1Options.OnlyLoadAppFromAsar]: true,
		}),
	],
};
