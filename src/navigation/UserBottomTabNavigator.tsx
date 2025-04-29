import React from 'react'
import {Image, ImageSourcePropType, StyleSheet} from 'react-native'

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {scale} from 'react-native-size-matters'

import {Home, Inbox, JobApply, Profile} from '../screens/jobsearching/tabs'

import ICONS from '../constants/icons'
import {colors} from '../constants/colors'
import {UserBottomTabParamList} from '../constants/types'

type TabBarIconProps = {
  name: string
  focused: boolean
}

const getTabIcon = ({name, focused}: TabBarIconProps): ImageSourcePropType => {
  switch (name) {
    case 'Home':
      return focused ? ICONS.home_dark : ICONS.home_light
    case 'JobApply':
      return focused ? ICONS.send_dark : ICONS.send_light
    case 'Inbox':
      return focused ? ICONS.chat_dark : ICONS.chat_light
    case 'Profile':
      return focused ? ICONS.user_dark : ICONS.user_light
    default:
      return ICONS.home_light
  }
}

const Tab = createBottomTabNavigator<UserBottomTabParamList>()

const renderTabIcon = (routeName: string) => (props: {focused: boolean}) => (
  <Image
    source={getTabIcon({name: routeName, focused: props.focused})}
    style={styles.icon}
    resizeMode="contain"
  />
)

const UserBottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: renderTabIcon(route.name),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: styles.tabBarStyle,
        tabBarLabelStyle: styles.tabBarLabelStyle,
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="JobApply" component={JobApply} />
      <Tab.Screen name="Inbox" component={Inbox} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  icon: {
    width: scale(24),
    height: scale(24),
  },
  tabBarStyle: {
    backgroundColor: colors.white,
    height: 60,
  },
  tabBarLabelStyle: {
    fontSize: 12,
    marginBottom: 5,
  },
})

export default UserBottomTabNavigator
