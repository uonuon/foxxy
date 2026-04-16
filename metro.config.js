const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Register .riv as a binary asset so we can `require()` Rive files.
config.resolver.assetExts = [...config.resolver.assetExts, "riv"];

module.exports = withNativeWind(config, { input: "./global.css" });
