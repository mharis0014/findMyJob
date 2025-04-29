import React from 'react'
import {Image, View} from 'react-native'

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

import {AddJob, Chats, CompanyProfile, MyJobs, SearchCandidates} from '../screens/jobposting/tabs'

import ICONS from '../constants/icons'
import {colors} from '../constants/colors'
import {CompanyBottomTabsParamList} from '../constants/types'
import styles from '../styles/companyBottomTabsNavigator.styles'

const Tab = createBottomTabNavigator<CompanyBottomTabsParamList>()

const ICON_MAP = {
  MyJobs: ICONS.home_dark,
  SearchCandidates: ICONS.search_user,
  AddJob: ICONS.addition,
  Chats: ICONS.chat_dark,
  CompanyProfile: ICONS.user_dark,
}

const getTabBarIcon = (routeName: string, focused: boolean) => {
  const icon = ICON_MAP[routeName]

  const isCenter = routeName === 'AddJob'
  const tintColor = isCenter ? undefined : focused ? colors.red : colors.darkGray

  return (
    <View
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${routeName} tab`}
      style={[styles.tabButton, !isCenter && focused && styles.activeTab]}>
      <Image source={icon} style={[styles.icon, tintColor && {tintColor}]} resizeMode="contain" />
    </View>
  )
}

const CompanyBottomTabsNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({focused}) => getTabBarIcon(route.name, focused),
      })}>
      <Tab.Screen name="MyJobs" component={MyJobs} />
      <Tab.Screen name="SearchCandidates" component={SearchCandidates} />
      <Tab.Screen name="AddJob" component={AddJob} />
      <Tab.Screen name="Chats" component={Chats} />
      <Tab.Screen name="CompanyProfile" component={CompanyProfile} />
    </Tab.Navigator>
  )
}

export default CompanyBottomTabsNavigator
