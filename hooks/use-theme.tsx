import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Appearance } from "react-native";

import { Colors, type ThemeColors, type ThemeName } from "../constants/theme";

const STORAGE_KEY = "appearance-theme";

type ThemeContextValue = {
  colors: ThemeColors;
  setTheme: (theme: ThemeName) => void;
  theme: ThemeName;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<ThemeName>("light");

  React.useEffect(() => {
    let cancelled = false;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (cancelled) {
          return;
        }

        if (stored === "light" || stored === "dark") {
          setThemeState(stored);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    Appearance.setColorScheme(theme);
  }, [theme]);

  const setTheme = React.useCallback((nextTheme: ThemeName) => {
    setThemeState(nextTheme);
    AsyncStorage.setItem(STORAGE_KEY, nextTheme).catch(() => {});
  }, []);

  const value = React.useMemo(
    () => ({
      colors: Colors[theme],
      setTheme,
      theme,
    }),
    [setTheme, theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
