import React from 'react'

import {createNativeStackNavigator} from '@react-navigation/native-stack'

import {RootStackParamList} from '../constants/types'

import SplashScreen from '../screens/onboarding/SplashScreen'
import SelectUserTypeScreen from '../screens/onboarding/SelectUserTypeScreen'
import JobPostingNavigator from './JobPostingNavigator'
import JobSearchingNavigator from './JobSearchingNavigator'

const Stack = createNativeStackNavigator<RootStackParamList>()

const MainNavigator: React.FC = () => {
  return (
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
  )
}

export default MainNavigator
