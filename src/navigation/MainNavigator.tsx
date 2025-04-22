import React from 'react'

import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'

import {RootStackParamList} from '../constants/types'

import SplashScreen from '../screens/onboarding/SplashScreen'
import SelectUserTypeScreen from '../screens/onboarding/SelectUserTypeScreen'
import JobPostingNavigator from './JobPostingNavigator'
import JobSearchingNavigator from './JobSearchingNavigator'

const Stack = createNativeStackNavigator<RootStackParamList>()

const MainNavigator: React.FC = () => {
  console.log('Main Navigator')
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Splash" component={SplashScreen} options={{headerShown: false}} />
        <Stack.Screen
          name="SelectUserType"
          component={SelectUserTypeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="JobPostingNavigator"
          component={JobPostingNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="JobSearchingNavigator"
          component={JobSearchingNavigator}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigator
