const googleMapsApiKey =
  process.env.GOOGLE_MAPS_API_KEY ||
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
const weatherApiKey = process.env.WEATHER_API_KEY;
const tomtomTrafficApiKey = process.env.TOMTOM_TRAFFIC_API_KEY;

if (googleMapsApiKey && !process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY) {
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY = googleMapsApiKey;
}

module.exports = ({ config }) => ({
  ...config,
  plugins: [
    ...(config.plugins || []),
    "@react-native-community/datetimepicker",
    "expo-font",
    "expo-web-browser",
  ],
  extra: {
    ...(config.extra || {}),
    googleMapsApiKey,
    weatherApiKey,
    tomtomTrafficApiKey,
  },
  ios: {
    ...config.ios,
    config: {
      ...(config.ios?.config || {}),
      ...(googleMapsApiKey ? { googleMapsApiKey } : {}),
    },
  },
  android: {
    ...config.android,
    config: {
      ...(config.android?.config || {}),
      googleMaps: {
        ...(config.android?.config?.googleMaps || {}),
        ...(googleMapsApiKey ? { apiKey: googleMapsApiKey } : {}),
      },
    },
  },
});
