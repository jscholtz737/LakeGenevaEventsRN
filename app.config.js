const { expo } = require("./app.json");

const googleMapsApiKey =
  process.env.GOOGLE_MAPS_API_KEY ||
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
const weatherApiKey = process.env.WEATHER_API_KEY;
const tomtomTrafficApiKey = process.env.TOMTOM_TRAFFIC_API_KEY;

if (googleMapsApiKey && !process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY) {
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY = googleMapsApiKey;
}

module.exports = {
  ...expo,
  plugins: [...(expo.plugins || []), "@react-native-community/datetimepicker"],
  extra: {
    ...(expo.extra || {}),
    googleMapsApiKey,
    weatherApiKey,
    tomtomTrafficApiKey,
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
