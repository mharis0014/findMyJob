import React from 'react'

import {createNativeStackNavigator} from '@react-navigation/native-stack'

import {JobSearchingStackParamList} from '../constants/types'
import DrawerNavigator from './DrawerNavigator'

const Stack = createNativeStackNavigator<JobSearchingStackParamList>()

const JobSearchingNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DrawerNavigator"
        component={DrawerNavigator}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  )
}

export default JobSearchingNavigator
