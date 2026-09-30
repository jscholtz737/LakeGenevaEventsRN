/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

export type ThemeName = "light" | "dark";

export const Colors = {
  light: {
    background: "#F4F7FB",
    surface: "#FFFFFF",
    card: "#FFFFFF",
    text: "#10243A",
    mutedText: "#4A5D73",
    border: "#DCE4EC",
    divider: "#E8EDF2",
    searchBorder: "#D3DDE8",
    listBorder: "#DFE7EF",
    placeholder: "#6B7D90",
    accent: "#204A72",
    iconAccent: "#0B8F39",
    tabBar: "#FFFFFF",
    tabBarBorder: "#E8EDF2",
    tabIconDefault: "#687076",
    tabIconSelected: "#0a7ea4",
    statusBar: "dark" as const,
    overlay: "rgba(0, 0, 0, 0.24)",
    grabber: "#C7D2DE",
    imagePlaceholder: "#31465A",
    switchTrackOff: "#D3DDE8",
    switchTrackOn: "#204A72",
    switchThumb: "#FFFFFF",
    headerDivider: "#000000",
    resetButton: "#90EE90",
  },
  dark: {
    background: "#101820",
    surface: "#4C5664",
    card: "#4C5664",
    text: "#F4F7FB",
    mutedText: "#C5D0DC",
    border: "#6A7482",
    divider: "#6A7482",
    searchBorder: "#6A7482",
    listBorder: "#6A7482",
    placeholder: "#C5D0DC",
    accent: "#7EB6D9",
    iconAccent: "#3DDC84",
    tabBar: "#4C5664",
    tabBarBorder: "#6A7482",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#FFFFFF",
    statusBar: "light" as const,
    overlay: "rgba(0, 0, 0, 0.5)",
    grabber: "#4A5D73",
    imagePlaceholder: "#31465A",
    switchTrackOff: "#3A4E62",
    switchTrackOn: "#7EB6D9",
    switchThumb: "#FFFFFF",
    headerDivider: "#9AABC0",
    resetButton: "#3D8B3D",
  },
};

export type ThemeColors = (typeof Colors)[ThemeName];

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
