import React from 'react'

import {createNativeStackNavigator} from '@react-navigation/native-stack'

import CompanyLogin from '../screens/jobposting/CompanyLogin'
import CompanySignup from '../screens/jobposting/CompanySignup'
import CompanyAppNavigator from './CompanyAppNavigator'

import {JobPostingStackParamList} from '../constants/types'

const Stack = createNativeStackNavigator<JobPostingStackParamList>()

const JobPostingNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CompanyLogin" component={CompanyLogin} options={{headerShown: false}} />
      <Stack.Screen name="CompanySignup" component={CompanySignup} options={{headerShown: false}} />
      <Stack.Screen
        name="CompanyAppNavigator"
        component={CompanyAppNavigator}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  )
}

export default JobPostingNavigator
