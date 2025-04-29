import React from 'react'

import {createDrawerNavigator} from '@react-navigation/drawer'

import CustomDrawer from '../screens/jobsearching/CustomDrawer'
import UserBottomTabNavigator from './UserBottomTabNavigator'

import {DrawerParamList} from '../constants/types'
import {colors} from '../constants/colors'

const Drawer = createDrawerNavigator<DrawerParamList>()

const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      screenOptions={{headerTintColor: colors.black}}
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen name="UserBottomTabsNavigator" component={UserBottomTabNavigator} />
    </Drawer.Navigator>
  )
}

export default DrawerNavigator
