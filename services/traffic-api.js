import Constants from "expo-constants";
import React from "react";
import { AppState } from "react-native";

const TOMTOM_TRAFFIC_API_KEY = Constants.expoConfig?.extra?.tomtomTrafficApiKey;
const TOMTOM_TRAFFIC_POINT = "42.59172,-88.43320";

export function useTraffic() {
  const [traffic, setTraffic] = React.useState({
    value: "X",
    isSuccess: false,
  });

  const loadTraffic = React.useCallback(async () => {
    if (!TOMTOM_TRAFFIC_API_KEY) {
      setTraffic({ value: "X", isSuccess: false });
      return;
    }

    try {
      const response = await fetch(
        `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${TOMTOM_TRAFFIC_API_KEY}&point=${TOMTOM_TRAFFIC_POINT}`,
      );

      if (!response.ok) {
        setTraffic({ value: "X", isSuccess: false });
        return;
      }

      const payload = await response.json();
      const currentTravelTime =
        payload?.flowSegmentData?.currentTravelTime ?? null;
      const freeFlowTravelTime =
        payload?.flowSegmentData?.freeFlowTravelTime ?? null;

      if (
        typeof currentTravelTime !== "number" ||
        typeof freeFlowTravelTime !== "number" ||
        currentTravelTime <= 0
      ) {
        setTraffic({ value: "X", isSuccess: false });
        return;
      }

      const ratio = (freeFlowTravelTime / currentTravelTime).toFixed(1);

      setTraffic({ value: ratio, isSuccess: true });
    } catch (error) {
      setTraffic({ value: "X", isSuccess: false });
      console.warn("Unable to load traffic", error);
    }
  }, []);

  React.useEffect(() => {
    void loadTraffic();
  }, [loadTraffic]);

  React.useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        void loadTraffic();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [loadTraffic]);

  return traffic;
}
