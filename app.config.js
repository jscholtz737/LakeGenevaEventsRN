const { expo } = require("./app.json");

const googleMapsApiKey =
  process.env.GOOGLE_MAPS_API_KEY ||
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

module.exports = {
  ...expo,
  extra: {
    ...(expo.extra || {}),
    googleMapsApiKey,
  },
  ios: {
    ...expo.ios,
    config: {
      ...(expo.ios?.config || {}),
      ...(googleMapsApiKey ? { googleMapsApiKey } : {}),
    },
  },
  android: {
    ...expo.android,
    config: {
      ...(expo.android?.config || {}),
      googleMaps: {
        ...(expo.android?.config?.googleMaps || {}),
        ...(googleMapsApiKey ? { apiKey: googleMapsApiKey } : {}),
      },
    },
  },
};
