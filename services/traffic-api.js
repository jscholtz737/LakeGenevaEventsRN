import Constants from "expo-constants";
import React from "react";

const TOMTOM_TRAFFIC_API_KEY = Constants.expoConfig?.extra?.tomtomTrafficApiKey;
const TOMTOM_TRAFFIC_POINT = "42.59172,-88.43320";

export function useTraffic() {
  const [traffic, setTraffic] = React.useState({
    value: "X",
    isSuccess: false,
  });

  React.useEffect(() => {
    if (!TOMTOM_TRAFFIC_API_KEY) {
      setTraffic({ value: "X", isSuccess: false });
      return;
    }

    let isCancelled = false;

    const loadTraffic = async () => {
      try {
        const response = await fetch(
          `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${TOMTOM_TRAFFIC_API_KEY}&point=${TOMTOM_TRAFFIC_POINT}`,
        );

        if (!response.ok) {
          if (!isCancelled) {
            setTraffic({ value: "X", isSuccess: false });
          }
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
          if (!isCancelled) {
            setTraffic({ value: "X", isSuccess: false });
          }
          return;
        }

        const ratio = (freeFlowTravelTime / currentTravelTime).toFixed(1);

        if (!isCancelled) {
          setTraffic({ value: ratio, isSuccess: true });
        }
      } catch (error) {
        if (!isCancelled) {
          setTraffic({ value: "X", isSuccess: false });
        }
        console.warn("Unable to load traffic", error);
      }
    };

    void loadTraffic();

    return () => {
      isCancelled = true;
    };
  }, []);

  return traffic;
}
