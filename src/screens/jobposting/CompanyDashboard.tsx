import React, {useState} from 'react'
import {View, TouchableOpacity, Image, ImageSourcePropType} from 'react-native'

import {SafeAreaView} from 'react-native-safe-area-context'

import {colors} from '../../constants/colors'
import ICONS from '../../constants/icons'

import MyJobs from './tabs/MyJobs'
import SearchCandidates from './tabs/SearchCandidates'
import AddJob from './tabs/AddJob'
import Chats from './tabs/Chats'
import CompanyProfile from './tabs/CompanyProfile'

import styles from '../../styles/companyDashboard.styles'

type TabItem = {
  key: number
  icon: ImageSourcePropType
  Component: React.FC
}

// Tab items configuration
const tabItems: TabItem[] = [
  {key: 0, icon: ICONS.home_light, Component: MyJobs},
  {key: 1, icon: ICONS.search_user, Component: SearchCandidates},
  {key: 2, icon: ICONS.addition, Component: AddJob},
  {key: 3, icon: ICONS.chat_light, Component: Chats},
  {key: 4, icon: ICONS.user_light, Component: CompanyProfile},
]

const CompanyDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0)
  const CurrentScreen = tabItems[selectedTab].Component

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenContainer}>
        <CurrentScreen />
      </View>

      <View style={styles.tabBar}>
        {tabItems.map(({key, icon}) => {
          const isActive = key === selectedTab
          const isCenter = key === 2
          const tintColor = isCenter ? undefined : isActive ? colors.red : colors.darkGray

          return (
            <TouchableOpacity
              key={key}
              style={[styles.tabButton, isActive && styles.activeTab]}
              onPress={() => setSelectedTab(key)}>
              <Image
                source={icon}
                style={[styles.icon, tintColor && {tintColor}]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )
        })}
      </View>
    </SafeAreaView>
  )
}

export default CompanyDashboard
