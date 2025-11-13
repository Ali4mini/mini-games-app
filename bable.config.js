module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // This plugin must be the last one in the plugins array
      "react-native-reanimated/plugin",
    ],
  };
};
