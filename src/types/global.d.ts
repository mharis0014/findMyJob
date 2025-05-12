/**
 * Global type definitions for React Native environment
 */

// Declare the performance API for React Native
interface Performance {
  now(): number
}

// Global object declaration for React Native
interface Global {
  performance?: Performance
  __DEV__?: boolean
}

// Use declare global to properly extend the global namespace
declare global {
  const performance: Performance | undefined
  const __DEV__: boolean
  const global: Global
}
