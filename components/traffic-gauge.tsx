import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, {
    Circle,
    Defs,
    G,
    LinearGradient,
    Path,
    Polygon,
    Stop,
} from "react-native-svg";

type TrafficGaugeProps = {
  value: string | number;
  isSuccess: boolean;
};

export default function TrafficGauge({ value, isSuccess }: TrafficGaugeProps) {
  // Map traffic ratio to gauge: 1.0 -> far left, 0.5 -> far right.
  let rotation = 0;
  if (isSuccess) {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    const minValue = 0.5; //traffic api value for high congestion
    const maxValue = 1.0; //traffic api value for low congestion
    const clampedValue = Math.max(minValue, Math.min(numValue, maxValue));
    const normalized = (maxValue - clampedValue) / (maxValue - minValue);
    rotation = normalized * 180;
  } else {
    // Show neutral position (90 degrees) for error state
    rotation = 90;
  }

  return (
    <View style={styles.container}>
      <Svg width={72} height={42} viewBox="0 0 120 70">
        <Defs>
          <LinearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#0B8F39" stopOpacity="1" />
            <Stop offset="50%" stopColor="#FFB800" stopOpacity="1" />
            <Stop offset="100%" stopColor="#B42318" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Gauge arc background */}
        <Path
          d="M 20 60 A 40 40 0 0 1 100 60"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Gauge outline */}
        <Path
          d="M 20 60 A 40 40 0 0 1 100 60"
          fill="none"
          stroke="#E8EDF2"
          strokeWidth="1"
          opacity="0.5"
        />

        {/* Tick marks */}
        <G stroke="#4A5D73" strokeWidth="1" opacity="0.6">
          <Path d="M 22 60 L 24 50" />
          <Path d="M 40 25 L 45 18" />
          <Path d="M 60 20 L 60 10" />
          <Path d="M 80 25 L 75 18" />
          <Path d="M 98 60 L 96 50" />
        </G>

        {/* Center circle (pivot point) */}
        <Circle cx="60" cy="60" r="4" fill="#10243A" />

        {/* Pointer needle - rotated based on value */}
        <G transform={`translate(60, 60) rotate(${rotation - 90})`}>
          <Polygon points="0,-30 -3,0 0,5 3,0" fill="#10243A" />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
