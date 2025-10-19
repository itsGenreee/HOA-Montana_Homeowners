// theme.ts
import { MD3LightTheme as DefaultTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // React Native Paper generated light theme colors
    primary: "rgb(153, 70, 28)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(255, 219, 205)",
    onPrimaryContainer: "rgb(54, 15, 0)",
    secondary: "rgb(121, 89, 0)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(255, 222, 161)",
    onSecondaryContainer: "rgb(38, 25, 0)",
    tertiary: "rgb(103, 95, 48)", 
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(239, 227, 169)",
    onTertiaryContainer: "rgb(32, 28, 0)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(255, 251, 255)",
    onBackground: "rgb(32, 26, 24)",
    surface: "rgb(255, 251, 255)",
    onSurface: "rgb(32, 26, 24)",
    surfaceVariant: "rgb(245, 222, 213)",
    onSurfaceVariant: "rgb(83, 68, 62)",
    outline: "rgb(133, 115, 108)",
    outlineVariant: "rgb(216, 194, 186)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(54, 47, 44)",
    inverseOnSurface: "rgb(251, 238, 234)",
    inversePrimary: "rgb(255, 181, 150)",
    elevation: {
      level0: "transparent",
      level1: "rgb(250, 242, 244)",
      level2: "rgb(247, 237, 237)",
      level3: "rgb(244, 231, 230)",
      level4: "rgb(243, 229, 228)",
      level5: "rgb(241, 226, 223)"
    },
    surfaceDisabled: "rgba(32, 26, 24, 0.12)",
    onSurfaceDisabled: "rgba(32, 26, 24, 0.38)",
    backdrop: "rgba(59, 45, 40, 0.4)"
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // React Native Paper generated dark theme colors
    primary: "rgb(255, 181, 150)",
    onPrimary: "rgb(88, 30, 0)",
    primaryContainer: "rgb(122, 47, 5)",
    onPrimaryContainer: "rgb(255, 219, 205)",
    secondary: "rgb(243, 191, 72)",
    onSecondary: "rgb(64, 45, 0)",
    secondaryContainer: "rgb(92, 67, 0)",
    onSecondaryContainer: "rgb(255, 222, 161)",
    tertiary: "rgb(210, 199, 143)",
    onTertiary: "rgb(55, 49, 6)",
    tertiaryContainer: "rgb(78, 71, 27)",
    onTertiaryContainer: "rgb(239, 227, 169)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "rgb(32, 26, 24)",
    onBackground: "rgb(237, 224, 219)",
    surface: "rgb(32, 26, 24)",
    onSurface: "rgb(237, 224, 219)",
    surfaceVariant: "rgb(83, 68, 62)",
    onSurfaceVariant: "rgb(216, 194, 186)",
    outline: "rgb(160, 141, 133)",
    outlineVariant: "rgb(83, 68, 62)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(237, 224, 219)",
    inverseOnSurface: "rgb(54, 47, 44)",
    inversePrimary: "rgb(153, 70, 28)",
    elevation: {
      level0: "transparent",
      level1: "rgb(43, 34, 30)",
      level2: "rgb(50, 38, 34)",
      level3: "rgb(57, 43, 38)",
      level4: "rgb(59, 45, 39)",
      level5: "rgb(63, 48, 42)"
    },
    surfaceDisabled: "rgba(237, 224, 219, 0.12)",
    onSurfaceDisabled: "rgba(237, 224, 219, 0.38)",
    backdrop: "rgba(59, 45, 40, 0.4)"
  },
};

// For backward compatibility, you can keep the original export
export const theme = lightTheme;