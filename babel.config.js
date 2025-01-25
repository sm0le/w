module.exports = {
	presets: ["module:metro-react-native-babel-preset"],
	plugins: [
		"react-native-reanimated/plugin",
		"nativewind/babel",
		[
			"module:react-native-dotenv",
			{
				moduleName: "react-native-dotenv",
			},
		],
		[
			"module-resolver",
			{
				root: ["."],
				alias: {
					// Core aliases:
					"@/assets": "./src/assets",
					"@/components": "./src/components",
					"@/constants": "./src/constants",
					"@/controller": "./src/controller",
					"@/helpers": "./src/helpers",
					"@/hooks": "./src/hooks",
					"@/interfaces": "./src/interfaces",
					"@/libs": "./src/libs",
					"@/navigation": "./src/navigation",
					"@/screens": "./src/screens",
					"@/store": "./src/store",
					"@/utils": "./src/utils",
				},
				extensions: [".js", ".jsx", ".ts", ".tsx"],
			},
		],
	],
};
