# Animation and Performance Optimization Guide

## Animations Implementation

### 1. Animation Libraries

For optimal performance and flexibility, we'll use a combination of libraries:

- **React Native Reanimated 2**: For complex, high-performance animations
- **React Native Gesture Handler**: For gesture-based interactions
- **Lottie**: For pre-designed complex animations
- **React Navigation Shared Element**: For shared element transitions
- **Animated API**: For simple animations where appropriate

### 2. Core Animation Components

Create reusable animation components:

```jsx
// src/components/common/Animated/FadeIn.tsx
import Animated, {FadeIn as ReanimatedFadeIn} from 'react-native-reanimated'

export const FadeIn = ({children, delay = 300, duration = 500}) => {
  return (
    <Animated.View entering={ReanimatedFadeIn.delay(delay).duration(duration)}>
      {children}
    </Animated.View>
  )
}
```

### 3. Micro-interactions

Add subtle animations for UI interactions:

- Button press animations
- Form field focus/blur animations
- Error/success state animations
- Loading state animations

Example of a pressable component with animation:

```jsx
// src/components/common/Button/AnimatedButton.tsx
import React from 'react'
import {Pressable} from 'react-native'
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated'

export const AnimatedButton = ({onPress, children, style}) => {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    }
  })

  const handlePressIn = () => {
    scale.value = withSpring(0.95)
  }

  const handlePressOut = () => {
    scale.value = withSpring(1)
  }

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  )
}
```

### 4. Screen Transitions

Enhance user experience with custom screen transitions:

```jsx
// Custom screen transition example
const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
}

const screenOptions = {
  headerShown: false,
  cardStyleInterpolator: ({current, layouts}) => {
    return {
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.height, 0],
            }),
          },
        ],
      },
    }
  },
  transitionSpec: {
    open: config,
    close: config,
  },
}
```

### 5. List Item Animations

For job listings and application lists:

```jsx
// src/components/job/JobCard/index.tsx
import Animated, {FadeInRight} from 'react-native-reanimated'

export const JobCard = ({job, index}) => {
  return (
    <Animated.View entering={FadeInRight.delay(index * 100).duration(300)} style={styles.container}>
      {/* Job card content */}
    </Animated.View>
  )
}
```

### 6. Shared Element Transitions

For seamless transitions between screens:

```jsx
// Job list to job detail transition
<SharedElement id={`job.${job.id}.image`}>
  <Image source={{uri: job.companyLogo}} style={styles.logo} />
</SharedElement>
```

## Performance Optimization Strategies

### 1. Component Optimization

#### A. Memoization

Prevent unnecessary re-renders with React.memo, useMemo, and useCallback:

```jsx
// Use React.memo for components that render often but rarely change
const JobCard = React.memo(({job}) => {
  // Component implementation
})

// Use useMemo for expensive calculations
const filteredJobs = useMemo(() => {
  return jobs.filter(job => job.salary > minSalary)
}, [jobs, minSalary])

// Use useCallback for functions passed to child components
const handleApply = useCallback(() => {
  // Implementation
}, [dependencies])
```

#### B. Virtualized Lists

Optimize list rendering with FlatList and SectionList:

```jsx
<FlatList
  data={jobs}
  renderItem={renderJobItem}
  keyExtractor={item => item.id}
  initialNumToRender={8}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

### 2. State Management Optimization

#### A. Selectors

Use selectors to access only the required parts of the state:

```jsx
// Using selectors with Zustand
const useJobsStore = create(set => ({
  jobs: [],
  loading: false,
  setJobs: jobs => set({jobs}),
  setLoading: loading => set({loading}),
}))

// Selectors
const useJobs = () => useJobsStore(state => state.jobs)
const useJobsLoading = () => useJobsStore(state => state.loading)

// In component
const jobs = useJobs()
const isLoading = useJobsLoading()
```

#### B. Context Optimization

Split contexts to prevent unnecessary re-renders:

```jsx
// Instead of one large context
const JobsContext = createContext()
const JobFiltersContext = createContext()
const JobActionsContext = createContext()
```

### 3. Image Optimization

#### A. Progressive Loading

Implement progressive image loading:

```jsx
<FastImage
  style={styles.image}
  source={{
    uri: job.companyLogo,
    priority: FastImage.priority.normal,
  }}
  resizeMode={FastImage.resizeMode.cover}
/>
```

#### B. Asset Preloading

Preload critical assets:

```jsx
// In splash screen or early in app lifecycle
const preloadAssets = async () => {
  const imageAssets = [
    require('../assets/images/logo.png'),
    require('../assets/images/default-avatar.png'),
  ]

  const imagePromises = imageAssets.map(asset => Asset.loadAsync(asset))
  const fontPromises = Font.loadAsync({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  })

  await Promise.all([...imagePromises, fontPromises])
}
```

### 4. Firebase Optimizations

#### A. Query Optimization

Optimize Firestore queries:

```jsx
// Instead of fetching all jobs
const jobsQuery = firestore()
  .collection('jobs')
  .where('location', '==', userLocation)
  .orderBy('postedAt', 'desc')
  .limit(20)

// Use compound queries with proper indexes
const jobsQuery = firestore()
  .collection('jobs')
  .where('category', '==', selectedCategory)
  .where('salary', '>=', minSalary)
  .orderBy('salary', 'asc')
  .limit(20)
```

#### B. Offline Support

Enable offline persistence:

```jsx
// In app initialization
firestore().settings({
  cacheSizeBytes: FirebaseFirestore.CACHE_SIZE_UNLIMITED,
})
firestore().enablePersistence({
  synchronizeTabs: true,
})
```

### 5. Code Splitting and Lazy Loading

Implement dynamic imports for code splitting:

```jsx
// Instead of immediate import
import HeavyComponent from './HeavyComponent'

// Use dynamic import
const HeavyComponent = React.lazy(() => import('./HeavyComponent'))

// With Suspense
;<Suspense fallback={<LoadingIndicator />}>
  <HeavyComponent />
</Suspense>
```

### 6. Bundle Size Optimization

#### A. Monitor Bundle Size

```bash
# Add bundle analyzer
yarn add --dev react-native-bundle-analyzer

# In package.json
"scripts": {
  "analyze-bundle": "react-native-bundle-analyzer"
}
```

#### B. Reduce Dependencies

Prefer smaller libraries or native implementations:

```jsx
// Instead of moment.js (large)
import {format} from 'date-fns'

// Instead of lodash (full package)
import debounce from 'lodash.debounce'
```

### 7. Memory Management

#### A. Clear Resources

Properly cleanup resources:

```jsx
useEffect(() => {
  const subscription = eventEmitter.addListener('event', handleEvent)

  return () => {
    subscription.remove()
  }
}, [])
```

#### B. Handle Large Lists

Implement infinite scrolling instead of loading all items:

```jsx
const fetchMoreJobs = () => {
  if (!isLoading && hasMoreJobs) {
    setPage(prevPage => prevPage + 1)
    fetchJobs(prevPage + 1)
  }
}

;<FlatList
  onEndReached={fetchMoreJobs}
  onEndReachedThreshold={0.5}
  ListFooterComponent={isLoading ? <ActivityIndicator /> : null}
/>
```
