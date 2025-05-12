# Packages to Install for Enhanced Project

## Core Navigation Packages

```bash
yarn add @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs @react-navigation/native-stack react-native-screens react-native-safe-area-context
```

## Animation Packages

```bash
yarn add react-native-reanimated react-native-gesture-handler @react-navigation/shared-element react-native-shared-element lottie-react-native
```

## UI Enhancement Packages

```bash
yarn add react-native-fast-image react-native-vector-icons react-native-svg react-native-linear-gradient
```

## Performance Optimization

```bash
yarn add --dev react-native-bundle-analyzer
```

## State Management

```bash
yarn add zustand immer
```

## Utilities

```bash
yarn add date-fns lodash.debounce react-native-mmkv
```

## Development Tools

```bash
yarn add --dev @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react-hooks
```

## After Installation

After installing the packages, you need to update your babel.config.js to support Reanimated:

```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
}
```

And make sure to run pod install for iOS:

```bash
cd ios && pod install && cd ..
```

For Android, you may need to update the MainActivity.java to support gesture handler:

```java
// Add at the top of the file
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

// Then override the method in the MainActivity class
@Override
protected ReactActivityDelegate createReactActivityDelegate() {
  return new ReactActivityDelegate(this, getMainComponentName()) {
    @Override
    protected ReactRootView createRootView() {
      return new RNGestureHandlerEnabledRootView(MainActivity.this);
    }
  };
}
```
