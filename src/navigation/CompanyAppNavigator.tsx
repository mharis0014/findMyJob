import React from 'react'

import {createNativeStackNavigator} from '@react-navigation/native-stack'

import {CompanyAppStackParamList} from '../constants/types'

import CompanyBottomTabsNavigator from './CompanyBottomTabsNavigator'
import EditJob from '../screens/jobposting/EditJob'

const Stack = createNativeStackNavigator<CompanyAppStackParamList>()

const CompanyAppNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CompanyBottomTabsNavigator"
        component={CompanyBottomTabsNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen name="EditJob" component={EditJob} options={{headerShown: false}} />
    </Stack.Navigator>
  )
}

export default CompanyAppNavigator
