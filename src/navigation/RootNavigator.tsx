import React from 'react'

import {createNativeStackNavigator} from '@react-navigation/native-stack'

import {RootStackParamList} from '../constants/types'

import SplashScreen from '../screens/onboarding/SplashScreen'
import SelectUserTypeScreen from '../screens/onboarding/SelectUserTypeScreen'
import JobPostingNavigator from './JobPostingNavigator'
import JobSearchingNavigator from './JobSearchingNavigator'

const Stack = createNativeStackNavigator<RootStackParamList>()

const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="SelectUserType" component={SelectUserTypeScreen} />
      <Stack.Screen name="JobPostingNavigator" component={JobPostingNavigator} />
      <Stack.Screen name="JobSearchingNavigator" component={JobSearchingNavigator} />
    </Stack.Navigator>
  )
}

export default RootNavigator
