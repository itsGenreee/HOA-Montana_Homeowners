// theme.ts
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#A0522D',      // warm brown
    secondary: '#FFD580',    // pastel gold
    background: '#FFFDF7',   // soft cream
    surface: '#FFFFFF',      // white
    text: '#333333',         // dark gray
    onSurface: '#555555',    // secondary text
  },
};
