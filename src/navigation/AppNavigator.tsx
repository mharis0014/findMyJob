import React, {useEffect, useState} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'

import AuthNavigator from './AuthNavigator'
import MainNavigator from './MainNavigator'
import {useAuth} from '../features/auth/hooks/useAuth'
import SplashScreen from '../screens/SplashScreen'
import {linking} from './linking'
import {RootStackParamList} from './types'
import OnboardingNavigator from './OnboardingNavigator'

const Stack = createStackNavigator<RootStackParamList>()

/**
 * Root navigation component that handles authentication flow
 */
export default function AppNavigator() {
  const {isLoggedIn, isLoading} = useAuth()
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null)

  // Check if this is the first launch of the app
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem('@app_first_launch')
        if (value === null) {
          setIsFirstLaunch(true)
          // Save that app has been launched
          await AsyncStorage.setItem('@app_first_launch', 'false')
        } else {
          setIsFirstLaunch(false)
        }
      } catch (error) {
        console.error('Error checking first launch status:', error)
        setIsFirstLaunch(false)
      }
    }

    checkFirstLaunch()
  }, [])

  // Show splash screen while loading
  if (isLoading || isFirstLaunch === null) {
    return <SplashScreen />
  }

  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  )
}
