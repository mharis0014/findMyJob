# Professional Navigation Structure

## Navigation Architecture

```
AppNavigator (Stack Navigator)
├── SplashScreen
├── OnboardingNavigator (Stack Navigator) - First time users only
│   ├── IntroScreen
│   ├── FeatureHighlightsScreen
│   └── PersonalizationScreen
├── AuthNavigator (Stack Navigator) - When logged out
│   ├── LoginScreen
│   ├── RegisterScreen
│   ├── ForgotPasswordScreen
│   └── VerificationScreen
└── MainNavigator (Stack Navigator) - When logged in
    ├── BottomTabNavigator
    │   ├── HomeNavigator (Stack Navigator)
    │   │   ├── HomeScreen
    │   │   ├── NotificationsScreen
    │   │   └── SearchHistoryScreen
    │   ├── JobSearchNavigator (Stack Navigator)
    │   │   ├── JobSearchScreen
    │   │   ├── JobFiltersScreen
    │   │   └── SavedSearchesScreen
    │   ├── ApplicationsNavigator (Stack Navigator)
    │   │   ├── ApplicationsScreen
    │   │   ├── ApplicationStatsScreen
    │   │   └── UpcomingInterviewsScreen
    │   └── ProfileNavigator (Stack Navigator)
    │       ├── ProfileScreen
    │       ├── EditProfileScreen
    │       ├── SettingsScreen
    │       └── HelpScreen
    ├── JobDetailScreen (Modal presentation)
    ├── CompanyDetailScreen (Modal presentation)
    ├── ApplicationFormScreen (Modal presentation)
    ├── ChatScreen
    └── NotificationSettingsScreen
```

## Implementation Strategy

### 1. Type Safety

The navigation will be fully typed using TypeScript to provide auto-completion and type-checking for navigation params:

```typescript
// Example navigation type definitions
export type RootStackParamList = {
  Splash: undefined
  Auth: NavigatorScreenParams<AuthStackParamList>
  Main: NavigatorScreenParams<MainStackParamList>
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>
}

export type AuthStackParamList = {
  Login: undefined
  Register: undefined
  ForgotPassword: undefined
  Verification: {email: string}
}

export type MainStackParamList = {
  BottomTabs: NavigatorScreenParams<BottomTabParamList>
  JobDetail: {jobId: string}
  CompanyDetail: {companyId: string}
  ApplicationForm: {jobId: string}
  Chat: {chatId: string; recipientName: string}
  NotificationSettings: undefined
}

// More type definitions...
```

### 2. Nested Navigation Best Practices

- Use `useIsFocused` for screen-specific side effects
- Properly manage component lifecycles
- Implement state persistence for specific navigators
- Handle deep linking properly

### 3. Navigation Animations and Transitions

- Modal screens slide up from bottom
- Stack screens slide in from right
- Custom transitions for important user flows (e.g., application submission success)
- Shared element transitions for enhanced UX (e.g., job card to job details)

### 4. Performance Optimizations

- Lazy load navigators and screens
- Properly handle component unmounting
- Optimize header configurations
- Cache route states appropriately

### 5. Navigation State Management

- Persist navigation state for a better user experience
- Handle authentication state changes appropriately
- Track navigation for analytics

### 6. Deep Linking

```javascript
// Example deep linking configuration
const linking = {
  prefixes: ['findmyjob://', 'https://findmyjob.com'],
  config: {
    screens: {
      Main: {
        screens: {
          BottomTabs: {
            screens: {
              JobSearchNavigator: {
                screens: {
                  JobDetail: 'job/:jobId',
                },
              },
              ApplicationsNavigator: {
                screens: {
                  Applications: 'applications',
                },
              },
            },
          },
          Chat: 'chat/:chatId',
        },
      },
    },
  },
}
```

### 7. Authentication Flow

The navigation structure handles authentication state by conditionally rendering either the AuthNavigator or MainNavigator based on the user's logged-in status.

```jsx
function AppNavigator() {
  const {isLoggedIn, isLoading} = useAuthState()
  const {isFirstLaunch} = useAppState()

  if (isLoading) {
    return <SplashScreen />
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isFirstLaunch && <Stack.Screen name="Onboarding" component={OnboardingNavigator} />}
        {isLoggedIn ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
```
