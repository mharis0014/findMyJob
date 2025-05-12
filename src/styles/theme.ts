/**
 * App-wide theming and design system
 *
 * This provides consistent colors, spacing, and typography across the app.
 * It supports both light and dark modes with automatic system preference detection.
 */

import {Dimensions, PixelRatio, Platform} from 'react-native'
import {useColorScheme} from 'react-native'

// Device dimensions for responsive sizing
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window')

// Base sizing for consistent spacing
const baseWidth = 375 // Based on iPhone X width
const baseHeight = 812 // Based on iPhone X height

// Normalize size based on screen dimensions
export const normalize = (size: number, based = 'width') => {
  const newSize =
    based === 'height' ? (size * SCREEN_HEIGHT) / baseHeight : (size * SCREEN_WIDTH) / baseWidth
  return Math.round(PixelRatio.roundToNearestPixel(newSize))
}

// Spacing system
export const spacing = {
  xs: normalize(4),
  s: normalize(8),
  m: normalize(16),
  l: normalize(24),
  xl: normalize(32),
  xxl: normalize(48),
}

// Typography system with consistent font sizes and weights
export const typography = {
  size: {
    xs: normalize(12),
    s: normalize(14),
    m: normalize(16),
    l: normalize(18),
    xl: normalize(20),
    xxl: normalize(24),
    xxxl: normalize(32),
  },
  weight: {
    thin: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
  },
  family: {
    base: Platform.select({
      ios: 'Avenir-Book',
      android: 'Roboto',
    }),
    medium: Platform.select({
      ios: 'Avenir-Medium',
      android: 'Roboto-Medium',
    }),
    bold: Platform.select({
      ios: 'Avenir-Heavy',
      android: 'Roboto-Bold',
    }),
  },
}

// Border radius system
export const borderRadius = {
  xs: normalize(4),
  s: normalize(8),
  m: normalize(12),
  l: normalize(16),
  xl: normalize(24),
  round: normalize(999),
}

// Shadow styles for iOS and Android
export const shadow = {
  small: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 2,
    },
  }),
  medium: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
  }),
  large: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.2,
      shadowRadius: 12,
    },
    android: {
      elevation: 6,
    },
  }),
}

// Color palette
const palette = {
  // Primary colors
  blue: {
    100: '#E6F2FF',
    200: '#B3D9FF',
    300: '#80BFFF',
    400: '#4DA6FF',
    500: '#1A8CFF', // Primary
    600: '#0073E6',
    700: '#0059B3',
    800: '#004080',
    900: '#00264D',
  },

  // Neutral colors
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Semantic colors
  green: {
    100: '#DCFCE7',
    500: '#22C55E',
    700: '#15803D',
  },
  red: {
    100: '#FEE2E2',
    500: '#EF4444',
    700: '#B91C1C',
  },
  yellow: {
    100: '#FEF3C7',
    500: '#F59E0B',
    700: '#B45309',
  },

  // Basic colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
}

// Light theme colors
const lightTheme = {
  primary: palette.blue[500],
  primaryLight: palette.blue[300],
  primaryDark: palette.blue[700],

  background: {
    primary: palette.white,
    secondary: palette.gray[50],
    tertiary: palette.gray[100],
  },

  text: {
    primary: palette.gray[900],
    secondary: palette.gray[600],
    tertiary: palette.gray[400],
    inverted: palette.white,
  },

  border: {
    light: palette.gray[200],
    medium: palette.gray[300],
    dark: palette.gray[400],
  },

  state: {
    success: palette.green[500],
    error: palette.red[500],
    warning: palette.yellow[500],
    successLight: palette.green[100],
    errorLight: palette.red[100],
    warningLight: palette.yellow[100],
  },
}

// Dark theme colors
const darkTheme = {
  primary: palette.blue[400],
  primaryLight: palette.blue[300],
  primaryDark: palette.blue[600],

  background: {
    primary: palette.gray[900],
    secondary: palette.gray[800],
    tertiary: palette.gray[700],
  },

  text: {
    primary: palette.gray[100],
    secondary: palette.gray[300],
    tertiary: palette.gray[500],
    inverted: palette.gray[900],
  },

  border: {
    light: palette.gray[700],
    medium: palette.gray[600],
    dark: palette.gray[500],
  },

  state: {
    success: palette.green[500],
    error: palette.red[500],
    warning: palette.yellow[500],
    successLight: palette.green[700],
    errorLight: palette.red[700],
    warningLight: palette.yellow[700],
  },
}

// Hook to get the current theme based on system preference
export const useTheme = () => {
  const colorScheme = useColorScheme()
  return colorScheme === 'dark' ? darkTheme : lightTheme
}

// Common style patterns
export const commonStyles = {
  screen: {
    flex: 1,
    backgroundColor: 'background.primary', // Theme-aware color
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}

// Export for direct usage
export default {
  palette,
  spacing,
  typography,
  borderRadius,
  shadow,
  light: lightTheme,
  dark: darkTheme,
}
