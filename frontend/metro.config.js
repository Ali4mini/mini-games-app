// metro.config.js
const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add watch folder exclusions for backend directories
config.watchFolders = [
  ...config.watchFolders,
  // Add any additional watch folders here if needed
];

// Add resolver assetExts and sourceExts configurations
config.resolver = {
  ...config.resolver,
  blacklistRE: /backend\/volumes\/.*/,
  extraNodeModules: {
    ...config.resolver.extraNodeModules,
  },
};

// Add transformer configuration to ignore backend files
config.transformer = {
  ...config.transformer,
  experimentalImportSupport: false,
  inlineRequires: true,
};

module.exports = config;
